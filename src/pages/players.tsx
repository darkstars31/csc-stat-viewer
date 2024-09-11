import * as React from "react";
import { Container } from "../common/components/container";
import { InputWithFloatingLabel } from "../common/components/inputWithFloatingLabel";
import { Pill } from "../common/components/pill";
import Select, { MultiValue, SingleValue } from "react-select";
import { useDataContext } from "../DataContext";
import { MdGridView, MdOutlineViewHeadline } from "react-icons/md";
import { TbDatabaseExport } from "react-icons/tb";
import { useLocalStorage } from "../common/hooks/localStorage";
import { PlayerTypes } from "../common/utils/player-utils";
import { PlayerTypeFilter } from "../common/components/filters/playerTypeFilter";
import { PlayerRolesFilter } from "../common/components/filters/playerRoleFilter";
import { PlayerTiersFilter } from "../common/components/filters/playerTiersFilter";
import { PlayerList } from "./players/player-list";
import { Player } from "../models";
import Papa from "papaparse";
import { selectClassNames } from "../common/utils/select-utils";

const sortOptionsList = [
	{ label: "Name", value: "name" },
	{ label: "Rating", value: "stats.rating" },
	{ label: "MMR", value: "mmr" },
];

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
	const [orderBy, setOrderBy] = useLocalStorage("orderBy", JSON.stringify(sortOptionsList[0])); // React.useState<SingleValue<{label: string;value: string;}>>(sortOptionsList[0]);
	const [viewTierOptions, setViewTierOptions] = useLocalStorage("viewTierOptions", JSON.stringify([])); //React.useState<MultiValue<{label: string;value: string;}>>();
	const [viewPlayerTypeOptions, setViewPlayerTypeOptions] = useLocalStorage(
		"viewPlayerTypeOptions",
		JSON.stringify([]),
	); //React.useState<MultiValue<{label: string;value: PlayerTypes[];}>>();
	const [viewPlayerRoleOptions, setViewPlayerRoleOptions] = useLocalStorage(
		"viewPlayerRoleOptions",
		JSON.stringify([]),
	); //React.useState<MultiValue<{label: string;value: string;}>>();

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
		setSearchValue("");
		const newFilters = [...filters, searchValue].filter(Boolean);
		setFilters(newFilters);
	};

	const removeFilter = (label: string) => {
		const newFilters = filters;
		delete newFilters[filters.indexOf(label)];
		setFilters(newFilters.filter(Boolean));
	};

	return (
		<Container>
			<div className="mx-auto max-w-lg text-center">
				<h2 className="text-3xl font-bold sm:text-4xl">Players</h2>
				<p className="mt-4 text-gray-300">Find players, view stats, see how you stack up against your peers.</p>
				<form
					className="flex flex-box h-12 mx-auto"
					onSubmit={e => {
						e.preventDefault();
					}}
				>
					<InputWithFloatingLabel
						className="basis-9/12 grow"
						label="Filter"
						placeHolder="Player Name"
						type="text"
						onChange={e => setSearchValue(e.currentTarget.value)}
						value={searchValue}
					/>
					<button
						type="submit"
						className="basis-3/12 ml-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-2 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
						onClick={addFilter}
					>
						Filter
					</button>
				</form>
				<div className="pt-4">
					{filters.map(filter => (
						<Pill key={filter} label={filter} onClick={() => removeFilter(filter)} />
					))}
				</div>
			</div>
			<div className={`grid grid-cols-2 md:grid-cols-5 justify-end`}>
				<div className="basis-1/6">
					<PlayerTypeFilter
						onChange={
							setViewPlayerTypeOptions as typeof React.useState<
								MultiValue<{ label: string; value: PlayerTypes[] }>
							>
						}
					/>
				</div>
				<div className="basis-1/6">
					<PlayerTiersFilter
						onChange={
							setViewTierOptions as typeof React.useState<MultiValue<{ label: string; value: string }>>
						}
					/>
				</div>
				<div className="basis-1/6">
					<PlayerRolesFilter
						onChange={
							setViewPlayerRoleOptions as typeof React.useState<
								MultiValue<{ label: string; value: string }>
							>
						}
					/>
				</div>
				<div className="basis-1/6">
					<div className="flex flex-row text-xs m-1">
						<label title="Sort" className="p-1 leading-9">
							Sort
						</label>
						<Select
							className="grow"
							unstyled
							defaultValue={orderBy}
							isSearchable={false}
							classNames={selectClassNames}
							options={sortOptionsList}
							onChange={setOrderBy}
						/>
					</div>
				</div>
			</div>
			<hr className="h-px my-2 border-0 bg-gray-800" />
			<div className="flex justify-between">
				<p className="mt-4 text-sx text-gray-500">
					Showing {filteredBySearchPlayers.length} of {players.length} Players
				</p>
				<div className="m-2 justify-end flex">
					<button
						title="Export Stats as CSV"
						className={`p-2 m-1 rounded border bg-indigo-600 border-indigo-600`}
						onClick={() => exportAsCsv(filteredBySearchPlayers)}
					>
						<TbDatabaseExport />
					</button>
					<button
						title="Card View"
						className={`p-2 m-1 rounded border ${displayStyle === "cards" ? "border-gold-600" : "border-indigo-600"} bg-indigo-600`}
						onClick={() => setDisplayStyle("cards")}
					>
						<MdGridView />
					</button>
					<button
						title="List View"
						className={`p-2 m-1 rounded border ${displayStyle === "list" ? "border-gold-600" : "border-indigo-600"} bg-indigo-600`}
						onClick={() => setDisplayStyle("list")}
					>
						<MdOutlineViewHeadline />
					</button>
				</div>
			</div>
			<div className="pb-8">
				<PlayerList orderBy={orderBy} displayStyle={displayStyle} players={filteredBySearchPlayers} />
			</div>
		</Container>
	);
}
