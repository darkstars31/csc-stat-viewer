import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { shortTeamNameTranslator } from "../common/utils/player-utils";
import { Loading } from "../common/components/loading";
import Select, { MultiValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { PlayerCompareRadar } from "./charts/playerCompareRadar";
import { Player } from "../models/player";
import { ComparisonTable } from "./playerComparison/comparisonTable";

export function PlayerComparison() {
	const qs = new URLSearchParams(window.location.search);
	const playersFromUrl = qs.get("players") ?? "";
	const [selectedPlayers, setSelectedPlayers] = React.useState<MultiValue<{ label: string; value: Player }>>([]);
	const { players = [], isLoading } = useDataContext();

	React.useEffect(() => {
		if (playersFromUrl) {
			const playerNames = playersFromUrl.split(",");
			setSelectedPlayers(
				playerNames
					.map(name => {
						const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());
						return player ?
								{
									label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`,
									value: player,
									isDisabled: !player.stats,
								}
							:	false;
					})
					.filter(Boolean) as MultiValue<{ label: string; value: Player }>,
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (selectedPlayers.length > 0) {
			const url = new URL(window.location.href);
			url.searchParams.set("players", decodeURIComponent(selectedPlayers.map(p => p.value.name).join(",")));
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

	const playerOptions = players.map(player => ({
		label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`,
		value: player,
		isDisabled: !player.stats,
	}));
	playerOptions.sort((a, _) => (a.isDisabled ? 1 : -1));

	return (
		<Container>
			<h2 className="text-3xl font-bold sm:text-4xl">Player Comparison Tool</h2>
			<p>
				Values are percentile 0-100% when compared to all players within the same tier for a given stat
				property. (i.e. A value of 100 is top player)
			</p>
			<hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
			<p>Search for players by name. Tier Average is based on first player selected.</p>
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
							options={playerOptions}
							onChange={
								setSelectedPlayers as typeof React.useState<
									MultiValue<{ label: string; value: string }>
								>
							}
						/>
					</div>
				</div>
			</div>
			<div className="flex">
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
			<ComparisonTable selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)} />
		</Container>
	);
}
