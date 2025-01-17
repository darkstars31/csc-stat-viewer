import * as React from "react";
import { useCscPlayersCache, useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useFetchFranchisesGraph } from "./dao/franchisesGraphQLDao";
import { useCscStatsCache } from "./dao/cscStatsGraphQLDao";
import {
	PlayerTypes,
	calculateHltvTwoPointOApproximationFromStats,
	determinePlayerRole,
} from "./common/utils/player-utils";
import { DiscordUser } from "./models/discord-users";
import { useCscSeasonAndTiersGraph } from "./dao/cscSeasonAndTiersDao";
import { ExtendedStats } from "./models/extended-stats";
import { useAnalytikillExtendedStats } from "./dao/analytikill";
import { useCscSeasonMatches } from "./dao/cscSeasonMatches";
import { queryClient } from "./App";

const useDataContextProvider = () => {
	const [discordUser, setDiscordUser] = React.useState<DiscordUser | null>(null);
	const { data: seasonAndTierConfig = undefined, isLoading: isLoadingCscSeasonAndTiers } = useCscSeasonAndTiersGraph();
	const [ players, setPlayers ] = React.useState<Player[]>([]);
	const { data: matches = [], isLoading: isLoadingMatches } = useCscSeasonMatches("Elite", seasonAndTierConfig?.number ?? 0);
    const [ enableExperimentalHistorialFeature, setEnableExperimentalHistorialFeature] = React.useState<boolean>(false);
	const [ seasonAndMatchType, setSeasonAndMatchType ] = React.useState<{ season: number; matchType: string }>({ season: seasonAndTierConfig?.number ?? 0, matchType: matches.length > 0 ? "Regulation" : "Combine" });
	const { data: extendedPlayerStats = [], isLoading: isLoadingExtendedStats } = useAnalytikillExtendedStats(seasonAndMatchType.season);
	const dataConfig = dataConfiguration.find(item => dataConfiguration[0].name === item.name);

	const hasSeasonStarted = matches.length > 0

	React.useEffect(() => {
		setSeasonAndMatchType({ season: seasonAndTierConfig?.number ?? 0, matchType: hasSeasonStarted ? "Regulation" : "Combine" });
	}, [isLoadingCscSeasonAndTiers === false, isLoadingMatches === false]);

	if ( seasonAndMatchType ) console.info("seasonAndMatchType", seasonAndMatchType);

	React.useEffect(() => {
		seasonAndTierConfig?.league.leagueTiers.forEach(tier => queryClient.invalidateQueries([`cscstats-graph`, tier.tier.name, seasonAndTierConfig?.number, seasonAndMatchType.matchType]));
		queryClient.invalidateQueries([`cscplayermatchhistory-graph`]);
	}, [seasonAndMatchType]);

	const { data: cscPlayers = [], isLoading: isLoadingCscPlayersCache, error } = useCscPlayersCache(seasonAndTierConfig?.number, { enabled: !isLoadingMatches && !isLoadingCscSeasonAndTiers });

	const { data, isLoading: isLoadingCachedStats} = useCscStatsCache( 
		seasonAndMatchType?.season,
		seasonAndMatchType.matchType,
		{ enabled: !isLoadingMatches && !isLoadingCscSeasonAndTiers }
	)

	const statsByTier = {
		Recruit: data?.data.Recruit,
		Prospect: data?.data.Prospect,
		Contender: data?.data.Contender,
		Challenger: data?.data.Challenger,
		Elite: data?.data.Elite,
		Premier: data?.data.Premier,
	};

	const { data: cscFranchises = [], isLoading: isLoadingFranchises } = useFetchFranchisesGraph();


	const playersMissingTier = cscPlayers?.filter(cscPlayer => cscPlayer?.tier === undefined);
	if(playersMissingTier.length > 0) console.info("Players Missing Tier",playersMissingTier);

	React.useEffect(() => {

		const specialRoles = {
			"76561197998527398": "THE GOAT",
			"76561198855758438": "BAITER",
			"76561199389109923": "ECO FRAGGER",
			"76561198368540894": "AWP CRUTCH",
		};	

		const players: Player[] = cscPlayers
		?.filter(cscPlayer => cscPlayer.tier?.name)
		.filter(cscPlayer => !enableExperimentalHistorialFeature ? cscPlayer?.type !== PlayerTypes.SPECTATOR : true)
		.reduce((acc, cscPlayer) => {
			const statsForPlayerByTier = [
				{
					tier: "Recruit",
					stats: statsByTier.Recruit?.find(stats => stats.name === cscPlayer?.name),
				},
				{
					tier: "Prospect",
					stats: statsByTier.Prospect?.find(stats => stats.name === cscPlayer?.name),
				},
				{
					tier: "Contender",
					stats: statsByTier.Contender?.find(stats => stats.name === cscPlayer?.name),
				},
				{
					tier: "Challenger",
					stats: statsByTier.Challenger?.find(stats => stats.name === cscPlayer?.name),
				},
				{
					tier: "Elite",
					stats: statsByTier.Elite?.find(stats => stats.name === cscPlayer?.name),
				},
				{
					tier: "Premier",
					stats: statsByTier.Premier?.find(stats => stats.name === cscPlayer?.name),
				},
			].filter(statsWithTier => statsWithTier?.stats);
	
			if (statsForPlayerByTier.length > 0) {
				var role =
					specialRoles[cscPlayer.steam64Id as keyof typeof specialRoles] ?
						specialRoles[cscPlayer.steam64Id as keyof typeof specialRoles]
					:	determinePlayerRole(statsForPlayerByTier.find(s => s.tier === cscPlayer.tier.name)?.stats!);
				const stats = statsForPlayerByTier.find(s => s.tier === cscPlayer.tier.name)?.stats!;
				

				const extendedStats = extendedPlayerStats.find(
					(stats: { name: string }) => stats.name === cscPlayer?.name,
				) as ExtendedStats ?? undefined;
	
				const statsOutOfTier = statsForPlayerByTier.length > 0 ?
				statsForPlayerByTier.filter(statsWithTier => statsWithTier.tier !== cscPlayer.tier.name)
					: null;
	
				acc.push({
					...cscPlayer,
					hltvTwoPointO: stats ? calculateHltvTwoPointOApproximationFromStats(stats) : undefined,
					role,
					stats,
					extendedStats,
					statsOutOfTier,
				});
			} else {
				acc.push({ ...(cscPlayer as Player) });
			}
			return acc;
		}, [] as Player[]);
		setPlayers(players);
	}, [isLoadingCachedStats, isLoadingCscPlayersCache, enableExperimentalHistorialFeature]);
	

	// const tierNumber = {
	// 	Recruit: 1,
	// 	Prospect: 2,
	// 	Contender: 3,
	// 	Challenger: 4,
	// 	Elite: 5,
	// 	Premier: 6,
	// }

	// TODO: Creates a CSV for expiring contracts at end of season - Move this somewhere else for the next of next season
	// const x = players.filter( p => p.contractDuration === 1).map( p => ({ tier: p.tier?.name, name: p.name, team: p.team?.name ?? "None"}) );
	// const y = x.sort( (a,b) => tierNumber[b.tier as keyof typeof tierNumber] - tierNumber[a.tier as keyof typeof tierNumber] );
	// const blob = new Blob([papa.unparse(y)], { type: 'text/csv' });
	// const url = window.URL.createObjectURL(blob)
	// const a = document.createElement('a')
	// a.setAttribute('href', url)
	// a.setAttribute('download', 'PlayersWithStats.csv');
	// a.click()

	return {
		discordUser,
		setDiscordUser,
		loggedinUser: players.find(p => p.discordId === discordUser?.id),
		players: players,
		franchises: cscFranchises,
		isLoading: isLoadingCscPlayersCache || isLoadingCachedStats || isLoadingCscSeasonAndTiers || isLoadingMatches,
		loading: {
			isLoadingCscPlayers: isLoadingCscPlayersCache,
			isLoadingCscSeasonAndTiers: isLoadingCscSeasonAndTiers,
			isLoadingFranchises,
			isLoadingExtendedStats,
			isLoadingCachedStats
		},
		statsByTier,
		dataConfig,
		seasonAndMatchType,
		currentSeason: seasonAndTierConfig?.number ?? 0,
		hasSeasonStarted,
		enableExperimentalHistorialFeature,
		setEnableExperimentalHistorialFeature,
		tiers: seasonAndTierConfig?.league.leagueTiers ?? [],
		setSeasonAndMatchType,
		errors: [error].filter(Boolean),
	};
};

const dataContext = React.createContext<ReturnType<typeof useDataContextProvider> | undefined>(undefined);

export const useDataContext = () => {
	const context = React.useContext(dataContext);

	if (!context) {
		throw new Error("DataContext must be used within the DataContextProvider");
	}

	return context;
};

export const DataContextProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
	return <dataContext.Provider value={useDataContextProvider()}>{children}</dataContext.Provider>;
};
