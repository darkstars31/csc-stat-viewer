import * as React from "react";
import { Player as FranchisePlayer, Team } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { PlayerTypes } from "../../common/utils/player-utils";
import { GiPirateHat, GiSubmarine, GiSubway } from "react-icons/gi";
import { BsLifePreserver } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaceitRank } from "../../common/components/faceitRank";
import { BiStats } from "react-icons/bi";
import { ExternalPlayerLinks } from "../../common/components/externalPlayerLinks";
import { Mmr } from "../../common/components/mmr";


type Props = {
    franchisePlayer: FranchisePlayer
    team: Team
}

export const TeamPlayerCards = ( { franchisePlayer, team }: Props ) => {
    const { players = [] } = useDataContext();
    const player = players.find( p => p.steam64Id === franchisePlayer.steam64Id || p.name === franchisePlayer.name );

    return (
        <div className="m-2 p-2 bg-midnight2 rounded-lg w-48 transition ease-in-out hover:-translate-y-2 duration-300">
            <Link className="hover:cursor-pointer hover:text-sky-400" 
                    key={`${team.tier.name}-${franchisePlayer.name}`} 
                    to={`/players/${team.tier.name}/${franchisePlayer.name}`}
                >
                    <span className="fixed"><img className="relative w-32 h-32 ml-6 rounded-full -top-16" src={player?.avatarUrl} alt="" /></span>
                    <div className="mr-2 mt-16"><b>{franchisePlayer.name}</b></div>
                    <div className="float-right">
                        { team?.captain?.steam64Id === franchisePlayer.steam64Id ? <GiPirateHat size="1.5em" className="inline"/> : ""}
                        { player?.type === PlayerTypes.SIGNED_SUBBED ? <GiSubway size="1.5em" className="inline"/> : ""}
                        { player?.type === PlayerTypes.TEMPSIGNED || player?.type === PlayerTypes.PERMFA_TEMP_SIGNED ? <GiSubmarine size="1.5em" className="inline"/> : ""}
                        { player?.type === PlayerTypes.INACTIVE_RESERVE ? <BsLifePreserver size="1.5em" className="inline"/> : ""}
                    </div>
                </Link>
                <div>
                    <Mmr player={franchisePlayer} /> MMR
                    {/* <span className="text-gray-400">({percentageOfMmrCap}%)</span> */}
                </div>
                <div><div className="flex"><BiStats size="1.5em" className="mr-1 text-orange-500"/> {player?.stats?.rating.toFixed(2) ?? "-"}</div></div>
                <div className="w-7 h-7"><FaceitRank player={player} /></div>
                <div className="text-sm">{player?.contractDuration}<IoDocumentTextOutline className="inline mx-1" />Contract</div>
                <div>{player?.role}</div>
                <div className="">
                    <ExternalPlayerLinks player={player!} />
                </div>
        </div>
    )
}