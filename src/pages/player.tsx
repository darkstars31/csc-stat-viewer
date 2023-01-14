import * as React from "react";
import { Container } from "../common/components/container";
import { Pill } from "../common/components/pill";
import { PlayerMappings, TotalPlayerAverages, teamNameTranslator, tierColorClassNames } from "./player-utils";
import { getSteamApiPlayerSummeries } from "../dao/steamApiDao";
import { Tooltip } from "../common/components/tooltip";
import { useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
//import { PlayerRadar } from "../common/components/charts/radar";
//import { PieChart } from "../common/components/charts/pie";

function Stat( { title, value, children }: { title?:string, value?: string|number, children?: React.ReactNode | React.ReactNode[] } ) {
    return (
        <div className="mb-4 flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center dark:border-gray-800">
          { title && <dt className="order-last text-m font-medium text-gray-500 dark:text-gray-400">
            {title}
          </dt> }
          { value && <dd className="text-2xl font-extrabold text-blue-600 md:text-4xl">
            {value}
          </dd> }
          <div className="pt-4"> {children} </div>
        </div>
    );
}

export function Player() {
    const { season10CombinePlayers = [], isLoading } = useDataContext();
    const [, params] = useRoute("/players/:tier/:id");
    const player = season10CombinePlayers.find( player => player.Name === params?.id && player.Tier === params?.tier);
    //const allPlayerAverages = TotalPlayerAverages( season10CombinePlayers );
    const tierPlayerAverages = TotalPlayerAverages( season10CombinePlayers, { tier: player?.Tier} );
    if( player?.Steam ) {
        getSteamApiPlayerSummeries( [ player.Steam ] ).then( data => console.info( "player", data ));
    }

    if( isLoading ){
        return <Container>
                <Loading />
            </Container>;
    }

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
        ...playerRest 
    } = player!;

    return (
        <Container>
            <Stat value={ Name ?? "n/a"}>
                <Pill label={Tier} color={`bg-${(tierColorClassNames as any)[Tier]}-300`} />
                <Pill label={ppR} color="bg-red-300" />
                <Pill label={teamNameTranslator(Team)} color="bg-blue-300" />
                <Tooltip content={
                    <>
                        <div>Trending {Form > Rating ? "Up" : "Down"} in last 3 games</div>
                        <div>Consistency: {ratingConsistency}σ ({ratingConsistency < tierPlayerAverages.avgRatingConsistency ? "More" : "Less"} than avg in Tier)</div>
                        <div>Peak {Peak} / Bottom {Pit}</div>
                        <div>CT: {ctRating} / T: {tRating}</div>
                    </>
                }>
                    <Pill label={`Rating ${Rating} ${Form > Rating ? "↑" : "↓"}`} color="bg-green-300" data-tooltip-target="rating-tooltip" data-tooltip-placement="top"/>
                </Tooltip>
                <Pill label={`Games Played ${GP}`} color="bg-orange-300" />
            </Stat>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <Stat title={"K / A / D"} value={ `${Kills} / ${Assists} / ${Deaths}` } />
                <Stat title={"K/D Ratio"} value={ `${(Kills/Deaths).toFixed(2)}` } />
                <Stat title={"Headshots"} value={ `${HS}% (${((HS/tierPlayerAverages.avgHeadShotPercentage)*100-100).toFixed(2)})` } />
                <Stat title={"2k / 3k / 4k"} value={ `${twoKills} / ${threeKills} / ${fourKills}` } />
                <Stat title={"Aces"} value={ `${aces}` } />
                <Stat title={"Damage / Kills per Round"} value={`${ADR} / ${avgKillsPerRound}`} />
                <Stat title={"Kill Assist Traded or Survived"} value={`${(KAST*100).toFixed(2)}%`} />
            </dl>
                {/* <Stat title={"Enemies Flashed per Flash / Blind Time Average / Nade Damage per Nade"} value={`${enemiesFlashedPerFlash} / ${enemyBlindTime} secs / ${nadeDmgPerFrag}`}/> */}
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {/* <Stat title={"Roles"} >
                    <PlayerRadar />
                </Stat>
                <Stat title={"Side"} >
                    <PieChart />
                </Stat> */}
                {/* <Stat title={"CT-side / T-side Rating"} value={ `${ctRating} / ${tRating}` } /> */}
                {/* <Stat title={"Rating Peak / Bottom"} value={ `${Peak} / ${Pit}` } /> */}

                <Stat title={"1v2/3/4/5 Clutch Rounds"} value={ `${clutch1v2} / ${clutch1v3} / ${clutch1v4} / ${clutch1v5}` } />
                <Stat title={"Average Death Placement"} value={ `${Math.round(ADP)} (CT ${Math.round(ctADP)}  T ${Math.round(tADP)})` } />
                <Stat title={"Flashed per Match / per Flash / Blind Time Average / Assists Per Match"} value={`${EF} / ${enemiesFlashedPerFlash} / ${enemyBlindTime} / ${F_Assists}` } />

                { Object.entries(playerRest ?? []).map( ( [key, value] ) => 
                    <Stat key={`${key}${value}`} title={PlayerMappings[key]} value={ value ?? "n/a"} />
                )}
            </dl>
        </Container>
    );
}