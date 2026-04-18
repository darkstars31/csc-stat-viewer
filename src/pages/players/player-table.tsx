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
import styled from "styled-components";

type Props = {
	players: Player[];
};

const TableHeader = styled.th.attrs({
    className: "px-6 py-4 whitespace-nowrap",
})`
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;
const Cell = styled.td.attrs({
    className: "px-6 py-4 whitespace-nowrap",
})`
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

function PlayerRows({ index, player }: { index: number; player: Player }) {
	return (
			<>
				<Cell className="font-medium">{index + 1}</Cell>
				<Cell>
					<div className="mr-4 rounded float-left">
						{ player.avatarUrl ? 
						<img width={32} height={32} className="rounded" src={player.avatarUrl} loading="lazy" alt="" /> :
						 <div className="w-8 h-8 bg-gray-300 rounded" /> }
					</div>
					<span className="leading-8">{player.name}</span>
				</Cell>
				<Cell>{player.tier.name}</Cell>
				<Cell>{player.role}</Cell>
				<Cell>
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
				</Cell>
				<Cell>
					{player.stats?.rating.toFixed(2)}{" "}
					<span className="text-xs text-slate-600">
						{player.stats?.gameCount < 3 ? `(GP:${player.stats?.gameCount})` : ""}
					</span>
				</Cell>
				<Cell>
					<Mmr player={player} />
				</Cell>
			</>
		)
}

export function PlayerTable({ players }: Props) {
	const [, setLocation] = useLocation();
	const MemoizedPlayerRows = React.memo(PlayerRows);
	return (
		<div className="w-full pb-16 flex flex-col overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-full py-2 sm:px-6 lg:px-8 overflow-hidden">					
			<div className="overflow-hidden rounded-lg border border-slate-800">
				<TableVirtuoso 				
					useWindowScroll
					overscan={100}
					totalCount={players.length}
					components={{
						Table: (props) => <table className="w-full table-auto border-separate border-spacing-0 font-light text-sx md:text-sm" {...props} />,
						TableHead: (props) => { return <thead className="border-b font-medium border-neutral-800" {...props} style={{zIndex: 1}} />; },
						TableRow: (props) => {
								return <tr className="w-full cursor-pointer border-b transition duration-300 ease-in-out border-slate-800 hover:bg-gray-800 hover:-translate-y-0.5 hover:translate-x-0.5" onClick={() => setLocation(`/players/${encodeURIComponent(props.item.name)}`)}  {...props} />},
					}}
					fixedHeaderContent={() => (				
						<tr className="text-left">
							<TableHeader>#</TableHeader>
							<TableHeader>Name</TableHeader>
							<TableHeader>Tier</TableHeader>
							<TableHeader>Role</TableHeader>
							<TableHeader>Team</TableHeader>
							<TableHeader>
								<span className="flex flex-left">
									<BiStats className="mr-2 text-orange-500" size="1.5em" /> Rating
								</span>
							</TableHeader>
							<TableHeader>
								<span className="flex flex-left">
									<GiMoneyStack className="mr-2 text-green-500" size="1.5em" /> MMR
								</span>
							</TableHeader>
						</tr>					
					)}
					data={players}
					itemContent={index => <MemoizedPlayerRows index={index} player={players[index]} />}
				/>
			</div>
		</div>
	);
}
