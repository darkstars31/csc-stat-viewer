import * as React from "react";
import { useFetchContractGraph } from "./dao/contracts";
import { useFetchSeasonData } from "./dao/seasonPlayerStatsDao";
import { dataConfiguration } from "./dataConfig";

const useDataContextProvider = () => {
	const [ selectedDataOption, setSelectedDataOption ] = React.useState<string>(dataConfiguration[0].name);
	const dataConfig = dataConfiguration.find( item => selectedDataOption === item.name);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: contracts, isLoading: isLoadingContracts } = useFetchContractGraph();
	const { data: playerStats = [], isLoading: isLoadingPlayerStats } = useFetchSeasonData(dataConfig!);

	// TODO: Find a better place for this
	//const playerMmrList = season10PlayerStats.map( player => ({...player, mmr: contracts?.data.fas.find( (fa: { name: string, mmr: number}) => fa.name === player.Name)}))
	//console.info(playerMmrList)

	React.useEffect( () => {
	}, [selectedDataOption] );

    return {
		//tiers: contracts.tiers,
        playerStats: playerStats,
		isLoading: isLoadingPlayerStats,
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
