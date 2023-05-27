import * as React from "react";
import { Link } from "wouter";
import { Player } from "../../models/player";
import { teamNameTranslator } from "../../common/utils/player-utils";
import { BiStats } from "react-icons/bi";
import { GiMoneyStack } from "react-icons/gi";

type Props = {
    player: Player,
    index: number,
}

const Tooltip = (props: { children: React.ReactNode, tip?: string }) => {
    return (
        <a 
        className="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
        data-te-toggle="tooltip"
        data-te-placement="bottom"
        title={props.tip}
        >
            {props.children}
        </a>
    );
}

export function PlayerCard( { player, index}: Props) {
    const teamNameTranslated = React.useMemo( () => teamNameTranslator(player), [ player ]);

    return (
        <Link
        key={`player-${index}`}
        to={`/players/${player.stats?.Tier}/${encodeURIComponent(player.name)}`}
        >
        <div className="fade-in block bg-midnight2 rounded-xl border border-gray-800 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
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
                            <div className="grid grid-cols-2 mt-1">
                                <Tooltip tip="Rating"><div className="flex"><BiStats size="1.5em" className="mr-1 text-orange-500"/> {player.stats.Rating.toFixed(2)}</div></Tooltip>
                                <Tooltip tip="Match Making Rank"><div className="flex"><GiMoneyStack size="1.5em" className="mr-1 text-green-500"/> {player.mmr}</div></Tooltip>
                            </div>  
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    </Link>
    );
}