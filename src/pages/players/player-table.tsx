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
import { TableVirtuoso } from "react-virtuoso";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ArrowUpDown } from "lucide-react";

import { SortDirection, SortOption } from "./sort";

type Props = {
	players: Player[];
	onSortChange: (sortValue: string) => void;
	sortBy: SortOption;
	sortDirection: SortDirection;
};

type SortableHeaderProps = {
	children: React.ReactNode;
	className?: string;
	sortDirection: SortDirection;
	sortValue: string;
	sortedBy: string;
	onSortChange: (sortValue: string) => void;
};

function PlayerRows({ index, player }: { index: number; player: Player }) {
	return (
			<>
				<TableCell className="font-medium">{index + 1}</TableCell>
				<TableCell>
					<Avatar
						className="mr-4 float-left"
						src={player.avatarUrl}
						alt={player.name}
						fallback={<span aria-hidden="true">{player.name.charAt(0).toUpperCase()}</span>}
					/>
					<span className="leading-8">{player.name}</span>
				</TableCell>
				<TableCell>{player.tier.name}</TableCell>
				<TableCell>{player.role}</TableCell>
				<TableCell>
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
				</TableCell>
				<TableCell>
					{player.stats?.rating.toFixed(2)}{" "}
					<span className="text-xs text-slate-600">
						{player.stats?.gameCount < 3 ? `(GP:${player.stats?.gameCount})` : ""}
					</span>
				</TableCell>
				<TableCell>
					<Mmr player={player} />
				</TableCell>
			</>
		)
}

const MemoizedPlayerRows = React.memo(PlayerRows);

function SortableHeader({ children, className, onSortChange, sortDirection, sortValue, sortedBy }: SortableHeaderProps) {
	const SortIcon =
		sortedBy !== sortValue ? ArrowUpDown : sortDirection === "asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow;

	return (
		<TableHead className={className}>
			<button
				type="button"
				className="flex w-full items-center gap-2 text-left transition hover:text-white"
				onClick={() => onSortChange(sortValue)}
			>
				<span>{children}</span>
				<SortIcon className="size-4 text-muted-foreground" />
			</button>
		</TableHead>
	);
}

export function PlayerTable({ players, onSortChange, sortBy, sortDirection }: Props) {
	const [, setLocation] = useLocation();
	return (
		<div className="w-full pb-16 flex flex-col overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-full py-2 sm:px-6 lg:px-8 overflow-hidden">					
			<div className="overflow-hidden rounded-lg border border-slate-800">
				<TableVirtuoso 				
					useWindowScroll
					overscan={100}
					totalCount={players.length}
					components={{
						Table: (props) => <Table className="table-auto border-separate border-spacing-0 font-light text-sx md:text-sm" {...props} />,
						TableHead: (props) => <TableHeader className="border-b border-neutral-800" {...props} style={{ zIndex: 1 }} />,
						TableRow: props => {
							const { item, onClick, ...rowProps } = props as React.ComponentPropsWithoutRef<"tr"> & { item: Player };

							return (
								<TableRow
									className="w-full cursor-pointer transition duration-300 ease-in-out hover:bg-gray-800 hover:-translate-y-0.5 hover:translate-x-0.5"
									{...rowProps}
									onClick={event => {
										onClick?.(event);
										setLocation(`/players/${encodeURIComponent(item.name)}`);
									}}
								/>
							);
						},
					}}
					fixedHeaderContent={() => (				
						<tr className="text-left">
							<TableHead>#</TableHead>
							<SortableHeader onSortChange={onSortChange} sortDirection={sortDirection} sortedBy={sortBy.value} sortValue="name">
								Name
							</SortableHeader>
							<SortableHeader onSortChange={onSortChange} sortDirection={sortDirection} sortedBy={sortBy.value} sortValue="tier.name">
								Tier
							</SortableHeader>
							<SortableHeader onSortChange={onSortChange} sortDirection={sortDirection} sortedBy={sortBy.value} sortValue="role">
								Role
							</SortableHeader>
							<SortableHeader onSortChange={onSortChange} sortDirection={sortDirection} sortedBy={sortBy.value} sortValue="team.franchise.name">
								Team
							</SortableHeader>
							<SortableHeader onSortChange={onSortChange} sortDirection={sortDirection} sortedBy={sortBy.value} sortValue="stats.rating">
								<span className="flex flex-left">
									<BiStats className="mr-2 text-orange-500" size="1.5em" /> Rating
								</span>
							</SortableHeader>
							<SortableHeader onSortChange={onSortChange} sortDirection={sortDirection} sortedBy={sortBy.value} sortValue="mmr">
								<span className="flex flex-left">
									<GiMoneyStack className="mr-2 text-green-500" size="1.5em" /> MMR
								</span>
							</SortableHeader>
						</tr>					
					)}
					data={players}
					itemContent={(index, player) => <MemoizedPlayerRows index={index} player={player} />}
				/>
			</div>
		</div>
	);
}
