import * as React from "react";
import { useCscPlayersCache, useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useFetchFranchisesGraph } from "./dao/franchisesGraphQLDao";
import { useCscCombinedCache } from "./dao/cscStatsGraphQLDao";
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
	const { data, isLoading: isLoadingCachedStats, error} = useCscCombinedCache()
	//const { data: seasonAndTierConfig = undefined, isLoading: isLoadingCscSeasonAndTiers } = useCscSeasonAndTiersGraph();
	const [ players, setPlayers ] = React.useState<Player[]>([]);
	//const { data: matches = [], isLoading: isLoadingMatches } = useCscSeasonMatches("Elite", seasonAndTierConfig?.number ?? 0);
    const [ enableExperimentalHistorialFeature, setEnableExperimentalHistorialFeature] = React.useState<boolean>(false);
	const [ seasonAndMatchType, setSeasonAndMatchType ] = React.useState<{ season: number; matchType: string }>({ season: data?.seasonAndTierConfig?.number ?? 0, matchType: data?.hasSeasonStarted ? "Regulation" : "Combine" });
	const { data: extendedPlayerStats = undefined, isLoading: isLoadingExtendedStats } = useAnalytikillExtendedStats();
	const dataConfig = dataConfiguration.find(item => dataConfiguration[0].name === item.name);

	const hasSeasonStarted = data?.hasSeasonStarted;

	React.useEffect(() => {
		setSeasonAndMatchType({ season: data?.seasonAndTierConfig?.number ?? 0, matchType: data?.hasSeasonStarted ? "Regulation" : "Combine" });
	}, [data]);

	// if ( seasonAndMatchType ) console.info("seasonAndMatchType", seasonAndMatchType);

	// React.useEffect(() => {
	// 	seasonAndTierConfig?.league.leagueTiers.forEach(tier => queryClient.invalidateQueries([`cscstats-graph`, tier.tier.name, seasonAndTierConfig?.number, seasonAndMatchType.matchType]));
	// 	queryClient.invalidateQueries([`cscplayermatchhistory-graph`]);
	// }, [seasonAndMatchType]);

	//const { data: cscPlayers = [], isLoading: isLoadingCscPlayersCache, error } = useCscPlayersCache(seasonAndTierConfig?.number, { enabled: !isLoadingMatches && !isLoadingCscSeasonAndTiers });

	const { data: cscFranchises = [], isLoading: isLoadingFranchises } = useFetchFranchisesGraph();


	// const playersMissingTier = cscPlayers?.filter(cscPlayer => cscPlayer?.tier === undefined);
	// if(playersMissingTier.length > 0) console.info("Players Missing Tier",playersMissingTier);

	// React.useEffect(() => {


	// 	setPlayers(players);
	// }, [enableExperimentalHistorialFeature]);

	console.info( data );
	
	

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
		loggedinUser: players?.find(p => p.discordId === discordUser?.id),
		players: data?.players ?? [],
		franchises: cscFranchises,
		isLoading: isLoadingCachedStats,
		loading: {
			isLoadingFranchises,
			isLoadingExtendedStats,
			isLoadingCachedStats
		},
		dataConfig,
		seasonAndMatchType,
		currentSeason: data?.seasonAndTierConfig?.number ?? 0,
		hasSeasonStarted,
		enableExperimentalHistorialFeature,
		setEnableExperimentalHistorialFeature,
		tiers: data?.seasonAndTierConfig?.league.leagueTiers ?? [],
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
