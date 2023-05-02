import * as React from "react";
import { useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { useFetchSeasonData } from "./dao/seasonPlayerStatsDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";



const useDataContextProvider = () => {
	const [ selectedDataOption, setSelectedDataOption ] = React.useState<string>(dataConfiguration[0].name);
	const dataConfig = dataConfiguration.find( item => selectedDataOption === item.name);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: cscPlayersReponse = null, isLoading: isLoadingCscPlayers } = useCscPlayersGraph();
	const { data: playerStats = [], isLoading: isLoadingPlayerStats } = useFetchSeasonData(dataConfig!);

	const cscPlayers = cscPlayersReponse?.data?.players ?? [];
	const players: Player[] = cscPlayers?.map( cscPlayer => ({ ...cscPlayer, stats: playerStats.find( ps => (ps.Steam === "sid".concat(cscPlayer.steam64Id) && ps.Tier === cscPlayer.tier.name)) ?? null}));

	React.useEffect( () => {
	}, [selectedDataOption] );

    return {
        players: players,
		isLoading: isLoadingCscPlayers || isLoadingPlayerStats,
		selectedDataOption, setSelectedDataOption
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
