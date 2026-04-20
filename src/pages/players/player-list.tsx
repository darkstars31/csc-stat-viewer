import * as React from "react";
import { PlayerCard } from "./player-cards";
import { Player } from "../../models";
import { PlayerTable } from "./player-table";
import { VirtuosoGrid } from "react-virtuoso";
import Select, { SingleValue } from "react-select";

import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

import { selectClassNames } from "../../common/utils/select-utils";
import { SortDirection, sortOptionsList, SortOption, sortPlayers } from "./sort";

type Props = {
	orderBy: SortOption;
	displayStyle: string;
	players: Player[];
	setOrderBy: React.Dispatch<React.SetStateAction<SortOption>>;
	setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
	sortDirection: SortDirection;
};


export function PlayerListMemoized({ orderBy, displayStyle, players, setOrderBy, setSortDirection, sortDirection }: Props) {
	const orderedPlayerData = React.useMemo(() => sortPlayers(players, orderBy, sortDirection), [orderBy, players, sortDirection]);

	const handleSortFieldChange = (nextSortOption: SingleValue<SortOption>) => {
		if (!nextSortOption) {
			return;
		}

		setOrderBy(nextSortOption);
		setSortDirection(currentDirection =>
			orderBy.value === nextSortOption.value ? currentDirection : "asc",
		);
	};

	const handleToggleSortDirection = () => {
		setSortDirection(currentDirection => (currentDirection === "asc" ? "desc" : "asc"));
	};

	const handleTableSortChange = (nextSortValue: string) => {
		if (orderBy.value === nextSortValue) {
			setSortDirection(currentDirection => (currentDirection === "asc" ? "desc" : "asc"));
			return;
		}

		const nextSortOption = sortOptionsList.find(sortOption => sortOption.value === nextSortValue);

		if (!nextSortOption) {
			return;
		}

		setOrderBy(nextSortOption);
		setSortDirection("asc");
	};

	const playerCount = () => <p className="text-sm text-muted-foreground">
							<span className="font-semibold text-foreground">{orderedPlayerData.length}</span> of{" "}
							<span className="font-semibold text-foreground">{players.length}</span> players
						</p>;

	return <>
	{playerCount()}
	{ displayStyle === "cards" ? (
		<>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div className="space-y-1 flex">
					<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Sort Cards</p>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<div className="min-w-52">
							<Select
								className="grow"
								unstyled
								value={orderBy}
								isSearchable={false}
								classNames={selectClassNames}
								options={sortOptionsList}
								onChange={handleSortFieldChange}
							/>
						</div>
						<Button type="button" variant="outline" className="border-border/70 bg-background/20" onClick={handleToggleSortDirection}>
							{sortDirection === "asc" ? <ArrowUpAZ className="size-4" /> : <ArrowDownAZ className="size-4" />}
							{sortDirection === "asc" ? "Ascending" : "Descending"}
						</Button>
					</div>
				</div>
			</div>
			<VirtuosoGrid
				useWindowScroll
				overscan={100}
				listClassName="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"		
				totalCount={orderedPlayerData.length}
				itemContent={index => <PlayerCard player={orderedPlayerData[index]} />}
			/>
		</>
			)
	:
		(
			<PlayerTable
				players={orderedPlayerData}
				onSortChange={handleTableSortChange}
				sortBy={orderBy}
				sortDirection={sortDirection}
			/>
		)
	}
	</>;
}

export const PlayerList = React.memo(PlayerListMemoized);
