import * as React from "react";
import { Container } from "../common/components/container";
import {
    PlayerMappings,
    TotalPlayerAverages,
    teamNameTranslator,
    //getPlayerTeammates,
    getPlayerRatingIndex,
    //getPlayersInTierOrderedByRating,
    getTop10PlayersInTier3GP,
} from "../common/utils/player-utils";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerStats } from "../models";
import { PlayerNavigator } from "./player/player-navigator";
//import { TeamSideRatingPie } from "../common/components/teamSideRatingPie";
import { PlayerRatings } from "./player/playerRatings";
import {tiertopincategory} from "../svgs";

function Stat( { title, value, children }: { title?:string, value?: string|number, children?: React.ReactNode | React.ReactNode[] } ) {
    if(!title && !value && !children ){
		return null;
	}
	return (
        <div className="bg-midnight2 mb-2 flex flex-col rounded-lg border border-gray-100 p-4 dark:border-gray-800">
          { title && <dt className="order-last text-s font-medium text-gray-500 dark:text-gray-400">
            {title}
          </dt> }
          { value && <dd className="text-l font-extrabold text-blue-600 md:text-2xl">
            {value}
          </dd> }
          <div> {children} </div>
        </div>
    );
}

function GridStat( { name, value, rowIndex }: { name: string, value: string | number | React.ReactNode, rowIndex: number }){
    return (
        <div className={`grid grid-cols-2 ${ rowIndex % 2 ? "bg-midnight2" : ""}`}>
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
    const divRef = React.useRef<HTMLDivElement>(null);
    const { players = [], franchises = [], isLoading, selectedDataOption} = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const [, params] = useRoute("/players/:tier/:id");
    const tierParam = decodeURIComponent(params?.tier ?? "");
    const nameParam = decodeURIComponent(params?.id ?? "");
    const currentPlayer = players.find( p => p.name === nameParam);
    const currentPlayerStats = playerStats.find( player => player.Name === nameParam && player.Tier === tierParam);
    const statsInDifferentTier = playerStats.filter( player => player.Name === nameParam && player.Tier !== tierParam);
    const linksToDifferentTier = statsInDifferentTier.map( s => { 
        return <><br /><Link className="text-blue-400" to={`/players/${s.Tier}/${nameParam}`}>{s.Tier}</Link></>;
    });

    React.useEffect(() => {
        divRef.current?.scrollIntoView();
    }, []);

    if( isLoading ){
        return <Container><Loading /></Container>;
    } else if ( !currentPlayerStats ){
		return <Container>
			No {selectedDataOption} stats found for {nameParam} in {tierParam}
            <div className="text-xs mt-4 pl-4">
                This player has stats in a different tier. {linksToDifferentTier}
            </div>
		</Container>
	}

    const tierPlayerAverages = TotalPlayerAverages( playerStats, { tier: currentPlayerStats?.Tier} );
    //const playerTeammates = getPlayerTeammates( currentPlayerStats!, playerStats);
    //const playerInTierOrderedByRating = getPlayersInTierOrderedByRating( currentPlayerStats!, playerStats );
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

    const teamAndFranchise = currentPlayer?.team?.franchise ? `${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}` : teamNameTranslator(currentPlayer);
    const franchise = franchises.find( f => f.name === currentPlayer?.team?.franchise.name);
    const team = franchise?.teams.find( t => t.name === currentPlayer?.team?.name);
    const teamMates = players.filter( p => { 
        return p.team?.name === currentPlayer?.team?.name && p.tier.name === team?.tier.name && p.name !== currentPlayer?.name;
    });
    
    const nth = (n: string | number) => {
        return ["st", "nd", "rd"][((Number(n) + 90) % 100 - 10) % 10 - 1] || "th";
    };

    /* AWARDS logic */
    const isCurrentPlayerNumberOneForProperty = (
        currentPlayer: PlayerStats,
        allPlayers: PlayerStats[],
        property: keyof PlayerStats
    ): boolean => {
        if (currentPlayer[property] === 0) {
            return false;
        }
        const top10Players = getTop10PlayersInTier3GP(currentPlayer, allPlayers, property);
        const numberOnePlayer = top10Players[0];
        return numberOnePlayer && numberOnePlayer.Name === currentPlayer.Name;
    };

    const isCurrentPlayerInTop10ForProperty = (
        currentPlayer: PlayerStats,
        allPlayers: PlayerStats[],
        property: keyof PlayerStats
    ): boolean => {
        if (currentPlayer[property] === 0) {
            return false;
        }
        const top10Players = getTop10PlayersInTier3GP(currentPlayer, allPlayers, property);
        return top10Players.some(p => p.Name === currentPlayer.Name);
    };
    const propertiesCurrentPlayerIsInTop10For = (
        currentPlayer: PlayerStats,
        allPlayers: PlayerStats[],
        properties: (keyof PlayerStats)[]
    ): (keyof PlayerStats)[] => {
        return properties.filter((property) => isCurrentPlayerInTop10ForProperty(currentPlayer, allPlayers, property));
    };

    const propertiesCurrentPlayerIsNumberOneFor = (
        currentPlayer: PlayerStats,
        allPlayers: PlayerStats[],
        properties: (keyof PlayerStats)[]
    ): (keyof PlayerStats)[] => {
        return properties.filter((property) => isCurrentPlayerNumberOneForProperty(currentPlayer, allPlayers, property));
    };
    const properties = [
        'HS',
        'EF',
        'Kills',
        '2k',
        '3k',
        '4k',
        '5k',
        '1v1',
        '1v2',
        '1v3',
        '1v4',
        '1v5',
        'multi/R',
        'Impact',
        'Assists',
        'ADR',
        'F_Assists',
        'trades/R',
        'X/nade',
        'SuppR',
        'SuppXr',
        'KAST',
        'UD',
        'Util',
        'clutch/R',
        'entries/R',
        'IWR',
        'AWP/ctr',
        'wlp/L'] as (keyof PlayerStats)[]; // add properties here
    const numberOneProperties = propertiesCurrentPlayerIsNumberOneFor(currentPlayerStats, playerStats, properties);
    const top10Properties = propertiesCurrentPlayerIsInTop10For(currentPlayerStats, playerStats, properties);

    return (
        <>
        <div ref={divRef} />
        <Container>
           
            <PlayerNavigator player={currentPlayerStats} playerIndex={playerRatingIndex} />

            <Stat>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="p-[2.5%] space-y-4">
                        <div className="flex space-x-4 pb-[2.5%]">
                            <div className="object-contain">
                                { currentPlayer?.avatarUrl && <img className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px]" src={currentPlayer?.avatarUrl} alt="Missing Discord Profile"/> }
                                { !currentPlayer?.avatarUrl && <div className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px] border"/>}
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-extrabold text-white-100 md:text-4xl pb-0">
                                    { Name ?? "n/a"}
                                </div>
                                <div className={"text-[1.1rem pb-5"}>
                                    <i><b>{ppR.includes('-')?'RIFLER':ppR}</b>{' — '}{teamAndFranchise?.split("(").pop()?.replace(')', '').replace('>', '')}</i>
                                </div>
                                <ul className="text-[0.8rem]">
                                    <li>{String(playerRatingIndex+1).concat(nth(playerRatingIndex+1))} Overall in {Tier}</li>
                                    { statsInDifferentTier.length > 0 && <li> <div className="text-xs">
                                        This player also has stats in {linksToDifferentTier}
                                        </div>
                                    </li>
}
                                </ul>
                            </div>
                    </div>
                        <div className="p-[2.5%] space-y-4">
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-y-4 gap-x-4">
                                    {
                                        numberOneProperties.map((property) => (
                                            <div
                                                key={property}
                                                data-te-toggle={"tooltip"}
                                                title={PlayerMappings[property]}
                                                className="place-items-center flex h-fit w-fit whitespace-nowrap select-none rounded-[0.27rem] bg-yellow-400 px-[0.65em] pb-[0.25em] pt-[0.35em] text-left align-baseline text-[0.75em] font-bold leading-none text-neutral-700"
                                            >
                                                <button type="button" className="bg-midnight1 w-fit text-sm pointer-events-none transition duration-150 ease-in-out inline-block" disabled/>
                                                {property} <img className="h-fit w-fit max-w-[30px] pl-1 fill-neutral-700" src={`data:image/svg+xml;utf-8,${tiertopincategory}`} alt=""/>
                                            </div>
                                        ))
                                    }
                                    {
                                        top10Properties
                                            .filter((property) => !numberOneProperties.includes(property))
                                            .map((property) => (
                                                <div
                                                    data-te-toggle={"tooltip"}
                                                    title={PlayerMappings[property]}
                                                    key={property}
                                                    className="place-items-center flex h-fit w-fit select-none whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-left align-baseline text-[0.75em] font-bold leading-none text-success-700"
                                                >
                                                    <button type="button" className="bg-midnight1 w-fit text-sm pointer-events-none transition duration-150 ease-in-out inline-block" disabled/>
                                                    {property} Top 10
                                                    {/* #{index+1} - {PlayerMappings[property]} */}
                                                </div>
                                            ))
                                    }
                                </div>
                            </div>
                            {/*<div className="w-64 h-32">
                            <TeamSideRatingPie player={currentPlayerStats}/>
                        </div> */}
                        </div>
                        <PlayerRatings player={currentPlayerStats} />
                    </div>
                    <div className="place-content-center">
                        <RoleRadar player={currentPlayerStats!}/>
                    </div>

                </div>
				<div className="text-xs mt-4">
					Impact On Rounds Won {IWR} (tier average {tierPlayerAverages.average.impactOnWonRounds}) - { (((IWR/tierPlayerAverages.average.impactOnWonRounds)-1)*100).toFixed(2)}%
				</div>
            </Stat>

            { teamMates.length > 0 && false && // TODO: fix weird bug in logic that shows same teammate twice
            <div>
                Teammates - {teamAndFranchise}
                <div className="grid grid-cols-1 md:grid-cols-5">
                { teamMates.map( teamMate => 
                        <Link key={`closeby-${teamMate.name}`} to={`/players/${teamMate.tier.name}/${teamMate.name}`}>
                        <div
                            style={{userSelect:'none', lineHeight: '95%' }}
                            className="my-[5px] mr-4 flex h-[32px] cursor-pointer items-center rounded-[4px] bg-[#eceff1] px-[12px] py-0 text-[11px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none hover:!shadow-none active:bg-[#cacfd1] dark:bg-midnight2 dark:text-neutral-200">
                            <img className="my-0 -ml-[12px] mr-[8px] h-[inherit] w-[inherit] rounded-[4px]" src={teamMate?.avatarUrl} alt=""/>
                            {teamMate.name}
                        </div>
                    </Link>
                    )
                }
                </div>
            </div> }

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
                { Object.entries(playerRest ?? []).map( ( [key, value] ) => 
                    <Stat key={`${key}${value}`} title={PlayerMappings[key]} value={ value! } />
                )}
            </dl>
        </Container>
        </>
    );
}