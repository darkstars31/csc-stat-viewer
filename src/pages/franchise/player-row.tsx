import * as React from "react";
import { Player as FranchisePlayer, Team } from "../../models/franchise-types";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { GiMoneyStack, GiPirateHat, GiSubmarine, GiSubway } from "react-icons/gi";
import { BsLifePreserver } from "react-icons/bs";
import { Mmr } from "../../common/components/mmr";
import { ExternalPlayerLinks } from "../../common/components/externalPlayerLinks";
import { PlayerTypes } from "../../common/utils/player-utils";
import { TbContract   } from "react-icons/tb";
import { FaceitRank } from "../../common/components/faceitRank";
import { BiStats } from "react-icons/bi";
import { ToolTip } from "../../common/utils/tooltip-utils";

export function PlayerRow({ franchisePlayer, team }: { franchisePlayer: FranchisePlayer; team: Team }) {
	const { players = [] } = useDataContext();
	const player = players.find(p => p.steam64Id === franchisePlayer.steam64Id || p.name === franchisePlayer.name);
	//const percentageOfMmrCap = (((franchisePlayer.mmr ?? 0)/team.tier.mmrCap)*100).toFixed(1);

	return (
		<div className="m-2 h-24 md:h-16 text-sm lg:text-m">
			<div className={`flex flex-wrap md:flex-row`}>
				<Link
					className="basis-1/4 hover:cursor-pointer hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300"
					key={`${team.tier.name}-${franchisePlayer.name}`}
					to={`/players/${franchisePlayer.name}`}
				>
					<span className="float-left">
						<img className="w-8 h-8 mr-2 rounded-full" src={player?.avatarUrl} alt="" />
					</span>
					<span className="mr-2 text-lg font-bold">
						{franchisePlayer.name}
					</span>
					<span>
						{team?.captain?.steam64Id === franchisePlayer.steam64Id ?
							<GiPirateHat size="1.5em" className="inline" />
						:	""}
						{player?.type === PlayerTypes.SIGNED_SUBBED ?
							<GiSubway size="1.5em" className="inline" />
						:	""}
						{player?.type === PlayerTypes.TEMPSIGNED || player?.type === PlayerTypes.PERMFA_TEMP_SIGNED ?
							<GiSubmarine size="1.5em" className="inline" />
						:	""}
						{player?.type === PlayerTypes.INACTIVE_RESERVE ?
							<BsLifePreserver size="1.5em" className="inline" />
						:	""}
					</span>
					<div className="italic w-full pl-12 text-sm">{player?.role}</div>
				</Link>
				<div className="basis-1/5 flex gap-4">
					<div className="px-2 w-20">
						<div className="flex">
							<GiMoneyStack size="1.5em" className="mr-1 text-green-500" />
							<Mmr player={franchisePlayer} />
						</div>{" "}
						<div className="flex">
							<BiStats size="1.5em" className="mr-1 text-orange-500" />{" "}
							{player?.stats?.rating.toFixed(2) ?? "-"}
						</div>
						<div className="flex">
							<ToolTip type="generic" message="Seasons remaining on contract">
								<TbContract size={"1.1em"} className="inline mx-1" />
								{player?.contractDuration}
							</ToolTip>
						</div>
					</div>
					<div>
						<div className="basis-1/12 w-7 h-7">
							<FaceitRank player={player} />
						</div>
					</div>
				</div>
				
				<div className="basis-3/12">
					<ExternalPlayerLinks player={player!} />
				</div>
			</div>
		</div>
	);
}
