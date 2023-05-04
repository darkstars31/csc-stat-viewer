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
} from "../common/utils/player-utils";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
// import { PieChart } from "../common/components/charts/pie";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerStats } from "../models";
import { PlayerNagivator } from "./player/player-navigator";
import { TeamSideRatingPie } from "../common/components/teamSideRatingPie";
import { PlayerRatings } from "./player/playerRatings";

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

const GridContainer = ( { children }: { children: React.ReactNode | React.ReactNode[]} ) => <div className="grid grid-cols-2 gap-2 p-2 m-2">{children}</div>;


export function Player() {
    const { players = [], isLoading, selectedDataOption, featureFlags } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const [, params] = useRoute("/players/:tier/:id");

    const currentPlayer = players.find( p => p.name === decodeURIComponent(params?.id ?? "") && p.tier.name === params?.tier);
    const currentPlayerStats = playerStats.find( player => player.Name === decodeURIComponent(params?.id ?? "") && player.Tier === params?.tier);

    if( isLoading ){
        return <Container><Loading /></Container>;
    } else if ( !currentPlayerStats ){
		return <Container>
			No {selectedDataOption} stats found for {params?.id ?? "null"} 
		</Container>
	}

    const tierPlayerAverages = TotalPlayerAverages( playerStats, { tier: currentPlayerStats?.Tier} );
    const playerTeammates = getPlayerTeammates( currentPlayerStats!, playerStats);
    const playerInTierOrderedByRating = getPlayersInTierOrderedByRating( currentPlayerStats!, playerStats );
    const playerRatingIndex = getPlayerRatingIndex( currentPlayerStats!, playerStats );

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
    } = currentPlayerStats!;

    const teamAndFranchise = currentPlayer?.team?.franchise ? `${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}` : teamNameTranslator(currentPlayer!);

    return (
        <Container>
            <PlayerNagivator player={currentPlayerStats} playerIndex={playerRatingIndex} />
            <Stat>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                        <div className="flex flex-row">
                            <div className="p-2 m-4 min-w-[128px] min-h-[128px]">
                                { currentPlayer?.avatarUrl && <img className="rounded-xl min-w-[128px] min-h-[128px]" src={currentPlayer?.avatarUrl} alt="Missing Discord Profile"/> }
                                { !currentPlayer?.avatarUrl && <div className="rounded-xl min-w-[128px] min-h-[128px] border"></div>}
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-extrabold text-blue-500 md:text-4xl pb-2">
                                    { Name ?? "n/a"}
                                </div>          
                                <Pill label={teamAndFranchise} color="bg-blue-300" />
                                <Pill label={Tier} color={`bg-${(tierColorClassNames as any)[Tier]}-300`} />
                                { featureFlags.konami && <Pill label={`MMR ${currentPlayer?.mmr}`} />}
                                { ppR !== "-" && <Pill label={ppR} color="bg-red-300" /> }
                                {/* <Pill label={`Rating ${Rating} ${Form > Rating ? "↑" : "↓"}`} color="bg-green-300"/>                     */}
                                <Pill label={`Games Played ${GP}`} color="bg-orange-300" />
                                <Pill label={`Tier ${playerRatingIndex+1} of ${playerInTierOrderedByRating.length}`} color="bg-slate-300" />                 
                        </div>
                    </div>
                        <PlayerRatings player={currentPlayerStats} />
                        <div className="w-64 h-32">
                            <TeamSideRatingPie player={currentPlayerStats}/>
                        </div>
                        
                    </div>
                    <div>
                        <RoleRadar player={currentPlayerStats!}/>
                    </div>
                </div>
				<div>
					Impact On Rounds Won {IWR} (tier average {tierPlayerAverages.average.impactOnWonRounds}) - IWR/avg { (((IWR/tierPlayerAverages.average.impactOnWonRounds)-1)*100).toFixed(2)}%
				</div>
            </Stat>

			{ currentPlayerStats.GP < 3 && 
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