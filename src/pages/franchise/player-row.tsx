import * as React from "react";
import { Player as FranchisePlayer, Team } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { COLUMNS } from "../franchise";
import { GiPirateHat } from "react-icons/gi";
import { Mmr } from "../../common/components/mmr";
import { ExternalPlayerLinks } from "../../common/components/externalPlayerLinks";


export function PlayerRow( { franchisePlayer, team }: {franchisePlayer: FranchisePlayer, team: Team}) {
    const { players = [] } = useDataContext();
    const player = players.find( p => p.steam64Id === franchisePlayer.steam64Id);
    const percentageOfMmrCap = (((franchisePlayer.mmr ?? 0)/team.tier.mmrCap)*100).toFixed(1);
    return (
        <div className="m-8 text-sm lg:text-m lg:m-2">
            <div className={`grid grid-cols-${COLUMNS}`}>
                <Link className="hover:cursor-pointer hover:text-sky-400 hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300" 
                key={`${team.tier.name}-${franchisePlayer.name}`} 
                to={`/players/${team.tier.name}/${franchisePlayer.name}`}
                >
                    {franchisePlayer.name} { team?.captain?.steam64Id === franchisePlayer.steam64Id ? <GiPirateHat size="1.5em" className="inline"/> : ""}
                </Link>
                <div><Mmr player={franchisePlayer} /> <span className="text-gray-400">({percentageOfMmrCap}%)</span></div>
                <div>{player?.stats?.Rating.toFixed(2) ?? "-"}</div>
                <div>Contract {player?.contractDuration}</div>
                <div>
                    <ExternalPlayerLinks player={player!} />
                </div>
            </div>
        </div> );
}