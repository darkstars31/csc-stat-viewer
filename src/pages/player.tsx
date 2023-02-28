import * as React from "react";
import { Container } from "../common/components/container";
import { Pill } from "../common/components/pill";
import { PlayerMappings, 
    TotalPlayerAverages, 
    teamNameTranslator, 
    tierColorClassNames, 
    getPlayerTeammates, 
    getPlayersInTierOrderedByRating, 
    getPlayerRatingIndex,
    getPlayersAroundSelectedPlayer,
} from "./player-utils";
// import { Tooltip } from "../common/components/tooltip";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
// import { PieChart } from "../common/components/charts/pie";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerGauge } from "../common/components/playerGauge";

function Stat( { title, value, children }: { title?:string, value?: string|number, children?: React.ReactNode | React.ReactNode[] } ) {
    if(!title && !value && !children ){
		return null;
	}
	return (
        <div className="mb-2 flex flex-col rounded-lg border border-gray-100 p-4 dark:border-gray-800">
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

function GridStat( { name, value, rowIndex }: { name: string, value: string | number | React.ReactNode, rowIndex: number }){
    return (
        <div className={`grid grid-cols-2 ${ rowIndex % 2 ? "bg-gray-600" : ""}`}>
			<div className={`text-left pl-2`}>
				{name}
			</div>
			<div className={`text-right pr-2`}>
				<strong>{value}</strong>
			</div>
        </div>
    );
}

const GridContainer = ( { children }: { children: React.ReactNode | React.ReactNode[]} ) => 
	<div className="grid grid-cols-2 gap-2 p-2 m-2">{children}</div>;

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
    const { playerStats = [], isLoading } = useDataContext();
    const [, params] = useRoute("/players/:tier/:id");
    const player = playerStats.find( player => player.Name === decodeURIComponent(params?.id ?? "") && player.Tier === params?.tier);
    const tierPlayerAverages = TotalPlayerAverages( playerStats, { tier: player?.Tier} );

    if( isLoading || !player ){
        return <Container><Loading /></Container>;
    }

    const playerTeammates = getPlayerTeammates( player!, playerStats);
    const playerInTierOrderedByRating = getPlayersInTierOrderedByRating( player!, playerStats );
    const playerRatingIndex = getPlayerRatingIndex( player!, playerStats );
    const playersAroundTarget = getPlayersAroundSelectedPlayer( playerInTierOrderedByRating, playerRatingIndex);

    const { 
        Name, Tier, Team, Rating, Steam, ppR, GP,
        Kills, Assists, Deaths,
        "2k": twoKills, "3k": threeKills, "4k": fourKills, "5k": aces,
        HS, KAST, ADR, "K/R": avgKillsPerRound,
        "CT #": ctRating, "T #": tRating,
        "1v1": clutch1v1, "1v2": clutch1v2, "1v3": clutch1v3, "1v4": clutch1v4, "1v5": clutch1v5,
        Peak, Pit, Form, "CONCY": ratingConsistency,
        EF, "EF/F": enemiesFlashedPerFlash, "Blind/EF": enemyBlindTime, F_Assists, UD,
        "X/nade": nadeDmgPerFrag, Util: utilThrownPerMatch,
        ODR: openDuelPercentage, "oda/R": openDuelsPerRound, "entries/R": TsidedEntryFragsPerRound, "ea/R": avgRoundsOpenDuelOnTside,
		"trades/R": tradesPerRound, "saves/R": savesPerRound, RWK,
        ADP, ctADP, tADP,
        Impact, IWR, KPA,
		"multi/R": multiKillRound, "clutch/R": clutchPerRound,
		SuppR, SuppXr, SRate, TRatio,
        ATD,
		"lurks/tR": lurksPerTsideRound, "wlp/L": lurkPointsEarned, "AWP/ctr": awpKillsCTside,
		Rounds, "MIP/r": mvpRounds, "K/ctr": killsCTside,
        Xdiff, "awp/R": awpKillsPerRound,
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
                        { ppR !== "-" && <Pill label={ppR} color="bg-red-300" /> }
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
                        <Pill label={`Tier  ${playerRatingIndex+1} of ${playerInTierOrderedByRating.length}`} color="bg-slate-300" />
                        <PlayerGauge player={player} />
                    </div>
                    <div>
                        <RoleRadar player={player!}/>
                    </div>
                </div>
				{/* <div>
					IWR {IWR} - tier Avg IWR {tierPlayerAverages.avgImpactOnWonRounds} - IWR/avg { ((IWR/tierPlayerAverages.avgImpactOnWonRounds)-1)*100}
				</div>
				<div>
				{((IWR/tierPlayerAverages.highest.impactOnRoundsWon[0].IWR)-1)*100}
				</div> */}
            </Stat>

			{ player.GP < 3 && 
			<div className="m-2 p-2 bg-yellow-700 rounded">
				Minimum games played threshold has not been met. Statistics shown may not provide an accurate picture of player skill or consistency.
			</div> 
			}

            <GridContainer>
                <div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={"Kills  /  Assists  /  Deaths"} value={`${Kills} / ${Assists} / ${Deaths}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["HS"]} value={`${HS}%`} rowIndex={1}/>
					<GridStat name="K/D Ratio" value={(Kills/Deaths).toFixed(2)} rowIndex={0}/>
					<GridStat name={PlayerMappings["ADR"]} value={`${ADR}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["KPA"]} value={`${KPA}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["KAST"]} value={`${(KAST*100).toFixed(2).replace(/[.,]00$/, "")}%`} rowIndex={1}/>
				</div>
				<div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["K/R"]} value={`${avgKillsPerRound}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["SRate"]} value={`${(SRate*100).toFixed(0)}%`} rowIndex={1}/>
					<GridStat name={PlayerMappings["ATD"]} value={`${ATD}s`} rowIndex={0}/>
					<GridStat name={PlayerMappings["multi/R"]} value={`${multiKillRound}`} rowIndex={1}/>
                    <GridStat name={PlayerMappings["clutch/R"]} value={`${clutchPerRound}`} rowIndex={0}/>
					<GridStat name={"2k  /  3k  /  4k  /  Ace"} value={`${twoKills}  /  ${threeKills}  /  ${fourKills}  /  ${aces}`} rowIndex={1}/>
				</div>
            </GridContainer>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
			<GridContainer>
                <div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["ODR"]} value={`${(openDuelPercentage*100).toFixed(0)}%`} rowIndex={0}/>
					<GridStat name={"Entry Frags T-side per Round"} value={`${TsidedEntryFragsPerRound}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["TRatio"]} value={`${(TRatio*100).toFixed(0)}%`} rowIndex={0}/>
					<GridStat name={PlayerMappings["saves/R"]} value={`${savesPerRound}`} rowIndex={1}/>
				</div>
				<div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["oda/R"]} value={`${openDuelsPerRound}`} rowIndex={0}/>
					<GridStat name={"Average Opening Duel T-side"} value={`${avgRoundsOpenDuelOnTside}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["trades/R"]} value={`${tradesPerRound}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["RWK"]} value={`${(RWK*100).toFixed(0)}%`} rowIndex={1}/>
				</div>
            </GridContainer>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
			<GridContainer>
                <div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["Util"]} value={`${utilThrownPerMatch}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["EF/F"]} value={`${enemiesFlashedPerFlash}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["F_Assists"]} value={`${F_Assists}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["X/nade"]} value={`${nadeDmgPerFrag}`} rowIndex={1}/>
				</div>
				<div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["EF"]} value={`${EF}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["Blind/EF"]} value={`${enemyBlindTime}s`} rowIndex={1}/>
					<GridStat name={PlayerMappings["UD"]} value={`${UD}`} rowIndex={0}/>
					<GridStat name="" value="" rowIndex={0}/>
				</div>
            </GridContainer>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
			<GridContainer>
                <div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["SuppR"]} value={`${SuppR}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["lurks/tR"]} value={`${lurksPerTsideRound}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["AWP/ctr"]} value={`${awpKillsCTside}`} rowIndex={0}/>
				</div>
				<div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["SuppXr"]} value={`${SuppXr}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["wlp/L"]} value={`${lurkPointsEarned}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["AWP/ctr"]} value={`${awpKillsCTside}`} rowIndex={0}/>
				</div>
            </GridContainer>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
			<GridContainer>
                <div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["Rounds"]} value={`${Rounds}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["ADP"]} value={`${ADP}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["ctADP"]} value={`${ctADP}`} rowIndex={0}/>
					<GridStat name={"1v1/2/3/4/5 Clutch Rounds"} value={`${clutch1v1} / ${clutch1v2} / ${clutch1v3} / ${clutch1v4} / ${clutch1v5}`} rowIndex={1}/>
				</div>
				<div className="grid grid-cols-1 gap-2 p-2">
					<GridStat name={PlayerMappings["MIP/r"]} value={`${mvpRounds}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["K/ctr"]} value={`${killsCTside}`} rowIndex={1}/>
					<GridStat name={PlayerMappings["tADP"]} value={`${tADP}`} rowIndex={0}/>
					<GridStat name={PlayerMappings["Xdiff"]} value={`${Xdiff}`} rowIndex={1}/>
				</div>
            </GridContainer>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                { playerTeammates.length > 0 && 
                    <Stat  title={`Teammates - ${Team}`}>
                        { playerTeammates.map( teammate => <div><Link key={`teammate-${teammate.Name}`} to={`/players/${teammate.Tier}/${teammate.Name}`}>{teammate.Name}</Link></div>)}
                    </Stat> 
                }
                
                <Stat  title={`Players close by`}>
                    { playersAroundTarget.playersAhead.map( (player, index) => <div>{playerRatingIndex-1+index}. <Link key={`closeby-${player.Name}`} to={`/players/${player.Tier}/${player.Name}`}>{player.Name}</Link></div>)}
                    <div>{playerRatingIndex+1}. <Link to={`/players/${player.Tier}/${player.Name}`}>{player.Name}</Link></div>
                    { playersAroundTarget.playersBehind.map( (player, index) => <div>{playerRatingIndex+2+index}. <Link key={`closeby-${player.Name}`} to={`/players/${player.Tier}/${player.Name}`}>{player.Name}</Link></div>)}
                </Stat> 
                
            </dl>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {/* <Stat title={"Impact / on Rounds Won"} value={ `${Impact} / ${IWR}` } /> */}

                { Object.entries(playerRest ?? []).map( ( [key, value] ) => 
                    <Stat key={`${key}${value}`} title={PlayerMappings[key]} value={ value! } />
                )}
            </dl>
        </Container>
    );
}