import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { PlayerStats } from "../../models";
import { getPlayersInTierOrderedByRating } from "../../common/utils/player-utils";

type Props = {
    player: PlayerStats,
    playerIndex: number,
}

export function PlayerNagivator( { player, playerIndex }: Props ) {
    const pageSize = 8;
    const [ pageCurrent, setPageCurrent ] = React.useState( Math.floor(playerIndex/pageSize) );

    const { players = [], isLoading } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const playerInTierOrderedByRating = getPlayersInTierOrderedByRating( player!, playerStats );

    if( !player ){
        return null;
    }


    return (
        <div className="py-2">
                <div className="flex flex-row px-4 overflow-auto justify-center">
                    { pageCurrent > 0 && <button onClick={ () => setPageCurrent( pageCurrent-1 )}>Forward</button> }
                    { playerInTierOrderedByRating.slice(pageCurrent*pageSize, pageCurrent*pageSize+pageSize).map( (player, index) => 
                        <Link key={`closeby-${player.Name}`} to={`/players/${player.Tier}/${player.Name}`}>
                            <div className={`flex flex-row text-xs cursor-pointer m-2 text-center border border-gray-100 rounded ${ playerIndex === pageCurrent*pageSize+index && Math.floor(playerIndex/pageSize) === pageCurrent ? "bg-yellow-600": ""}`}>
                                <div className="p-2">{pageCurrent*pageSize+index+1}</div>
                                <div className="p-2 text-ellipsis overflow-hidden"><p>{player.Name}</p></div>
                            </div>
                        </Link>
                        )
                    }
                    { pageCurrent*pageSize <= playerInTierOrderedByRating.length && <button onClick={() => setPageCurrent( pageCurrent+1 )}>Backward</button> }
                </div>
            </div>
    );
}