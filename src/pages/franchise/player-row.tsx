import * as React from "react";
import { Player as FranchisePlayer, Team } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { RxDiscordLogo } from "react-icons/rx";
import { SiFaceit } from "react-icons/si";
import { COLUMNS } from "../franchise";
import { GiPirateHat } from "react-icons/gi";


export function PlayerRow( { franchisePlayer, team }: {franchisePlayer: FranchisePlayer, team: Team}) {
    const { players = [] } = useDataContext();
    const player = players.find( p => p.steam64Id === franchisePlayer.steam64Id);
    const percentageOfMmrCap = (((franchisePlayer.mmr ?? 0)/team.tier.mmrCap)*100).toFixed(1);
    return (
        <div className=" m-1">
            <div className={`grid grid-cols-${COLUMNS}`}>
                <Link className="hover:cursor-pointer hover:text-sky-400 hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300" 
                key={`${team.tier.name}-${franchisePlayer.name}`} 
                to={`/players/${team.tier.name}/${franchisePlayer.name}`}
                >
                    {franchisePlayer.name} { team?.captain?.steam64Id === franchisePlayer.steam64Id ? <GiPirateHat size="1.5em" className="inline"/> : ""}
                </Link>
                <div>{franchisePlayer.mmr} <span className="text-gray-400">({percentageOfMmrCap}%)</span></div>
                {/* OLD <div>{player?.stats?.Rating.toFixed(2) ?? "-"}</div> */}
                <div>{player?.stats?.Rating.toFixed(2) ?? "-"}</div>
                <div>Contract {player?.contractDuration}</div>
                <div>
                    { franchisePlayer.discordId && <div className="hover:cursor-pointer bg-blue-700 p-1 rounded w-6 float-left"><a href={`https://discordapp.com/users/${franchisePlayer.discordId}`} target="_blank" rel="noreferrer"><RxDiscordLogo /></a></div> }
                    { player?.faceitName && <div className="hover:cursor-pointer text-orange-500 mx-2 bg-slate-900 p-1 rounded w-6 float-left"><a href={`https://www.faceit.com/en/players/${player?.faceitName}`} target="_blank" rel="noreferrer"><SiFaceit /></a></div> }
                </div>
            </div>
        </div> );
}