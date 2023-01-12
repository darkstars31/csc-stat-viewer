import * as React from "react";
// import { Player } from "./models";
import { useFetchCombinePlayerData } from "./dao/combinePlayerDao";

const useDataContextProvider = () => {
	const { data: season10CombinePlayers = [], isLoading } = useFetchCombinePlayerData();

	React.useEffect( () => {
	}, [season10CombinePlayers] );

    return {
        season10CombinePlayers,
		isLoading,
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
