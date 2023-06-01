import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { Link, useRoute } from "wouter";
import { Loading } from "../common/components/loading";
import { PlayerRow } from "./franchise/player-row";
import { TeamFooterTabulation } from "./franchise/team-footer-tabulation";

export const COLUMNS = 5;

export function Franchise(){
    const { franchises = [], loading } = useDataContext();
    const [, params] = useRoute("/franchises/:franchiseName");
    const franchiseName = decodeURIComponent(params?.franchiseName ?? "");
    const currentFranchise = franchises.find( f => f.name === franchiseName);

    if( loading.isLoadingFranchises ){
        return <Container><Loading /></Container>;
    }

    return (
        <div style={{backgroundImage: `url('https://core.csconfederation.com/images/${currentFranchise?.logo.name}')`, overflow:'auto'}} className={`bg-repeat bg-center bg-fixed`}>
            <div className="backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] overflow-auto">
                <Container>
                    <div className="float-left h-24 w-24 md:w-48 md:h-48 relative">
                        <img className="absolute h-full w-full" src={`https://core.csconfederation.com/images/${currentFranchise?.logo.name}`} placeholder="" alt=""/>
                    </div>
                    <div className="pt-2 grow">
                        <h2 className="text-5xl font-bold text-white grow text-center">{currentFranchise?.name} - <i>{currentFranchise?.prefix}</i></h2>
                        <div className="text-center p-4 text-xl">
                            GM - {currentFranchise?.gm.name} | AGM - {currentFranchise?.agms?.map( agm => agm.name).join(', ')}
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-1 text-sm text-gray-300">
                            { currentFranchise?.teams.map( team =>      
                                <div key={`${team.tier.name}`} className="">
                                    <Link to={`/franchises/${currentFranchise.name}/${team.name}`}>
                                        <div className="m-2 border-b-[1px] border-slate-700">
                                            <h2 className="text-xl"><strong>{team.name}</strong> <span className="text-gray-400"><i>{team.tier.name} { false && <span className="text-xs">({team.players.reduce((cum,player) => cum + player.mmr, 0)}/{team.tier.mmrCap})</span>} </i></span></h2>
                                        </div>
                                    </Link>
                                    <div className="mx-4 px-2">
                                    { team.players.map( player => 
                                       <PlayerRow key={`${team.tier.name}-${player.name}`} franchisePlayer={player} team={team} />
                                        )}
                                    </div>
                                    <TeamFooterTabulation team={team} />
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