import * as React from "react";
import { Container } from "../common/components/container";
import { Pill } from "../common/components/pill";
import { PlayerMappings, TotalPlayerAverages, teamNameTranslator, tierColorClassNames, getPlayerTeammates, getPlayersInTierOrderedByRating, getPlayerRatingIndex } from "./player-utils";
// import { Tooltip } from "../common/components/tooltip";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
// import { PieChart } from "../common/components/charts/pie";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerGauge } from "../common/components/playerGauge";

function Stat( { title, value, children }: { title?:string, value?: string|number, children?: React.ReactNode | React.ReactNode[] } ) {
    return (
        <div className="mb-2 flex flex-col rounded-lg border border-gray-100 px-2 py-4 text-center dark:border-gray-800">
          { title && <dt className="order-last text-s font-medium text-gray-500 dark:text-gray-400">
            {title}
          </dt> }
          { value && <dd className="text-l font-extrabold text-blue-600 md:text-2xl">
            {value}
          </dd> }
          <div className="pt-2"> {children} </div>
        </div>
    );
}

// function tooltipContent( player){
//     return (
//                             <>
//                                 <div>Trending {Form > Rating ? "Up" : "Down"} in last 3 games</div>
//                                 <div>Consistency: {ratingConsistency}σ ({ratingConsistency < tierPlayerAverages.avgRatingConsistency ? "More" : "Less"} than avg in Tier)</div>
//                                 <div>Peak {Peak} / Bottom {Pit}</div>
//                                 <div>CT: {ctRating} / T: {tRating}</div>
//                             </>
//     );
// }

