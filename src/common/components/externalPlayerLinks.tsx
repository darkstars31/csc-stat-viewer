import * as React from "react";
import { Player } from "../../models/player";
import { RxDiscordLogo } from "react-icons/rx";
import { FaSteamSquare } from "react-icons/fa";
import { SiFaceit } from "react-icons/si";
import { useFetchFaceItPlayerWithCache } from "../../dao/faceitApiDao";
import cscLogo from "../../assets/images/placeholders/csc-logo.png";

type Props = {
	player: Player;
};

export function ExternalPlayerLinks({ player }: Props) {
	const { data: faceitSearchPlayer = undefined } = useFetchFaceItPlayerWithCache(player);
	const faceitPlayerProfile = faceitSearchPlayer?.faceitName;
	return (
		<div className="lg:flex flex-wrap gap-1">
			{player?.name && (
				<div className="hover:cursor-pointer bg-slate-700 p-1 rounded w-6 float-left m-[1px]">
					<a
						href={`https://csconfederation.com/stats/profile/${player.name}`}
						target="_blank"
						rel="noreferrer"
					>
						<img src={cscLogo} alt="" />
					</a>
				</div>
			)}
			{player?.steam64Id && (
				<div className="hover:cursor-pointer bg-slate-700 p-1 rounded w-6 float-left m-[1px]">
					<a href={`https://leetify.com/app/profile/${player.steam64Id}`} target="_blank" rel="noreferrer">
						<img className="pt-[0.1em]" src="https://leetify.com/assets/leetify/leetify-icon.svg" alt="" />
					</a>
				</div>
			)}
			{player?.steam64Id && (
				<div className="hover:cursor-pointer bg-slate-700 p-1 rounded w-6 float-left m-[1px]">
					<a href={`http://steamcommunity.com/profiles/${player.steam64Id}`} target="_blank" rel="noreferrer">
						<FaSteamSquare />
					</a>
				</div>
			)}
			{player?.discordId && (
				<div className="hover:cursor-pointer bg-blue-700 p-1 rounded w-6 float-left m-[1px]">
					<a href={`https://discordapp.com/users/${player.discordId}`} target="_blank" rel="noreferrer">
						<RxDiscordLogo />
					</a>
				</div>
			)}
			{faceitPlayerProfile && (
				<div className="hover:cursor-pointer text-orange-500 bg-slate-900 p-1 rounded w-6 float-left m-[1px]">
					<a
						href={`https://www.faceit.com/en/players/${faceitPlayerProfile}`}
						target="_blank"
						rel="noreferrer"
					>
						<SiFaceit />
					</a>
				</div>
			)}
		</div>
	);
}
