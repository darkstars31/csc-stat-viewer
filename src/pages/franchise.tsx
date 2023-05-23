import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { Link, useRoute } from "wouter";
import { Loading } from "../common/components/loading";
import { Player as FranchisePlayer, Team } from "../models/franchise-types";
import { SiFaceit } from "react-icons/si";
import { RxDiscordLogo } from "react-icons/rx";
import { Player } from "../models/player";

const COLUMNS = 5;

function PlayerRow( { franchisePlayer, team }: {franchisePlayer: FranchisePlayer, team: Team}) {
    const { players = [] } = useDataContext();
    const player = players.find( p => p.steam64Id === franchisePlayer.steam64Id);
    const percentageOfMmrCap = (((franchisePlayer.mmr ?? 0)/team.tier.mmrCap)*100).toFixed(1);
    return (
        <div className=" m-1">
            <div className={`grid grid-cols-${COLUMNS}`}>
                <Link className="hover:cursor-pointer text-blue-300" key={`${team.tier.name}-${franchisePlayer.name}`} to={`/players/${team.tier.name}/${franchisePlayer.name}`}>
                    {franchisePlayer.name} { false && <span className="text-xs text-gray-500">- {franchisePlayer.mmr} ({((franchisePlayer.mmr/team.tier.mmrCap)*100).toFixed(1)}%)</span> }
                </Link>
                <div>{franchisePlayer.mmr} <span className="text-gray-400">({percentageOfMmrCap}%)</span></div>
                <div>{player?.stats?.Rating.toFixed(2) ?? "-"}</div>
                <div>Contract {player?.contractDuration}</div>
                <div>
                    { franchisePlayer.discordId && <div className="hover:cursor-pointer bg-blue-700 p-1 rounded w-6 float-left"><a href={`https://discordapp.com/users/${franchisePlayer.discordId}`} target="_blank" rel="noreferrer"><RxDiscordLogo /></a></div> }
                    { player?.faceitName && <div className="hover:cursor-pointer text-orange-500 mx-2 bg-slate-900 p-1 rounded w-6 float-left"><a href={`https://www.faceit.com/en/players/${player?.faceitName}`} target="_blank" rel="noreferrer"><SiFaceit /></a></div> }
                </div>
            </div>
        </div> );
}

function TeamFooterTabulation( { team }: { team: Team }) {
    const { players = [] } = useDataContext();
    const mmrTeamTotal = team.players.reduce((sum, next) => sum+next.mmr, 0);
    const tierMmrCap = team.tier.mmrCap;
    const playersOnTeam = team.players.reduce( (accumlator: Player[], player) => {
        const p = players.find( p => player.name === p.name && p.tier.name === team.tier.name && p.stats?.Tier === team.tier.name && p.stats);
        if( p ) {
            accumlator.push( p );
        }
        return accumlator;
    }, [] );

    return (
        <div className={`grid grid-cols-${COLUMNS} text-xs`}>
            <div></div>
            <div>{mmrTeamTotal}/{tierMmrCap} Cap - {((mmrTeamTotal/tierMmrCap)*100).toFixed(0)}%</div>
            { playersOnTeam.length > 0 && <div>{(playersOnTeam.reduce((sum, next) => sum+(next?.stats?.Rating ?? 0), 0)/playersOnTeam.length).toFixed(2)} Avg Rating</div> }
        </div>
    );
}

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
                                <div key={`${team.tier.name}`}>
                                    <div className="m-2 border-b-[1px] border-slate-700">
                                        <h2 className="text-xl"><strong>{team.name}</strong> <span className="text-gray-400"><i>{team.tier.name} { false && <span className="text-xs">({team.players.reduce((cum,player) => cum + player.mmr, 0)}/{team.tier.mmrCap})</span>} </i></span></h2>
                                    </div>
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