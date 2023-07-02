import * as React from "react";
import { Player } from "../../models";
import { Mmr } from "../../common/components/mmr";
import { Link } from "wouter";
import { franchiseImages } from "../../common/images/franchise";
import { BiStats } from "react-icons/bi";
import { GiMoneyStack } from "react-icons/gi";

type Props = {
    players: Player[]
}

export function PlayerTable( { players}: Props) {
    return (
    <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Tier</th>
                    <th scope="col" className="px-6 py-4">Role</th>
                    <th scope="col" className="px-6 py-4">Team</th>
                    <th scope="col" className="px-6 py-4"><span className="flex flex-left"><BiStats className="mr-2 text-orange-500" size="1.5em" /> Rating</span></th>
                    <th scope="col" className="px-6 py-4"><span className="flex flex-left"><GiMoneyStack className="mr-2 text-green-500" size="1.5em" /> MMR</span></th>
                    </tr>
                </thead>
                <tbody>
                    { players.map( (player, index) => (
                        <Link to={`/players/${player.tier.name}/${encodeURIComponent(player.name)}`}>
                            <tr key={'player-' + index} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                <td className="whitespace-nowrap px-6 py-4 font-medium">{index+1}</td>
                                <td className="whitespace-nowrap px-6 py-4">                           
                                    <div className="mr-4 h-[32px] w-[32px] rounded float-left">
                                        <img className="rounded" src={player.avatarUrl} alt=""/>
                                    </div>                           
                                    <span className="leading-8">{player.name}</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">{player.tier.name}</td>
                                <td className="whitespace-nowrap px-6 py-4">{player.role}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    { player.team?.franchise.prefix ? 
                                        <span className="flex flex-left">
                                            <img className="h-6 w-6 mr-2" src={franchiseImages[player.team?.franchise.prefix]} alt={player.team?.franchise.prefix} />
                                            {player.team?.franchise.name ?? ""}
                                        </span>
                                        : 
                                        ""
                                    }</td>
                                <td className="whitespace-nowrap px-6 py-4">{player.stats?.rating.toFixed(2)}</td>
                                <td className="whitespace-nowrap px-6 py-4"><Mmr player={player}/></td>
                            </tr>
                        </Link>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>
    );
}