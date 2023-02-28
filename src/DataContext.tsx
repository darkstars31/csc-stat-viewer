import * as React from "react";
import { useFetchCombinePlayerData } from "./dao/combinePlayerDao";
import { useFetchContractGraph } from "./dao/contracts";
import { useFetchSeason10PlayerData } from "./dao/seasonPlayerStatsDao";

const useDataContextProvider = () => {
	const [ selectedData, setSelectedData ] = React.useState("season10");
	const { data: contracts, isLoading: isLoadingContracts } = useFetchContractGraph();
	const { data: season10CombinePlayers = [], isLoading: isLoadingS10CombineStats } = useFetchCombinePlayerData();
	const { data: season10PlayerStats = [], isLoading: isLoadingS10PlayerStats } = useFetchSeason10PlayerData();

	console.info( contracts );

	React.useEffect( () => {
	}, [selectedData] );

    return {
		//tiers: contracts.tiers,
        playerStats: selectedData === "season10" ? season10PlayerStats : season10CombinePlayers,
		isLoading: isLoadingS10CombineStats && isLoadingS10PlayerStats && isLoadingContracts,
		selectedData, setSelectedData
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
