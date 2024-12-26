import * as React from "react";
import { Container } from "../common/components/container";
import * as Containers from "../common/components/containers";
import { useDataContext } from "../DataContext";
import { shortTeamNameTranslator } from "../common/utils/player-utils";
import { Loading } from "../common/components/loading";
import Select, { MultiValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { Player } from "../models/player";
import {TeamPercentiles} from "./team/teamPercentiles";
import {Exandable} from "../common/components/containers/Expandable";
import {SetStateAction} from "react";

const PlayerCompareRadar = React.lazy(() =>import('./charts/playerCompareRadar').then(module => ({default: module.PlayerCompareRadar})));
const ComparisonTable = React.lazy(() =>import('./playerComparison/comparisonTable').then(module => ({default: module.ComparisonTable})));



export function PlayerComparison() {
	const qs = new URLSearchParams(window.location.search);
	const playersFromUrl = qs.get("players") ?? "";
	const [selectedPlayers, setSelectedPlayers] = React.useState<MultiValue<{ label: string; value: Player }>>([]);
	const [selectedTier, setSelectedTier] = React.useState<string>("");
	const [sameTierOnly, setSameTierOnly] = React.useState<boolean>(false);
	const { players = [], isLoading } = useDataContext();

	React.useEffect(() => {
		if (playersFromUrl) {
			const playerNames = playersFromUrl.split(",");
			setSelectedPlayers(
				playerNames
					.flatMap(name => {
						const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());
						
						if ( player ) {
							const playerOptions = [
								{
									label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`,
									value: player,
									isDisabled: !player.stats,
								}
							];
							// Object.values(player?.statsOutOfTier ?? {}).forEach((item) => {
							// 	console.info( 'statsOutOfTier', player.name, item.tier)
							// 	playerOptions.push({
							// 		label: `${player.name} (${item.tier}* ${shortTeamNameTranslator(player)})}`,
							// 		value: { ...player, stats: player.statsOutOfTier!.find( s => s.tier === item.tier)!.stats! },
							// 		isDisabled: false,
							// 	})
							// })
	
							return playerOptions;
						}
					})
					.filter(Boolean) as MultiValue<{ label: string; value: Player }>,
					
			);
		}
	}, []);

	React.useEffect(() => {
		if (selectedPlayers.length > 0) {
			const url = new URL(window.location.href);
			url.searchParams.set("players", decodeURIComponent(selectedPlayers.map(p => `${p.value.name}`).join(",")));
			window.history.pushState(null, "", url);
		}
	}, [selectedPlayers]);

	if (isLoading) {
		return (
			<Container>
				<Loading />
			</Container>
		);
	}

	const playerOptions = players.filter(player => !player.tier.name.includes("Unrated")).map(player => ({
		label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`,
		value: player,
		isDisabled: !player.stats,
	}));
	players.filter(player => !player.tier.name.includes("Unrated")).forEach(player => {
		Object.values(player?.statsOutOfTier ?? {}).forEach((item) => {
			//if ( player.name.includes('XIE') ) console.info( 'statsOutOfTier', player.name, player.tier.name, item.tier, player.stats, player.statsOutOfTier)
			playerOptions.push({
				label: `${player.name} (${item.tier}* ${shortTeamNameTranslator(player)})`,
				value: { ...player, name: `${player.name}|${item.tier}`, tier: { name: item.tier}, stats: player.statsOutOfTier!.find( s => s.tier === item.tier)!.stats! },
				isDisabled: false,
			})
		})

	})
	playerOptions.sort((a, _) => (a.isDisabled ? 1 : -1));

	selectedPlayers.forEach(p => {
		console.info( p )
	})

	let filteredPlayerOptions = playerOptions;

	if (selectedTier != "" && sameTierOnly) {
		filteredPlayerOptions = playerOptions.filter(p => p.value.tier.name === selectedTier);
	}

	function onSameTierOnlyChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSameTierOnly(e.target.checked);
	}

	return (
		<Container>
			<h2 className="text-3xl font-bold sm:text-4xl">Player Comparison Tool</h2>
			<p>
				Values are percentile 0-100% when compared to all players within the same tier for a given stat
				property. (i.e. A value of 100 is top player)
			</p>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800"/>
			<p>Search for players by name. Tier Average is based on first player selected.</p>
			<div className="flex items-center mb-4">
				<input id="same-tier-only" type="checkbox" value=""
					  onChange={onSameTierOnlyChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
				<label htmlFor="same-tier-only" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Same Tier Only</label>
			</div>
			<div>
				<div className="flex flex-row text-xs my-2 mx-1">
					<label title="Player Type" className="p-1 leading-9">
						Player(s)
					</label>
					<div className="flex flex-row w-full">
						<Select
							placeholder="Search for player by name..."
							isClearable={true}
							className="grow"
							unstyled
							isMulti
							value={selectedPlayers}
							isSearchable={true}
							classNames={selectClassNames}
							options={selectedTier == "" ? playerOptions : filteredPlayerOptions}
							onChange={(selectedOptions) => {

								// setSelectedPlayers as typeof React.useState<
								// 	MultiValue<{ label: string; value: string }>
								// >
								setSelectedTier(selectedOptions[0]?.value.tier.name ?? "");
								setSelectedPlayers(selectedOptions as SetStateAction<MultiValue<{     label: string;     value: Player; }>>);
							}
							}
						/>
					</div>
				</div>
			</div>
			<React.Suspense fallback={<Loading/>}>
				<div className="grid grid-cols-1 sm:grid-cols-2">
					<PlayerCompareRadar
						selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}
						tier={Array.from(selectedPlayers.values()).map(p => p.value)[0]?.tier.name ?? "Contender"}
						statOptions={["rating", "pit", "kast", "adr", "kr", "hs"]}
						startAngle={90}
					/>
					<PlayerCompareRadar
						selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}
						tier={Array.from(selectedPlayers.values()).map(p => p.value)[0]?.tier.name ?? "Contender"}
						statOptions={["utilDmg", "ef", "fAssists", "suppXR", "util"]}
						startAngle={180}
					/>
				</div>
				<Exandable title="Combined Stat Rankings">
					<Containers.StandardContentBox>
						<TeamPercentiles selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}/>
					</Containers.StandardContentBox>
				</Exandable>
				<ComparisonTable selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}/>
			</React.Suspense>
		</Container>
	);
}
