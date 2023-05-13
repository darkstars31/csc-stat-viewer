import * as React from "react";
import { useCscNameAndAvatar, useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { useFetchSeasonData } from "./dao/seasonPlayerStatsDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useFetchFranchisesGraph } from "./dao/franchisesGraphQlDao";

const useDataContextProvider = () => {
	const [ selectedDataOption, setSelectedDataOption ] = React.useState<string>(dataConfiguration[0].name);
	const dataConfig = dataConfiguration.find( item => selectedDataOption === item.name);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: cscNameAndAvatar, isLoading: isLoadingCscNameAndAvatar } = useCscNameAndAvatar();
	const { data: cscPlayersResponse = null, isLoading: isLoadingCscPlayers } = useCscPlayersGraph(cscNameAndAvatar);
	const { data: cscFranchises, isLoading: isLoadingFranchises } = useFetchFranchisesGraph();
	const { data: playerStats = [], isLoading: isLoadingPlayerStats } = useFetchSeasonData(dataConfig!);

	const cscPlayers = React.useMemo( () => (cscPlayersResponse ?? cscNameAndAvatar)?.data?.players ?? [], [cscPlayersResponse, cscNameAndAvatar]);

	const players: Player[] = React.useMemo( () => cscPlayers?.flatMap( cscPlayer => {
		const foundStats = playerStats.filter( ps => (ps.Steam === "sid".concat(cscPlayer?.steam64Id ?? 0)));
		return foundStats.map( stats => ({ ...cscPlayer, stats: stats}));
	}), [ playerStats, cscPlayers]);
	
	//console.info( cscPlayers.length, playerStats.length, players.length);

    return {
        players: players,
		franchises: cscFranchises?.data.franchises,
		isLoading: isLoadingCscNameAndAvatar || isLoadingPlayerStats,
		loading: {
			isLoadingCscPlayers,
			isLoadingPlayerStats,
			isLoadingFranchises,
		},
		selectedDataOption, setSelectedDataOption,
		featureFlags:{
		},
    };
}

const dataContext = React.createContext<ReturnType<typeof useDataContextProvider> | undefined>( undefined );

export const useDataContext = () => {
	const context = React.useContext( dataContext );

	if ( !context ) {
		throw new Error( "useBulkUploadContext must be used within the BulkUploadContextProvider" );
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
