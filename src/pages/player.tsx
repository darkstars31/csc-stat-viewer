import * as React from "react";
import { Container } from "../common/components/container";
import {
    teamNameTranslator,
    getPlayerRatingIndex,
} from "../common/utils/player-utils";
import { getGridData } from "./player/grid-data"
import { GridContainer, GridStat } from "./player/grid-container";
import { Stat } from "./player/stat";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerNavigator } from "./player/player-navigator";
import { PlayerRatings } from "./player/playerRatings";
import { nth } from "../common/utils/string-utils";
import { getTeammates } from "../common/utils/franchise-utils";
import { TeamSideRatingPie } from "../common/components/teamSideRatingPie";
import { PlayerRatingTrendGraph } from "../common/components/playerRatingGraph";
import { KillsAssistsDeathsPie } from "../common/components/killAssetDeathPie";
import { Mmr } from "../common/components/mmr";
import { ExternalPlayerLinks } from "../common/components/externalPlayerLinks";
import { PlayerAwards } from "./player/playerAwards";

export function Player() {
    const divRef = React.useRef<HTMLDivElement>(null);
    const { players = [], franchises = [], loading } = useDataContext();
    const [, params] = useRoute("/players/:tier/:id");
    //const tierParam = decodeURIComponent(params?.tier ?? "");
    const nameParam = decodeURIComponent(params?.id ?? "");
    const currentPlayer = players.find( p => p.name === nameParam);
    const currentPlayerStats = currentPlayer?.stats;

    React.useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    if( loading.isLoadingCscPlayers ){
        return <Container><Loading /></Container>;
    }

    if( !currentPlayer ){
        return <Container>x</Container>;
    }

    // else if ( !currentPlayer?.stats ){
	// 	return <Container>
	// 		No {selectedDataOption?.label} stats found for {nameParam} in {tierParam}
    //         <div className="text-xs mt-4 pl-4">
    //             {/* { linksToDifferentTier.length > 0 && <div>This player has stats in a different tier. {linksToDifferentTier}</div> } */}
    //         </div>
	// 	</Container>
	// }

    const teamAndFranchise = currentPlayer?.team?.franchise ? `${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}` : teamNameTranslator(currentPlayer);
    const teammates = getTeammates( currentPlayer, players, franchises);
    const playerRatingIndex = getPlayerRatingIndex( currentPlayer, players ) ?? 0;

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
                            { currentPlayer?.name ?? "n/a"}
                        </div>
                        <div className={"text-[1.1rem] pb-5"}>
                            <i>
                                <b>{currentPlayer?.role ? `${currentPlayer?.role} —` : ""}</b> 
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
                        </ul>

                    </div>
                    <div className="w-full">
                      <ExternalPlayerLinks player={currentPlayer} />
                    </div>
                </div>
                { currentPlayerStats &&
                    <div className="space-y-2">
                        <div className="space-y-2">                      
                            <PlayerAwards player={currentPlayer} players={players} />
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                                <PlayerRatings player={currentPlayer} />
                                <div className="flex flex-col min-h-[225px] bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
                                    <PlayerRatingTrendGraph player={currentPlayer} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                            <div className="place-content-center flex flex-col min-w-full min-h-[225px] bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
                                <RoleRadar player={currentPlayer!}/>         
                            </div>
                            <div className="place-items-center grid grid-cols-1 md:grid-cols-2 min-w-full min-h-[300px] bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
                                <TeamSideRatingPie player={currentPlayer} />
                                <KillsAssistsDeathsPie player={currentPlayer} />
                            </div>
                        </div>
                    </div>
                }            
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
            </div> 
            }
            <br />
            { currentPlayerStats &&
                <div className="py-2">
                {Array(Math.ceil(getGridData(currentPlayer).length / 2)).fill(0).map((_, i) => {
                    const pair = getGridData(currentPlayer).slice(i * 2, (i + 1) * 2);
                    return (
                        <React.Fragment key={`pair-${i}`}>
                            <GridContainer>
                                {pair.map((section, sectionIndex) => (
                                    <div key={`section-${i * 2 + sectionIndex}`} className="grid grid-cols-1 gap-2 p-2 h-fit">
                                        {section.map(({ name, value }, statIndex) => (
                                            <GridStat
                                                key={`stat-${i * 2 + sectionIndex}-${statIndex}`}
                                                name={name}
                                                value={value}
                                                rowIndex={statIndex} // pass statIndex instead of i
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
            }
            { !currentPlayerStats &&
                <div className="text-center">
                    <strong><i>This player has no stats in {currentPlayer.tier.name} for the current season.</i></strong>
                    {currentPlayer.statsOutOfTier?.length > 0 &&
                        <div className="text-xs">Stats found in another tier and will be visible soon(TM).</div>
                    }
                </div>
            }
            </Container>
        </>
    );
}