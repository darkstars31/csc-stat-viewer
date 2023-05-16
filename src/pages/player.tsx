import * as React from "react";
import { Container } from "../common/components/container";
import {
    PlayerMappings,
    getTotalPlayerAverages,
    teamNameTranslator,
    getPlayerRatingIndex,
    //getPlayersInTierOrderedByRating,
} from "../common/utils/player-utils";
import {getGridData} from "./player/grid-data"
import { GridContainer, GridStat } from "./player/grid-container";
import { Stat } from "./player/stat";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerStats } from "../models";
import { PlayerNavigator } from "./player/player-navigator";
//import { TeamSideRatingPie } from "../common/components/teamSideRatingPie";
import { PlayerRatings } from "./player/playerRatings";
import { tiertopincategory } from "../svgs";
import { awardProperties, propertiesCurrentPlayerIsInTop10For, propertiesCurrentPlayerIsNumberOneFor } from "../common/utils/awards-utils";
import { nth } from "../common/utils/string-utils";
import { getTeammates } from "../common/utils/franchise-utils";


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

    const tierPlayerAverages = getTotalPlayerAverages( playerStats, { tier: currentPlayerStats?.Tier} );
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...playerRest 
    } = currentPlayerStats!;

    const teamAndFranchise = currentPlayer?.team?.franchise ? `${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}` : teamNameTranslator(currentPlayer);
    const teammates = getTeammates( currentPlayer, players, franchises);
    
    const numberOneProperties = propertiesCurrentPlayerIsNumberOneFor(currentPlayerStats, playerStats, awardProperties);
    const top10Properties = propertiesCurrentPlayerIsInTop10For(currentPlayerStats, playerStats, awardProperties);

    return (
        <>
        <div ref={divRef} />
        <Container>
           
            <PlayerNavigator player={currentPlayerStats} playerIndex={playerRatingIndex} />

            <Stat>
                <div className="flex space-x-4 pb-2">
                    <div className="object-contain">
                        { currentPlayer?.avatarUrl && <img className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px]" src={currentPlayer?.avatarUrl} alt="Missing Discord Profile"/> }
                        { !currentPlayer?.avatarUrl && <div className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px] border"/>}
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-extrabold text-white-100 md:text-4xl pb-0">
                            { Name ?? "n/a"}
                        </div>
                        <div className={"text-[1.1rem] pb-5"}>
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
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="space-y-2">
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
				<div className="text-xs mt-4">
					Impact On Rounds Won {IWR} (tier average {tierPlayerAverages.average["IWR"]}) - { (((IWR/tierPlayerAverages.average["IWR"])-1)*100).toFixed(2)}%
				</div>
                </div>
            </Stat>

            { teammates.length > 0 && false && // TODO: fix weird bug in logic that shows same teammate twice
            <div>
                Teammates - {teamAndFranchise}
                <div className="grid grid-cols-1 md:grid-cols-5">
                { teammates.map( teammate => 
                        <Link key={`closeby-${teammate.name}`} to={`/players/${teammate.tier.name}/${teammate.name}`}>
                        <div
                            style={{userSelect:'none', lineHeight: '95%' }}
                            className="my-[5px] mr-4 flex h-[32px] cursor-pointer items-center rounded-[4px] bg-[#eceff1] px-[12px] py-0 text-[11px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none hover:!shadow-none active:bg-[#cacfd1] dark:bg-midnight2 dark:text-neutral-200">
                            <img className="my-0 -ml-[12px] mr-[8px] h-[inherit] w-[inherit] rounded-[4px]" src={teammate?.avatarUrl} alt=""/>
                            {teammate.name}
                        </div>
                    </Link>
                    )
                }
                </div>
            </div> }
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <>
            {/* Creating pairs of arrays from grid-data to display them side-by-side with a divider after unless there are no more arrays */}
                {Array(Math.ceil(getGridData(currentPlayerStats).length / 2)).fill(0).map((_, i) => {
                    const pair = getGridData(currentPlayerStats).slice(i * 2, (i + 1) * 2);
                    return (
                        <React.Fragment key={`pair-${i}`}>
                            <GridContainer>
                                {pair.map((section, sectionIndex) => (
                                    <div key={`section-${i * 2 + sectionIndex}`} className="grid grid-cols-1 gap-2 p-2 h-fit">
                                        {section.map(({ name, value, rowIndex }, statIndex) => (
                                            <GridStat
                                                key={`stat-${i * 2 + sectionIndex}-${statIndex}`}
                                                name={name}
                                                value={value}
                                                rowIndex={rowIndex}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </GridContainer>
                            {i < Math.ceil(getGridData(currentPlayerStats).length / 2) - 1 && (
                                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
                            )}
                        </React.Fragment>
                    );
                })}
            </>
            </Container>
        </>
    );
}