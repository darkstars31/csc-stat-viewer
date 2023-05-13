import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from '../DataContext';
import { Loading } from '../common/components/loading';
import { Link } from "wouter";
import { useKonamiCode } from "../common/hooks/konami";
//import { PlayerStats } from '../models';

export function Teams() {
    const konami = useKonamiCode();
    const { franchises = [], isLoading } = useDataContext();
    //const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    
    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Franchises & Teams</h2>
                <p className="mt-4 text-gray-300">
                    Current Teams and players on those teams + roles.
                </p>
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            { isLoading && <Loading /> }
            {
                franchises.map( franchise => 
                    <div key={`${franchise.name}`} className="my-4 block bg-midnight2 rounded-xl border border-gray-800 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
                    <div className="flex flex-row justify-between">
                        <div className="mr-4 h-[64px] w-[64px] rounded-tl-xl">
                            <img className="rounded-tl-xl rounded-br-xl" src={`https://core.csconfederation.com/images/${franchise.logo.name}`} alt=""/>
                        </div>
                        <div className="pt-2 grow">
                            <h2 className="text-xl font-bold text-white grow text-center">{franchise.name} - <i>{franchise.prefix}</i></h2>
                            <div className="text-center text-sm">
                                GM - {franchise.gm.name} | AGM - {franchise.agm?.name}
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 p-1 text-sm text-gray-300">
                                { franchise.teams.map( team =>      
                                    <div key={`${team.tier.name}`}>
                                        <div className="mx-4 border-b-[1px] border-slate-700 text-center">
                                            <strong>{team.name}</strong> - <span className="text-gray-400"><i>{team.tier.name} { konami && <span className="text-xs">({team.players.reduce((cum,player) => cum + player.mmr, 0)}/{team.tier.mmrCap})</span>} </i></span>
                                        </div>
                                        <div className="mx-4 px-2">
                                        { team.players.map( player => 
                                            <Link key={`${team.tier.name}-${player.name}`} to={`/players/${team.tier.name}/${player.name}`}>                                          
                                                <div className="m-1 hover:cursor-pointer">
                                                    {player.name} { konami && <span className="text-xs text-gray-500">- {player.mmr} ({((player.mmr/team.tier.mmrCap)*100).toFixed(1)}%)</span> }
                                                </div>
                                            </Link>
                                            )}
                                        </div>
                                    </div>
                                    )
                                }
                           </div>
                        </div>
                    </div>
                </div>
                    )
            }
        </Container>
    );
}