import * as React from "react";
import { useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { useFetchSeasonData } from "./dao/seasonPlayerStatsDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useFetchFranchisesGraph } from "./dao/franchisesGraphQLDao";
import { SingleValue } from "react-select";

const useDataContextProvider = () => {
	const [ selectedDataOption, setSelectedDataOption ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: dataConfiguration[0].name, value: dataConfiguration[0].name });
	const dataConfig = dataConfiguration.find( item => selectedDataOption?.value === item.name);

	const { data: cscSignedPlayers = [], isLoading: isLoadingSignedCscPlayers, error } = useCscPlayersGraph( "SIGNED" );
	const { data: cscSignedSubbedPlayers = [], isLoading: isLoadingSignedSubbedCscPlayers } = useCscPlayersGraph( "SIGNED_SUBBED" );
	const { data: cscTempSignedPlayers = [], isLoading: isLoadingTempSignedCscPlayers } = useCscPlayersGraph( "TEMPSIGNED" );
	const { data: cscPermaTempSignedPlayers = [], isLoading: isLoadingPermaTempSignedCscPlayers } = useCscPlayersGraph( "PERMFA_TEMP_SIGNED" );
	const { data: cscInactiveReservePlayers = [], isLoading: isLoadingInactiveReserveCscPlayers } = useCscPlayersGraph( "INACTIVE_RESERVE" );
	const { data: cscFreeAgentsPlayers = [], isLoading: isLoadingFreeAgentsCscPlayers } = useCscPlayersGraph( "FREE_AGENT");
	const { data: cscDraftElegiblePlayers = [], isLoading: isLoadingDraftElegibleCscPlayers } = useCscPlayersGraph( "DRAFT_ELIGIBLE" );
	const { data: cscPermaFreeAgentPlayers = [], isLoading: isLoadingPermaFreeAgentPlayers } = useCscPlayersGraph( "PERMANENT_FREE_AGENT" );
	const { data: cscUnrosteredGMPlayers = [], isLoading: isLoadingUnrosteredGMPlayers } = useCscPlayersGraph( "UNROSTERED_GM" );
	const { data: cscUnrosteredAGMPlayers = [], isLoading: isLoadingUnrosteredAGMPlayers } = useCscPlayersGraph( "UNROSTERED_AGM" );
	const { data: cscSignedPromotedPlayers = [], isLoading: isLoadingSignPromoted } = useCscPlayersGraph("SIGNED_PROMOTED");
	const { data: cscInactivePlayers = [], isLoading: isLoadingInactivePlayers } = useCscPlayersGraph( "INACTIVE" );
	//const { data: cscSpectatorPlayers = [] } = useCscPlayersGraph( "SPECTATOR" );


	const { data: cscFranchises = [], isLoading: isLoadingFranchises } = useFetchFranchisesGraph();
	const { data: playerStats = [], isLoading: isLoadingPlayerStats } = useFetchSeasonData(dataConfig!);

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
		//...cscSpectatorPlayers,
	];

	const players: Player[] = cscPlayers?.flatMap( cscPlayer => {
		const foundStats = playerStats.filter( ps => (ps.Steam === "sid".concat(cscPlayer?.steam64Id ?? 0)));
		return foundStats.map( stats => ({ ...cscPlayer, stats: stats}));
	});

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
	].some(Boolean);

    return {
        players: players,
		franchises: cscFranchises,
		isLoading: isLoadingPlayerStats && isLoadingCscPlayers,
		loading: {
			isLoadingCscPlayers: isLoadingCscPlayers,
			isLoadingPlayerStats,
			isLoadingFranchises,
		},
		selectedDataOption, setSelectedDataOption,
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
