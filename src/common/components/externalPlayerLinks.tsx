import * as React from "react";
import { Player } from "../../models/player";
import { RxDiscordLogo } from "react-icons/rx";
import { FaSteamSquare } from "react-icons/fa";
import { SiFaceit } from "react-icons/si";

type Props = {
    player: Player;
}

export function ExternalPlayerLinks( { player }: Props) {
    return (
    <div className="flex justify-end">
        { player?.steam64Id && <div className="hover:cursor-pointer bg-slate-700 mx-1 p-1 rounded w-6 float-left"><a href={`http://steamcommunity.com/profiles/${player.steam64Id}`} target="_blank" rel="noreferrer"><FaSteamSquare /></a></div>}
        { player?.discordId && <div className="hover:cursor-pointer bg-blue-700 mx-1 p-1 rounded w-6 float-left"><a href={`https://discordapp.com/users/${player.discordId}`} target="_blank" rel="noreferrer"><RxDiscordLogo /></a></div> }
        { player?.faceitName && <div className="hover:cursor-pointer text-orange-500 mx-1 bg-slate-900 p-1 rounded w-6 float-left"><a href={`https://www.faceit.com/en/players/${player?.faceitName}`} target="_blank" rel="noreferrer"><SiFaceit /></a></div> }
    </div>);
};