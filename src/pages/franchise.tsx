import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { Link, useRoute } from "wouter";
import { Loading } from "../common/components/loading";


export function Franchise(){
    const { franchises = [], loading } = useDataContext();
    const [, params] = useRoute("/franchises/:franchiseName");
    const franchiseName = decodeURIComponent(params?.franchiseName ?? "");
    const currentFranchise = franchises.find( f => f.name === franchiseName);

    if( loading.isLoadingFranchises ){
        return <Container><Loading /></Container>;
    }

    return (
        <div style={{backgroundImage: `url('https://core.csconfederation.com/images/${currentFranchise?.logo.name}')`}} className={`bg-repeat bg-fixed bg-center`}>
            <div className="backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85]">
                <Container>
                    <div className="float-left h-24 w-24 md:w-48 md:h-48 relative">
                        <img className="absolute h-full w-full" src={`https://core.csconfederation.com/images/${currentFranchise?.logo.name}`} placeholder="" alt=""/>
                    </div>
                    <div className="pt-2 grow">
                        <h2 className="text-5xl font-bold text-white grow text-center">{currentFranchise?.name} - <i>{currentFranchise?.prefix}</i></h2>
                        <div className="text-center p-4 text-xl">
                            GM - {currentFranchise?.gm.name} | AGM - {currentFranchise?.agm?.name}
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-1 text-sm text-gray-300">
                            { currentFranchise?.teams.map( team =>      
                                <div key={`${team.tier.name}`}>
                                    <div className="m-2 border-b-[1px] border-slate-700">
                                        <h2 className="text-xl"><strong>{team.name}</strong> <span className="text-gray-400"><i>{team.tier.name} { false && <span className="text-xs">({team.players.reduce((cum,player) => cum + player.mmr, 0)}/{team.tier.mmrCap})</span>} </i></span></h2>
                                    </div>
                                    <div className="mx-4 px-2">
                                    { team.players.map( player => 
                                        <Link key={`${team.tier.name}-${player.name}`} to={`/players/${team.tier.name}/${player.name}`}>                                          
                                            <div className="m-1 hover:cursor-pointer">
                                                {player.name} { false && <span className="text-xs text-gray-500">- {player.mmr} ({((player.mmr/team.tier.mmrCap)*100).toFixed(1)}%)</span> }
                                            </div>
                                        </Link>
                                        )}
                                    </div>
                                </div>
                                )
                            }
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}