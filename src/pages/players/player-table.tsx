import * as React from "react";
import { Player } from "../../models";
import { Mmr } from "../../common/components/mmr";
import { useLocation } from "wouter";
import { franchiseImages } from "../../common/images/franchise";
import { BiStats } from "react-icons/bi";
import { GiMoneyStack } from "react-icons/gi";
import { PlayerTypes, teamNameTranslator } from "../../common/utils/player-utils";
import { TiWarningOutline } from "react-icons/ti";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { Virtuoso, TableVirtuoso } from "react-virtuoso";

type Props = {
	players: Player[];
};

function PlayerRows({ index, player }: { index: number; player: Player }) {

	return (
			<>
				<td className="whitespace-nowrap px-4 py-4 font-medium">{index + 1}</td>
				<td className="whitespace-nowrap px-6 py-4">
					<div className="mr-4 rounded float-left">
						<img width={32} height={32} className="rounded" src={player.avatarUrl} loading="lazy" alt="" />
					</div>
					<span className="leading-8">{player.name}</span>
				</td>
				<td className="whitespace-nowrap px-6 py-4">{player.tier.name}</td>
				<td className="whitespace-nowrap px-6 py-4">{player.role}</td>
				<td className="whitespace-nowrap px-6 py-4">
					{player.team?.franchise.prefix ?
						<span className="flex flex-left">
							<img
								className="h-6 w-6 mr-2"
								src={franchiseImages[player.team?.franchise.prefix]}
								alt={player.team?.franchise.prefix}
								loading="lazy"
							/>
							{player.team?.franchise.name ?? ""}
							{player.type === PlayerTypes.EXPIRED ?
								<div className="pl-2 pb-2 italic">
									<ToolTip
										type="generic"
										message={
											<div className="rounded m-2 p-2 bg-zinc-500 shadow-lg">
												<div>This players contract</div>
												<div>has expired</div>
											</div>
										}
									>
										<TiWarningOutline className="inline text-red-500" />
									</ToolTip>
								</div>
							:	""}
						</span>
					:	teamNameTranslator(player)}
					<div className="pl-8 text-gray-300 text-xs">
						{player.type === PlayerTypes.TEMPSIGNED ?
							"*FA Sub"
						: player.type === PlayerTypes.PERMFA_TEMP_SIGNED ?
							"*PFA Sub"
						: player.type === PlayerTypes.SIGNED_SUBBED ?
							"*Sub Out"
						: player.type === PlayerTypes.INACTIVE_RESERVE ?
							"*IR"
						:	""}
					</div>
				</td>
				<td className="whitespace-nowrap px-6 py-4">
					{player.stats?.rating.toFixed(2)}{" "}
					<span className="text-xs text-slate-600">
						{player.stats?.gameCount < 3 ? `(GP:${player.stats?.gameCount})` : ""}
					</span>
				</td>
				<td className="whitespace-nowrap px-6 py-4">
					<Mmr player={player} />
				</td>
			</>
		)
}

export function PlayerTable({ players }: Props) {
	const [, setLocation] = useLocation();
	const MemoizedPlayerRows = React.memo(PlayerRows);
	return (
		<div className="w-full flex flex-col overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-full py-2 sm:px-6 lg:px-8 overflow-hidden">					
				<TableVirtuoso 				
					useWindowScroll
					overscan={100}
					totalCount={players.length}
					components={{
						Table: (props) => <table className="table-auto w-full font-light text-sx md:text-sm" {...props} />,
						TableHead: (props) => <thead className="border-b font-medium dark:border-neutral-500" {...props} />,
						TableRow: (props) => 
								<tr className="w-full cursor-pointer border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" onClick={() => setLocation(`/players/${encodeURIComponent(props.item.name)}`)}  {...props} />,
					}}
					fixedHeaderContent={() => (				
						<tr className="text-left">
							<th className="px-4 py-4">#</th>
							<th className="px-6 py-4">Name</th>
							<th className="px-6 py-4">Tier</th>
							<th className="px-6 py-4">Role</th>
							<th className="px-6 py-4">Team</th>
							<th className="px-6 py-4">
								<span className="flex flex-left">
									<BiStats className="mr-2 text-orange-500" size="1.5em" /> Rating
								</span>
							</th>
							<th className="px-6 py-4">
								<span className="flex flex-left">
									<GiMoneyStack className="mr-2 text-green-500" size="1.5em" /> MMR
								</span>
							</th>
						</tr>					
					)}
					data={players}
					itemContent={index => <MemoizedPlayerRows index={index} player={players[index]} />}
				/>
		</div>
	);
}
