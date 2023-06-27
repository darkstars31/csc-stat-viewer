import * as React from "react";
import { Container } from "../common/components/container";
import {
    PlayerMappings,
    teamNameTranslator,
    getPlayerRatingIndex,
} from "../common/utils/player-utils";
import {getGridData} from "./player/grid-data"
import { GridContainer, GridStat } from "./player/grid-container";
import { Stat } from "./player/stat";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerNavigator } from "./player/player-navigator";
import { PlayerRatings } from "./player/playerRatings";
import { tiertopincategory } from "../svgs";
import { awardProperties, propertiesCurrentPlayerIsInTop10For, propertiesCurrentPlayerIsNumberOneFor } from "../common/utils/awards-utils";
import { nth } from "../common/utils/string-utils";
import { getTeammates } from "../common/utils/franchise-utils";
import { TeamSideRatingPie } from "../common/components/teamSideRatingPie";
import { KillsAssistsDeathsPie } from "../common/components/killAssetDeathPie";
import { Mmr } from "../common/components/mmr";
import { ExternalPlayerLinks } from "../common/components/externalPlayerLinks";


export function Player() {
    const divRef = React.useRef<HTMLDivElement>(null);
    const { players = [], franchises = [], loading, selectedDataOption } = useDataContext();
    const [, params] = useRoute("/players/:tier/:id");
    const tierParam = decodeURIComponent(params?.tier ?? "");
    const nameParam = decodeURIComponent(params?.id ?? "");
    const currentPlayer = players.find( p => p.name === nameParam);
    const currentPlayerStats = currentPlayer?.stats;//playerStats.find( player => player.Name === nameParam && currentPlayer?.tier.name === tierParam);

    React.useEffect(() => {
        divRef.current?.scrollIntoView();
    }, []);

    if( loading.isLoadingCscPlayers ){
        return <Container><Loading /></Container>;
    } else if ( !currentPlayer?.stats ){
		return <Container>
			No {selectedDataOption?.label} stats found for {nameParam} in {tierParam}
            <div className="text-xs mt-4 pl-4">
                {/* { linksToDifferentTier.length > 0 && <div>This player has stats in a different tier. {linksToDifferentTier}</div> } */}
            </div>
		</Container>
	}

    const playerRatingIndex = getPlayerRatingIndex( currentPlayer, players );

    // const rankingsInAllTiers = statsInDifferentTier.map( s => {
    //     const playerRatingIndexInThisTier = getPlayerRatingIndex(s, playerStats);
    //     return {
    //         tier: s.Tier,
    //         ranking: playerRatingIndexInThisTier+1
    //     };
    // });

    const { 
        Team, Rating, GP,
        kills, assists, deaths,
        twoK: twoKills, threeK: threeKills, fourK: fourKills, fiveK: aces,
        hs, kast, adr, kr: avgKillsPerRound,
        cl_1: clutch1v1, cl_2: clutch1v2, cl_3: clutch1v3, cl_4: clutch1v4, cl_5: clutch1v5,
        peak, pit, form, consistency: ratingConsistency,
        ef, 
        // "EF/F": enemiesFlashedPerFlash, "Blind/EF": enemyBlindTime, fAssists, utilDmg,
        // "Xnade": nadeDmgPerFrag, 
        util: utilThrownPerMatch,
        odr: openDuelPercentage, "odaR": openDuelsPerRound, 
        // "entriesR": TsidedEntryFragsPerRound, 
        // "eaR": avgRoundsOpenDuelOnTside,
		"tradesR": tradesPerRound, "savesR": savesPerRound, 
        // RWK,
        adp, 
        // ctADP, tADP,
        impact, 
        // IWR, kpa,
		multiR: multiKillRound, clutchR: clutchPerRound,
		suppR, suppXR, 
        // sRate, 
        tRatio,
        // ATD,
		// "lurks/tR": lurksPerTsideRound, "wlp/L": lurkPointsEarned, "AWP/ctr": awpKillsCTside,
		rounds, 
        // "MIP/r": mvpRounds, "K/ctr": killsCTside,
         awpR: awpKillsPerRound,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...playerRest 
    } = currentPlayerStats!;

    const teamAndFranchise = currentPlayer?.team?.franchise ? `${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}` : teamNameTranslator(currentPlayer);
    const teammates = getTeammates( currentPlayer, players, franchises);
    
    const numberOneProperties = propertiesCurrentPlayerIsNumberOneFor(currentPlayer, players, awardProperties);
    const top10Properties = propertiesCurrentPlayerIsInTop10For(currentPlayer, players, awardProperties);

    return (
        <>
        <div ref={divRef} />
        <Container>
           
            <PlayerNavigator player={currentPlayer} playerIndex={playerRatingIndex} />

            <Stat>
                <div className="flex space-x-4 pb-2">
                    <div className="object-contain">
                        { currentPlayer?.avatarUrl && <img className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px]" src={currentPlayer?.avatarUrl} alt="Missing Discord Profile"/> }
                        { !currentPlayer?.avatarUrl && <div className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px] border"/>}
                    </div>
                    <div className="text-left basis-3/4">
                        <div className="text-2xl font-extrabold text-white-100 md:text-4xl pb-0">
                            { currentPlayer.name ?? "n/a"}
                        </div>
                        <div className={"text-[1.1rem] pb-5"}>
                            <i>
                                <b>{currentPlayer.role ? currentPlayer.role : "n/a"}</b>{' — '} 
                                { currentPlayer?.team?.franchise.name ? 
                                    <Link to={`/franchises/${currentPlayer.team.franchise.name}/${currentPlayer.team.name}`}><span className="hover:cursor-pointer hover:text-blue-400">{currentPlayer?.team?.franchise.prefix} {currentPlayer?.team?.name}</span></Link>
                                    : <span>{teamNameTranslator(currentPlayer)}</span>                         
                                }                              
                            </i>
                        </div>
                        <ul className="text-[0.8rem]">
                            <li>
                                {String(playerRatingIndex+1).concat(nth(playerRatingIndex+1))} Overall in <b><i>{currentPlayer.tier.name}</i></b> | <Mmr player={currentPlayer}/> MMR
                            </li>
                            <li>
                                
                            </li>
                            {/* { rankingsInAllTiers.map(({tier, ranking}) => (
                                <li key={tier}>
                                    {ranking}{nth(ranking)} Overall in {" "}
                                    <Link className="text-blue-300 italic hover:text-blue-500" href={`/players/${tier}/${Name}`}>{tier}</Link>
                                </li>
                            )) } */}
                        </ul>

                    </div>
                    <div className="w-full">
                      <ExternalPlayerLinks player={currentPlayer} />
                    </div>
                </div>
                { currentPlayerStats &&
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
                        </div>
                        <PlayerRatings player={currentPlayer} />
                    </div>
                    <div className="justify-center">
                        <RoleRadar player={currentPlayer!}/>         
                    </div>
                </div>
}
                <div className="grid grid-cols-2 w-full">
                    <TeamSideRatingPie player={currentPlayer} />
                    <KillsAssistsDeathsPie player={currentPlayer} />
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
            <br />
            <div className="py-2">
            {/* Creating pairs of arrays from grid-data to display them side-by-side with a divider after unless there are no more arrays */}
                {Array(Math.ceil(getGridData(currentPlayer).length / 2)).fill(0).map((_, i) => {
                    const pair = getGridData(currentPlayer).slice(i * 2, (i + 1) * 2);
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
                            {i < Math.ceil(getGridData(currentPlayer).length / 2) - 1 && <br />}
                        </React.Fragment>
                    );
                })}
            </div>
            </Container>
        </>
    );
}