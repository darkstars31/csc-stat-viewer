import * as React from "react";
import { useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useFetchFranchisesGraph } from "./dao/franchisesGraphQLDao";
import { SingleValue } from "react-select";
import { useCscStatsGraph } from "./dao/cscStatsGraphQLDao";
import { PlayerTypes, calculateHltvTwoPointOApproximationFromStats, determinePlayerRole } from "./common/utils/player-utils";
import { DiscordUser } from "./models/discord-users";

const useDataContextProvider = () => {
	const [ discordUser, setDiscordUser ] = React.useState<DiscordUser | null>(null);
	const [ selectedDataOption, setSelectedDataOption ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: dataConfiguration[0].name, value: dataConfiguration[0].name });
	const dataConfig = dataConfiguration.find( item => selectedDataOption?.value === item.name);

	const { data: cscSignedPlayers = [], isLoading: isLoadingSignedCscPlayers, error } = useCscPlayersGraph( PlayerTypes.SIGNED );
	const { data: cscSignedSubbedPlayers = [], isLoading: isLoadingSignedSubbedCscPlayers } = useCscPlayersGraph( PlayerTypes.SIGNED_SUBBED );
	const { data: cscTempSignedPlayers = [], isLoading: isLoadingTempSignedCscPlayers } = useCscPlayersGraph( PlayerTypes.TEMPSIGNED );
	const { data: cscPermaTempSignedPlayers = [], isLoading: isLoadingPermaTempSignedCscPlayers } = useCscPlayersGraph( PlayerTypes.PERMFA_TEMP_SIGNED );
	const { data: cscInactiveReservePlayers = [], isLoading: isLoadingInactiveReserveCscPlayers } = useCscPlayersGraph( PlayerTypes.INACTIVE_RESERVE );
	const { data: cscFreeAgentsPlayers = [], isLoading: isLoadingFreeAgentsCscPlayers } = useCscPlayersGraph( PlayerTypes.FREE_AGENT);
	const { data: cscDraftElegiblePlayers = [], isLoading: isLoadingDraftElegibleCscPlayers } = useCscPlayersGraph( PlayerTypes.DRAFT_ELIGIBLE );
	const { data: cscPermaFreeAgentPlayers = [], isLoading: isLoadingPermaFreeAgentPlayers } = useCscPlayersGraph( PlayerTypes.PERMANENT_FREE_AGENT );
	const { data: cscUnrosteredGMPlayers = [], isLoading: isLoadingUnrosteredGMPlayers } = useCscPlayersGraph( PlayerTypes.UNROSTERED_GM );
	const { data: cscUnrosteredAGMPlayers = [], isLoading: isLoadingUnrosteredAGMPlayers } = useCscPlayersGraph( PlayerTypes.UNROSTERED_AGM);
	const { data: cscSignedPromotedPlayers = [], isLoading: isLoadingSignPromoted } = useCscPlayersGraph( PlayerTypes.SIGNED_PROMOTED );
	const { data: cscInactivePlayers = [], isLoading: isLoadingInactivePlayers } = useCscPlayersGraph( PlayerTypes.INACTIVE );
	const { data: cscExpiredPlayers = [], isLoading: isLoadingExpiredPlayers } = useCscPlayersGraph( PlayerTypes.EXPIRED );
	//const { data: cscSpectatorPlayers = [] } = useCscPlayersGraph( "SPECTATOR" );

	const { data: cscStatsRecruit = [], isLoading: isLoadingCscStatsRecruit } = useCscStatsGraph( "Recruit", dataConfig?.season, "Combine" );
	const { data: cscStatsProspect = [], isLoading: isLoadingCscStatsProspect } = useCscStatsGraph( "Prospect", dataConfig?.season, "Combine" );
	const { data: cscStatsContender = [], isLoading: isLoadingCscStatsContender } = useCscStatsGraph( "Contender", dataConfig?.season, "Combine" );
	const { data: cscStatsChallenger = [], isLoading: isLoadingCscStatsChallenger } = useCscStatsGraph( "Challenger", dataConfig?.season, "Combine" );
	const { data: cscStatsElite = [], isLoading: isLoadingCscStatsElite } = useCscStatsGraph( "Elite", dataConfig?.season, "Combine" );
	const { data: cscStatsPremier = [], isLoading: isLoadingCscStatsPremier } = useCscStatsGraph( "Premier", dataConfig?.season, "Combine" );

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
		//...cscSpectatorPlayers,
	];

	const statsByTier = {
		Recruit: cscStatsRecruit,
		Prospect: cscStatsProspect,
		Contender: cscStatsContender,
		Challenger: cscStatsChallenger,
		Elite: cscStatsElite,
		Premier: cscStatsPremier,
	};

	//const players: Player[] = cscPlayers.map( cscPlayer => ({ ...cscPlayer, stats: stats.find( stats => (stats.name === cscPlayer?.name)) }));

	const players: Player[] = cscPlayers?.reduce( (acc,cscPlayer) => {
		const statsByTier = [
			{ tier: "Recruit", stats: cscStatsRecruit.find( stats => (stats.name === cscPlayer?.name)) },
			{ tier: "Prospect", stats:cscStatsProspect.find( stats => (stats.name === cscPlayer?.name)) },
			{ tier: "Contender", stats:cscStatsContender.find( stats => (stats.name === cscPlayer?.name)) },
			{ tier: "Challenger", stats:cscStatsChallenger.find( stats => (stats.name === cscPlayer?.name)) },
			{ tier: "Elite", stats:cscStatsElite.find( stats => (stats.name === cscPlayer?.name)) },
			{ tier: "Premier", stats:cscStatsPremier.find( stats => (stats.name === cscPlayer?.name)) },
		].filter( statsWithTier => statsWithTier?.stats );

		if( statsByTier.length > 0 ){
			const role = determinePlayerRole( statsByTier.find( s => s.tier === cscPlayer.tier.name)?.stats! );
			const stats = statsByTier.find( s => s.tier === cscPlayer.tier.name)?.stats!;
			acc.push( { ...cscPlayer,
				hltvTwoPointO: stats ? calculateHltvTwoPointOApproximationFromStats(stats) : undefined,
				role,
				stats, 
				statsOutOfTier: statsByTier.filter( statsWithTier => statsWithTier.tier !== cscPlayer.tier.name),
			});
		} else {
			acc.push( { ...cscPlayer as Player } );
		}
		return acc;
		
	}, [] as Player[]);

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
		discordUser, setDiscordUser,
		loggedinUser: players.find( p => p.discordId === discordUser?.id),
        players: players,
		franchises: cscFranchises,
		isLoading: isLoadingCscPlayers,
		loading: {
			isLoadingCscPlayers: isLoadingCscPlayers,
			isLoadingFranchises,
			stats: {
				isLoadingCscStatsRecruit,
				isLoadingCscStatsProspect,
				isLoadingCscStatsContender,
				isLoadingCscStatsChallenger,
				isLoadingCscStatsElite,
				isLoadingCscStatsPremier,
			}
		},
		statsByTier,
		selectedDataOption, setSelectedDataOption,
		dataConfig,
		featureFlags:{
		},
		errors: [ error ].filter(Boolean),
    };
}

const dataContext = React.createContext<ReturnType<typeof useDataContextProvider> | undefined>( undefined );

export const useDataContext = () => {
	const context = React.useContext( dataContext );

	if ( !context ) {
		throw new Error( "DataContext must be used within the DataContextProvider" );
	}

	return context;
};

export const DataContextProvider = ( { children }: { children: React.ReactNode | React.ReactNode[] } ) => {
	return (
		<dataContext.Provider value={useDataContextProvider()}>
			{children}
		</dataContext.Provider>
	);
};
