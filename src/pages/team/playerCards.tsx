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
//import { discordPlaceholderImage } from "../../common/images/placeholder";
import { ToolTip } from "../../common/utils/tooltip-utils";

type Props = {
	franchisePlayer: FranchisePlayer;
	team: Team;
};

export const TeamPlayerCards = ({ franchisePlayer, team }: Props) => {
	const { players = [] } = useDataContext();
	const player = players.find(p => p.steam64Id === franchisePlayer.steam64Id || p.name === franchisePlayer.name);

	let specialStatuses = null;

	specialStatuses =
		team?.captain?.steam64Id === franchisePlayer.steam64Id ?
			<ToolTip type="generic" classNames={["min-w-{100}"]} message="Team Captain">
				<GiPirateHat size="1.5em" className="inline" />
			</ToolTip>
		:	null;

	switch (player?.type) {
		case PlayerTypes.SIGNED_SUBBED:
			specialStatuses = (
				<ToolTip type="generic" message="Subbed Out">
					<GiSubway size="1.5em" className="inline" />
				</ToolTip>
			);
			break;
		case PlayerTypes.TEMPSIGNED:
		case PlayerTypes.PERMFA_TEMP_SIGNED:
			specialStatuses = (
				<ToolTip type="generic" message="Temp Signed">
					<GiSubmarine size="1.5em" className="inline" />
				</ToolTip>
			);
			break;
		case PlayerTypes.INACTIVE_RESERVE:
			specialStatuses = (
				<ToolTip type="generic" message="Inactive Reserve">
					<BsLifePreserver size="1.5em" className="inline" />
				</ToolTip>
			);
			break;
	}

	return (
		
		<div className="m-2 p-2 rounded-lg w-56 mb-16 transition ease-in-out hover:-translate-y-2 duration-300 bg-gradient-to-r from-gray-950 via-sky-950 to-blue-950">
			<Link
				className="hover:cursor-pointer hover:text-sky-400"
				key={`${team.tier.name}-${franchisePlayer.name}`}
				to={`/players/${franchisePlayer.name}`}
			>
				<div className="relative">
					<img
						className="absolute w-24 h-24 -ml-8 rounded-full -mt-16"
						loading="lazy"
						src={player?.avatarUrl}
						alt=""
					/>
					{specialStatuses && (
						<div className="absolute -right-2 -top-6 bg-blue-950 px-2 py-1 rounded-xl z-10">
							{specialStatuses}
						</div>
					)}
				</div>
				<div className="ml-16 text-xl font-extrabold">
					{franchisePlayer.name}
				</div>
			</Link>
			<div className="mt-4 float-left border-r-2 border-gray-500 font-bold" style={{writingMode: "vertical-lr", textOrientation: "upright", textShadow: "4px 4px 0 rgba(0, 0, 0, .5), 8px 8px 0 rgba(0, 0, 0, .3)"}}>
					{player?.role}
			</div>

			<div className="grid grid-cols-2 text-sm gap-8 pt-2 pl-6 m-1">
				<div>
					<div className="text-sm text-slate-300">
						<div className="flex h-8">
							<GiMoneyStack size="1.5em" className="mr-1 text-green-500" />{" "}
							<Mmr player={franchisePlayer} />
						</div>
					</div>
					<div>
						<div className="flex h-8">
							<BiStats size="1.5em" className="mr-1 text-orange-500" />{" "}
							{player?.stats?.rating.toFixed(2) ?? "-"}
						</div>
					</div>
				</div>
				<div className="right-0">
					<div className="w-7 h-8">
						<FaceitRank player={player} />
					</div>
					<ToolTip type="generic" message="Contract Duration">
						<div className="text-sm">
							{player?.contractDuration}
							<IoDocumentTextOutline className="inline mx-1" />
						</div>
					</ToolTip>
				</div>
			</div>
			<div className="flex justify-center pt-2">
				<ExternalPlayerLinks player={player!} />
			</div>
		</div>
	);
};
