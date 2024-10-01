import * as React from "react";
import { useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useFetchFranchisesGraph } from "./dao/franchisesGraphQLDao";
import { useCscStatsGraph, useMultipleCscStatsGraph } from "./dao/cscStatsGraphQLDao";
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
	const { data: extendedPlayerStats = undefined, isLoading: isLoadingExtendedStats } = useAnalytikillExtendedStats();
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

	const {
		data: cscSignedPlayers = [],
		isLoading: isLoadingSignedCscPlayers,
		error,
	} = useCscPlayersGraph(PlayerTypes.SIGNED);
	const { data: cscSignedSubbedPlayers = [], isLoading: isLoadingSignedSubbedCscPlayers } = useCscPlayersGraph(
		PlayerTypes.SIGNED_SUBBED,
	);
	const { data: cscTempSignedPlayers = [], isLoading: isLoadingTempSignedCscPlayers } = useCscPlayersGraph(
		PlayerTypes.TEMPSIGNED,
	);
	const { data: cscPermaTempSignedPlayers = [], isLoading: isLoadingPermaTempSignedCscPlayers } = useCscPlayersGraph(
		PlayerTypes.PERMFA_TEMP_SIGNED,
	);
	const { data: cscInactiveReservePlayers = [], isLoading: isLoadingInactiveReserveCscPlayers } = useCscPlayersGraph(
		PlayerTypes.INACTIVE_RESERVE,
	);
	const { data: cscFreeAgentsPlayers = [], isLoading: isLoadingFreeAgentsCscPlayers } = useCscPlayersGraph(
		PlayerTypes.FREE_AGENT,
	);
	const { data: cscDraftElegiblePlayers = [], isLoading: isLoadingDraftElegibleCscPlayers } = useCscPlayersGraph(
		PlayerTypes.DRAFT_ELIGIBLE,
	);
	const { data: cscPermaFreeAgentPlayers = [], isLoading: isLoadingPermaFreeAgentPlayers } = useCscPlayersGraph(
		PlayerTypes.PERMANENT_FREE_AGENT,
	);
	const { data: cscUnrosteredGMPlayers = [], isLoading: isLoadingUnrosteredGMPlayers } = useCscPlayersGraph(
		PlayerTypes.UNROSTERED_GM,
	);
	const { data: cscUnrosteredAGMPlayers = [], isLoading: isLoadingUnrosteredAGMPlayers } = useCscPlayersGraph(
		PlayerTypes.UNROSTERED_AGM,
	);
	const { data: cscSignedPromotedPlayers = [], isLoading: isLoadingSignPromoted } = useCscPlayersGraph(
		PlayerTypes.SIGNED_PROMOTED,
	);
	const { data: cscInactivePlayers = [], isLoading: isLoadingInactivePlayers } = useCscPlayersGraph(
		PlayerTypes.INACTIVE,
	);
	const { data: cscExpiredPlayers = [], isLoading: isLoadingExpiredPlayers } = useCscPlayersGraph(
		PlayerTypes.EXPIRED,
		{ skipCache: true },
	);
	const { data: cscSpectatorPlayers = [] } = useCscPlayersGraph( "SPECTATOR" );

	const data = useMultipleCscStatsGraph(
		[ "Recruit","Prospect","Contender","Challenger","Elite","Premier"],
		seasonAndMatchType?.season,
		seasonAndMatchType.matchType 
	);

	const { data: cscFranchises = [], isLoading: isLoadingFranchises } = useFetchFranchisesGraph();

	const cscPlayers = [
		...cscSignedPlayers,
		...cscFreeAgentsPlayers,
		...cscDraftElegiblePlayers,
		...cscPermaFreeAgentPlayers,
		...cscInactiveReservePlayers,
		...cscSignedSubbedPlayers,
		...cscTempSignedPlayers,
		...cscPermaTempSignedPlayers,
		...cscUnrosteredGMPlayers,
		...cscInactivePlayers,
		...cscUnrosteredAGMPlayers,
		...cscSignedPromotedPlayers,
		...cscExpiredPlayers,
	];

	if ( enableExperimentalHistorialFeature ) {
		cscPlayers.push(...cscSpectatorPlayers)
	}

	const statsByTier = {
		Recruit: data[0].data,
		Prospect: data[1].data,
		Contender: data[2].data,
		Challenger: data[3].data,
		Elite: data[4].data,
		Premier: data[5].data,
	};

	//const players: Player[] = cscPlayers.map( cscPlayer => ({ ...cscPlayer, stats: stats.find( stats => (stats.name === cscPlayer?.name)) }));
	//console.info( cscPlayers.reduce( (a, player) => { a[player.steam64Id] = ""; return a }, {} as any ));

	const playersMissingTier = cscPlayers?.filter(cscPlayer => cscPlayer?.tier === undefined);
	if(playersMissingTier.length > 0) console.info("Players Missing Tier",playersMissingTier);

	React.useEffect(() => {

		const specialRoles = {
			"76561198855758438": "BAITER",
			"76561199389109923": "ECO FRAGGER",
			"76561198368540894": "AWP CRUTCH",
		};	

		const players: Player[] = cscPlayers?.filter(cscPlayer => cscPlayer.tier?.name).reduce((acc, cscPlayer) => {
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
	
				const extendedStats = extendedPlayerStats?.find(
					(stats: { name: string }) => stats.name === cscPlayer?.name,
				) as ExtendedStats;
	
				const statsOutOfTier = statsForPlayerByTier.length > 0 ?
				statsForPlayerByTier.filter(statsWithTier => statsWithTier.tier !== cscPlayer.tier.name)
					:	null;
	
				if( cscPlayer.name.includes("Jarts")) console.info( statsOutOfTier )
	
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
	}, [
		[
			data[0].isLoading,
			data[1].isLoading,
			data[2].isLoading,
			data[3].isLoading,
			data[4].isLoading,
			data[5].isLoading
		].every(Boolean),
	]);
	

	const isLoadingCscPlayers = [
		isLoadingSignedCscPlayers,
		isLoadingFreeAgentsCscPlayers,
		isLoadingDraftElegibleCscPlayers,
		isLoadingPermaFreeAgentPlayers,
		isLoadingInactiveReserveCscPlayers,
		isLoadingSignedSubbedCscPlayers,
		isLoadingTempSignedCscPlayers,
		isLoadingPermaTempSignedCscPlayers,
		isLoadingUnrosteredGMPlayers,
		isLoadingInactivePlayers,
		isLoadingUnrosteredAGMPlayers,
		isLoadingSignPromoted,
		isLoadingExpiredPlayers,
		isLoadingCscSeasonAndTiers,
	].some(Boolean);

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
		isLoading: isLoadingCscPlayers,
		loading: {
			isLoadingCscPlayers: isLoadingCscPlayers,
			isLoadingCscSeasonAndTiers: isLoadingCscSeasonAndTiers,
			isLoadingFranchises,
			isLoadingExtendedStats,
			stats: {
				isLoadingCscStatsRecruit: data[0].isLoading,
				isLoadingCscStatsProspect: data[1].isLoading,
				isLoadingCscStatsContender: data[2].isLoading,
				isLoadingCscStatsChallenger: data[3].isLoading,
				isLoadingCscStatsElite: data[4].isLoading,
				isLoadingCscStatsPremier: data[5].isLoading,
			},
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
