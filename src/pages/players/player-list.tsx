import * as React from "react";
import { PlayerCard } from "./player-cards";
import { Player } from "../../models";
import { PlayerTable } from "./player-table";

type Props = {
    displayStyle: string;
    players: Player[];
}

export function MemoizedPlayerList( { displayStyle, players }: Props){
    const playerCards = players?.map( (player: Player, index: number) => <PlayerCard key={`${player.tier.name}-${player.name}`} player={player} index={index} />);

    return (
        displayStyle === "cards" ? 
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                { playerCards }
            </div>
            :
            <PlayerTable players={players} />
    );
}

export const PlayerList = React.memo(MemoizedPlayerList);