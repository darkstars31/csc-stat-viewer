import * as React from "react";
import { Link } from "wouter";
import { Player } from "../../models/player";
import { teamNameTranslator } from "../../common/utils/player-utils";

type Props = {
    player: Player,
    index: number,
}

export function PlayerCard( { player, index}: Props) {
    const teamNameTranslated = React.useMemo( () => teamNameTranslator(player), [ player ]);

    return (
        <Link
        key={`player-${index}`}
        to={`/players/${player.stats?.Tier}/${encodeURIComponent(player.name)}`}
        >
        <div className="block bg-midnight2 rounded-xl border border-gray-800 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
            <div className="flex flex-row justify-between">
                <div className="mr-4 h-[64px] w-[64px] rounded-tl-xl">
                    <img className="rounded-tl-xl rounded-br-xl" src={player.avatarUrl} alt=""/>
                </div>
                <div className="pt-2 text-center grow">
                    <h2 className="text-xl font-bold text-white grow">{player.name}</h2>
                    <div className="text-xs pt-1">
                        <i><strong>{player.stats?.ppR.includes('-') ? "RIFLER" : player.stats?.ppR}</strong> - {player.team?.franchise.prefix ?? ""} {teamNameTranslated}</i>
                    </div>
                    { player.stats && 
                    <div className="p-1 text-sm text-gray-300">
                        <div className="text-center">
                            <div>{player.stats.Tier}</div>
                            <div className={`text-${ player.stats.Rating > 1 ? "green" : "orange" }-400`}>Rating: {player.stats.Rating}</div>
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    </Link>
    );
}