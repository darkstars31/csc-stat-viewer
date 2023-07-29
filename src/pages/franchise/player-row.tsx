import * as React from "react";
import { Player as FranchisePlayer, Team } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { COLUMNS } from "../franchise";
import { GiPirateHat, GiSubmarine, GiSubway } from "react-icons/gi";
import { BsLifePreserver } from "react-icons/bs";
import { Mmr } from "../../common/components/mmr";
import { ExternalPlayerLinks } from "../../common/components/externalPlayerLinks";
import { PlayerTypes } from "../../common/utils/player-utils";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaceitRank } from "../../common/components/faceitRank";
import { BiStats } from "react-icons/bi";

export function PlayerRow( { franchisePlayer, team, extraDetails }: {franchisePlayer: FranchisePlayer, team: Team, extraDetails?: boolean} ) {
    const { players = [] } = useDataContext();
    const player = players.find( p => p.steam64Id === franchisePlayer.steam64Id || p.name === franchisePlayer.name );
    const percentageOfMmrCap = (((franchisePlayer.mmr ?? 0)/team.tier.mmrCap)*100).toFixed(1);

    return (
        <div className="text-sm lg:text-m lg:m-2">
            <div className={`grid grid-cols-${COLUMNS+2+ (extraDetails ? 1 : 0)}`}>
                <Link className="hover:cursor-pointer hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300" 
                    key={`${team.tier.name}-${franchisePlayer.name}`} 
                    to={`/players/${team.tier.name}/${franchisePlayer.name}`}
                >
                    <span className="float-left"><img className="w-8 h-8 mr-2" src={player?.avatarUrl} alt="" /></span>
                    <span className="mr-2"><b>{franchisePlayer.name}</b></span>
                    <span>
                        { team?.captain?.steam64Id === franchisePlayer.steam64Id ? <GiPirateHat size="1.5em" className="inline"/> : ""}
                        { player?.type === PlayerTypes.SIGNED_SUBBED ? <GiSubway size="1.5em" className="inline"/> : ""}
                        { player?.type === PlayerTypes.TEMPSIGNED || player?.type === PlayerTypes.PERMFA_TEMP_SIGNED ? <GiSubmarine size="1.5em" className="inline"/> : ""}
                        { player?.type === PlayerTypes.INACTIVE_RESERVE ? <BsLifePreserver size="1.5em" className="inline"/> : ""}
                    </span>
                </Link>
                <div><Mmr player={franchisePlayer} /> <span className="text-gray-400">({percentageOfMmrCap}%)</span></div>
                <div><div className="flex"><BiStats size="1.5em" className="mr-1 text-orange-500"/> {player?.stats?.rating.toFixed(2) ?? "-"}</div></div>
                { extraDetails && <div className="w-7 h-7"><FaceitRank player={player} /></div> }
                <div>{player?.contractDuration}<IoDocumentTextOutline className="inline mx-1" /></div>
                <div>{player?.role}</div>
                { extraDetails && <div className="">
                    <ExternalPlayerLinks player={player!} />
                </div>}
            </div>
        </div> );
}