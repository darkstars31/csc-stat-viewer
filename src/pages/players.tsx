import * as React from "react";
import { Container } from "../common/components/container";
import Select, { MultiValue, SingleValue } from "react-select";
import { useDataContext } from "../DataContext";
import { useLocalStorage } from "../common/hooks/localStorage";
import { PlayerTypes } from "../common/utils/player-utils";
import { PlayerTypeFilter } from "../common/components/filters/playerTypeFilter";
import { PlayerRolesFilter } from "../common/components/filters/playerRoleFilter";
import { PlayerTiersFilter } from "../common/components/filters/playerTiersFilter";
import { Player } from "../models";
import Papa from "papaparse";
import { Loading } from "../common/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, LayoutGrid, List, Search, X } from "lucide-react";
import { defaultSortOption, SortDirection, SortOption } from "./players/sort";

const PlayerList = React.lazy(() =>import('./players/player-list').then(module => ({default: module.PlayerList})));

const exportAsCsv = (players: Player[]) => {
	const playerData = players
		.filter(p => Boolean(p.stats))
		.map(p => {
			// Hack to remove properties from stats and include player first class properties
			const { name, team, __typename, rating, ...rest } = p.stats;
			const stats = Object.keys(rest).reduce((acc, k) => {
				const value = rest[k as keyof typeof rest];
				acc[k] = typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value;
				return acc;
			}, {} as any);
			return {
				name: p.name,
				tier: p.tier.name,
				role: p.role,
				mmr: p.mmr,
				rating: p.stats.rating,
				...stats,
			};
		});
	var csv = Papa.unparse(playerData);
	const blob = new Blob([csv], { type: "text/csv" });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.setAttribute("href", url);
	a.setAttribute("download", "PlayersWithStats.csv");
	a.click();
};

