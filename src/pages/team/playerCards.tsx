import * as React from "react";
import { Player as FranchisePlayer, Team } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { PlayerTypes } from "../../common/utils/player-utils";
import { GiMoneyStack, GiPirateHat, GiSubmarine, GiSubway } from "react-icons/gi";
import { BsLifePreserver } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaceitRank } from "../../common/components/faceitRank";
import { BiStats } from "react-icons/bi";
import { ExternalPlayerLinks } from "../../common/components/externalPlayerLinks";
import { Mmr } from "../../common/components/mmr";
import { discordPlaceholderImage } from "../../common/images/placeholder";
import { ToolTip } from "../../common/utils/tooltip-utils";

type Props = {
    franchisePlayer: FranchisePlayer
    team: Team
}

export const  TeamPlayerCards = ( { franchisePlayer, team }: Props ) => {
    const { players = [] } = useDataContext();
    const player = players.find( p => p.steam64Id === franchisePlayer.steam64Id || p.name === franchisePlayer.name );

    let specialStatuses = null;

    specialStatuses = team?.captain?.steam64Id === franchisePlayer.steam64Id 
        ? <ToolTip type="generic" classNames={["min-w-{100}"]} message="Team Captain"><GiPirateHat size="1.5em" className="inline"/></ToolTip> 
        : null;

    switch(player?.type) {
        case PlayerTypes.SIGNED_SUBBED:
            specialStatuses = <ToolTip type="generic" message="Subbed Out"><GiSubway size="1.5em" className="inline"/></ToolTip>
            break;
        case PlayerTypes.TEMPSIGNED:
        case PlayerTypes.PERMFA_TEMP_SIGNED:
            specialStatuses = <ToolTip type="generic" message="Temp Signed"><GiSubmarine size="1.5em" className="inline"/></ToolTip>
            break;
        case PlayerTypes.INACTIVE_RESERVE:
            specialStatuses = <ToolTip type="generic" message="Inactive Reserve"><BsLifePreserver size="1.5em" className="inline"/></ToolTip>
            break;
    }


    return (
        <div className="m-2 p-2 bg-midnight2 rounded-lg w-36 mb-16 transition ease-in-out hover:-translate-y-2 duration-300">
            <Link className="hover:cursor-pointer hover:text-sky-400" 
                    key={`${team.tier.name}-${franchisePlayer.name}`} 
                    to={`/players/${franchisePlayer.name}`}
                >
                    <div className="relative">
                        <img className="absolute w-24 h-24 ml-4 rounded-full -mt-24" src={player?.avatarUrl ?? discordPlaceholderImage} alt="" />
                        { specialStatuses && 
                            <div className="absolute left-24 -top-28 p-1 bg-slate-950 p-2 rounded-full">
                                { specialStatuses }
                            </div>
                        }
                    </div>
                    <div className="mr-2 mt-8 text-lg text-center"><b>{franchisePlayer.name}</b></div>
                </Link>
                <div className="text-sm h-4">{player?.role}</div>
                <div className="grid grid-cols-2 text-sm gap-4 p-2">
                    <div>
                        <div className="text-sm text-slate-300">
                            <div className="flex h-7"><GiMoneyStack size="1.5em" className="mr-1 text-green-500"/> <Mmr player={franchisePlayer} /></div>
                        </div>
                        <div>
                            <div className="flex h-7"><BiStats size="1.5em" className="mr-1 text-orange-500"/> {player?.stats?.rating.toFixed(2) ?? "-"}</div>
                        </div>
                    </div>
                    <div className="right-0">
                        <div className="w-7 h-7"><FaceitRank player={player} /></div>
                        <ToolTip type="generic" message="Contract Duration"><div className="text-sm">{player?.contractDuration}<IoDocumentTextOutline className="inline mx-1" /></div></ToolTip>
                    </div>
                </div>
                <div className="flex justify-center pt-2">
                    <ExternalPlayerLinks player={player!} />
                </div>
        </div>
    )
}