export function Player() {
    const { season10CombinePlayers = [], isLoading } = useDataContext();
    const [, params] = useRoute("/players/:tier/:id");
    const player = season10CombinePlayers.find( player => player.Name === params?.id && player.Tier === params?.tier);
    //const allPlayerAverages = TotalPlayerAverages( season10CombinePlayers );
    const tierPlayerAverages = TotalPlayerAverages( season10CombinePlayers, { tier: player?.Tier} );
    // TODO: Fetch Steam Profile Data
    // if( player?.Steam ) {
    //     getSteamApiPlayerSummeries( [ player.Steam ] ).then( data => console.info( "player", data ));
    // }

    if( isLoading || !player ){
        return <Container>
                <Loading />
            </Container>;
    }

    const playerTeammates = getPlayerTeammates( player!, season10CombinePlayers);
    const playerInTierOrderedByRating = getPlayersInTierOrderedByRating( player!, season10CombinePlayers );
    const playerRatingIndex = getPlayerRatingIndex( player!, season10CombinePlayers );

    const { 
        Name, Tier, Team, Rating, Steam, ppR, GP, "": _,
        Kills, Assists, Deaths,
        "2k": twoKills, "3k": threeKills, "4k": fourKills, "5k": aces,
        HS,
        KAST,
        ADR, "K/R": avgKillsPerRound,
        "CT #": ctRating, "T #": tRating,
        "1v1": clutch1v1, "1v2": clutch1v2, "1v3": clutch1v3, "1v4": clutch1v4, "1v5": clutch1v5,
        Peak, Pit, Form, "CONCY": ratingConsistency,
        EF, "EF/F": enemiesFlashedPerFlash, "Blind/EF": enemyBlindTime, F_Assists,
        "X/nade": nadeDmgPerFrag, Util: utilThrownPerMatch,
        ODR: openDuelPercentage, "oda/R": openDuelsPerRound, "entries/R": TsidedEntryFragsPerRound, "ea/R": avgRoundsOpenDuelOnTside,
        ADP, ctADP, tADP,
        Impact, IWR, KPA,
        SRate,
        TRatio,
        ATD,
        Xdiff, // Hidden Stats
        ...playerRest 
    } = player!;

    return (
        <Container>
            <Stat>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                        <div className="text-2xl font-extrabold text-blue-600 md:text-4xl">{ Name ?? "n/a"}</div>
                        <Pill label={Tier} color={`bg-${(tierColorClassNames as any)[Tier]}-300`} />
                        <Pill label={teamNameTranslator(Team)} color="bg-blue-300" />
                        <Pill label={ppR} color="bg-red-300" />
                        <div className="tooltip tooltip__dang" data-tip={`${
                            <>
                                <div>Trending {Form > Rating ? "Up" : "Down"} in last 3 games</div>
                                <div>Consistency: {ratingConsistency}σ ({ratingConsistency < tierPlayerAverages.avgRatingConsistency ? "More" : "Less"} than avg in Tier)</div>
                                <div>Peak {Peak} / Bottom {Pit}</div>
                                <div>CT: {ctRating} / T: {tRating}</div>
                            </>
                        }`}>
                        <Pill data-tooltip="test" label={`Rating ${Rating} ${Form > Rating ? "↑" : "↓"}`} color="bg-green-300" data-tooltip-target="rating-tooltip" data-tooltip-placement="top"/>
                        </div>
                        <Pill label={`Games Played ${GP}`} color="bg-orange-300" />
                        <Pill label={`Tier  ${playerRatingIndex} of ${playerInTierOrderedByRating.length}`} color="bg-slate-300" />
                        <PlayerGauge player={player} />
                    </div>
                    <div>
                        <RoleRadar player={player!}/>
                    </div>
                </div>
            </Stat>
            {/* <div className="grid grid-cols-2 gap-2">
				<div className="text-left">
						<strong>Headshot</strong>
				</div>
				<div className="text-right">
						12
				</div>

			</div> */}
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {/* <Stat title={"Side"} >
                    <PieChart options={
                        { series: [ 
                            { data: [ 
                                { name: "CT Rating", value: ctRating },{ name: "T Rating", value: tRating }
                            ]} 
                        ]
                        }}/>
                </Stat> */}
                <Stat title={"K / A / D"} value={ `${Kills} / ${Assists} / ${Deaths}` } />
                <Stat title={"K/D Ratio"} value={ `${(Kills/Deaths).toFixed(2)}` } />
                <Stat title={"Headshots"} value={ `${HS}%` }>
                    <div className="text-gray-500 text-m">({((HS/tierPlayerAverages.avgHeadShotPercentage)*100-100).toFixed(2)}% of avg in tier)</div>
                </Stat>
                <Stat title={"2k / 3k / 4k"} value={ `${twoKills} / ${threeKills} / ${fourKills}` } />
                { playerTeammates.length > 0 && 
                    <Stat  title={`Teammates - ${Team}`}>
                        { playerTeammates.map( teammate => <div><Link key={`teammate-${teammate.Name}`} to={`/players/${teammate.Tier}/${teammate.Name}`}>{teammate.Name}</Link></div>)}
                    </Stat> 
                }
                <Stat title={"Aces"} value={ `${aces}` } />
                <Stat title={"Damage / Kills per Round"} value={`${ADR} / ${avgKillsPerRound}`} />
                <Stat title={"Kill Assist Traded or Survived"} value={`${(KAST*100).toFixed(0)}%`} />
                <Stat title={"Survival Rate"} value={`${(SRate*100).toFixed(0)}%`} />
                <Stat title={"Deaths Traded Out"} value={`${(TRatio*100).toFixed(0)}%`} />
                <Stat title={"Average Alive Time"} value={`${ATD}s`} />
            </dl>
                {/* <Stat title={"Enemies Flashed per Flash / Blind Time Average / Nade Damage per Nade"} value={`${enemiesFlashedPerFlash} / ${enemyBlindTime} secs / ${nadeDmgPerFrag}`}/> */}
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {/* <Stat title={"CT-side / T-side Rating"} value={ `${ctRating} / ${tRating}` } /> */}
                {/* <Stat title={"Rating Peak / Bottom"} value={ `${Peak} / ${Pit}` } /> */}
                <Stat title={"Impact / on Rounds Won / Kills "} value={ `${Impact} / ${IWR} / ${KPA}` } />
                <Stat title={"1v2/3/4/5 Clutch Rounds"} value={ `${clutch1v2} / ${clutch1v3} / ${clutch1v4} / ${clutch1v5}` } />
                <Stat title={"Opening Duel / Open Duels per Round"} value={ `${(openDuelPercentage*100).toFixed(0)}% / ${openDuelsPerRound}` } />
                <Stat title={"Entry Frags T-side per Round / Avg Opening Duel T-side"} value={`${TsidedEntryFragsPerRound} / ${avgRoundsOpenDuelOnTside}`} />
                <Stat title={"Average Death Placement"} value={ `${Math.round(ADP)}` }>
                    <div className="text-gray-500 text-m">CT: {Math.round(ctADP)}  T: {Math.round(tADP)}</div>
                </Stat>
                <Stat title={"Flashed per Match / per Flash / Blind Time Average / Assists Per Match"} value={`${EF} / ${enemiesFlashedPerFlash} / ${enemyBlindTime} / ${F_Assists}` } />

                { Object.entries(playerRest ?? []).map( ( [key, value] ) => 
                    <Stat key={`${key}${value}`} title={PlayerMappings[key]} value={ value ?? "n/a"} />
                )}
            </dl>
        </Container>
    );
}