export function Players() {
	//const queryParams = new URLSearchParams(window.location.search);
	// const types = queryParams.get("types");
	// const tiers = queryParams.get("tiers");
	// const roles = queryParams.get("roles");

	const { players } = useDataContext();
	const [displayStyle, setDisplayStyle] = useLocalStorage("displayStyle", "cards");
	const [searchValue, setSearchValue] = React.useState("");
	const [filters, setFilters] = React.useState<string[]>([]);
	const [orderBy, setOrderBy] = useLocalStorage("orderBy", JSON.stringify(defaultSortOption)) as [
		SortOption,
		React.Dispatch<React.SetStateAction<SortOption>>,
	];
	const [sortDirection, setSortDirection] = useLocalStorage("playerSortDirection", JSON.stringify("asc")) as [
		SortDirection,
		React.Dispatch<React.SetStateAction<SortDirection>>,
	];
	const [viewTierOptions, setViewTierOptions] = useLocalStorage("viewTierOptions", JSON.stringify([])); //React.useState<MultiValue<{label: string;value: string;}>>();
	const [viewPlayerTypeOptions, setViewPlayerTypeOptions] = useLocalStorage(
		"viewPlayerTypeOptions",
		JSON.stringify([]),
	);
	const [viewPlayerRoleOptions, setViewPlayerRoleOptions] = useLocalStorage(
		"viewPlayerRoleOptions",
		JSON.stringify([]),
	);

	const viewPlayerTypeOptionsCumulative = viewPlayerTypeOptions?.flatMap(
		(option: SingleValue<{ label: string; value: string }>) => option?.value,
	);
	const filteredByPlayerType =
		viewPlayerTypeOptions?.length ?
			players.filter(player =>
				viewPlayerTypeOptionsCumulative?.some((type: PlayerTypes | undefined) => type === player.type),
			)
		:	players;
	const filteredByTier =
		viewTierOptions?.length ?
			filteredByPlayerType.filter(player =>
				viewTierOptions?.some((tier: { value: string }) => tier.value === player.tier.name),
			)
		:	filteredByPlayerType;
	const filteredByRole =
		viewPlayerRoleOptions?.length ?
			filteredByTier.filter(player =>
				viewPlayerRoleOptions?.some((role: { value: string | undefined }) => role.value === player.role),
			)
		:	filteredByTier;
	const filteredBySearchPlayers =
		filters.length > 0 ?
			filteredByRole.filter(player => filters.some(f => player.name.toLowerCase().includes(f.toLowerCase())))
		:	filteredByRole;

	const addFilter = () => {
		if (!searchValue.trim()) {
			return;
		}

		setSearchValue("");
		const newFilters = [...filters, searchValue.trim()].filter(Boolean);
		setFilters(newFilters);
	};

	const removeFilter = (label: string) => {
		const newFilters = [...filters];
		delete newFilters[filters.indexOf(label)];
		setFilters(newFilters.filter(Boolean));
	};

	return (
		<Container>
			<div className="space-y-6">
				<Card className="overflow-hidden bg-midnight1/70 backdrop-blur-sm">
					<CardHeader className="gap-3 pb-5">
						<div className="space-y-2 text-center sm:text-left">
							<CardTitle className="text-3xl sm:text-4xl">Players</CardTitle>
							<CardDescription className="mx-auto max-w-2xl text-balance text-base text-gray-300 sm:mx-0">
								Find players, inspect stats, and switch between list and card views with reusable shared controls.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-5 pt-6">
						<form
							className="flex flex-col gap-3 sm:flex-row"
							onSubmit={e => {
								e.preventDefault();
								addFilter();
							}}
						>
							<div className="relative flex-1">
								<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									className="h-11 border-border/60 bg-background/40 pl-9"
									type="text"
									placeholder="Search players and add filter chips"
									onChange={e => setSearchValue(e.currentTarget.value)}
									value={searchValue}
								/>
							</div>
							<Button className="h-11 sm:min-w-28" type="submit">
								Filter
							</Button>
						</form>
						{filters.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{filters.map(filter => (
									<Badge key={filter} variant="accent" className="gap-1.5 px-3 py-1 text-sm">
										<span>{filter}</span>
										<button
											type="button"
											onClick={() => removeFilter(filter)}
											className="rounded-full p-0.5 text-sky-100 transition hover:bg-sky-400/20"
										>
											<span className="sr-only">Remove {filter} filter</span>
											<X className="size-3" />
										</button>
									</Badge>
								))}
							</div>
						) : null}
					</CardContent>
				</Card>
				<Card className="border-border/60 bg-midnight1/60">
					<CardContent className="space-y-5 pt-6">
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">					
							<PlayerTypeFilter
								onChange={
									setViewPlayerTypeOptions as typeof React.useState<
										MultiValue<{ label: string; value: PlayerTypes[] }>
									>
								}
							/>
							<PlayerTiersFilter
								onChange={
									setViewTierOptions as typeof React.useState<MultiValue<{ label: string; value: string }>>
								}
							/>						
							<PlayerRolesFilter
								onChange={
									setViewPlayerRoleOptions as typeof React.useState<
										MultiValue<{ label: string; value: string }>
									>
								}
							/>
							<div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex flex-wrap items-center gap-2">
									{/* <Button
										title="Export Stats as CSV"
										variant="secondary"
										className="bg-secondary/80"
										onClick={() => exportAsCsv(filteredBySearchPlayers)}
									>
										<Download className="size-4" />
										Export CSV
									</Button> */}
									<Button
										title="Card View"
										variant={displayStyle === "cards" ? "default" : "outline"}
										className={displayStyle === "cards" ? "border-primary/70" : "border-border/70 bg-background/20"}
										onClick={() => setDisplayStyle("cards")}
									>
										<LayoutGrid className="size-4" />
										Cards
									</Button>
									<Button
										title="List View"
										variant={displayStyle === "list" ? "default" : "outline"}
										className={displayStyle === "list" ? "border-primary/70" : "border-border/70 bg-background/20"}
										onClick={() => setDisplayStyle("list")}
									>
										<List className="size-4" />
										List
									</Button>
								</div>
							</div>					
						</div>
					</CardContent>
				</Card>
			</div>
			<React.Suspense fallback={<Loading />}>
				<PlayerList
					displayStyle={displayStyle}
					orderBy={orderBy}
					players={filteredBySearchPlayers}
					setOrderBy={setOrderBy}
					setSortDirection={setSortDirection}
					sortDirection={sortDirection}
				/>
			</React.Suspense>
		</Container>
	);
}
