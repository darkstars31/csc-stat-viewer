import * as React from "react";
import { useCscNameAndAvatar, useCscPlayersGraph } from "./dao/cscPlayerGraphQLDao";
import { useFetchSeasonData } from "./dao/seasonPlayerStatsDao";
import { dataConfiguration } from "./dataConfig";
import { Player } from "./models/player";
import { useKonamiCode } from "./common/hooks/konami";



const useDataContextProvider = () => {
	const konamiFeatureFlag = useKonamiCode();
	const [ selectedDataOption, setSelectedDataOption ] = React.useState<string>(dataConfiguration[0].name);
	const dataConfig = dataConfiguration.find( item => selectedDataOption === item.name);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: cscNameAndAvatar, isLoading: isLoadingCscNameAndAvatar } = useCscNameAndAvatar();
	const { data: cscPlayersResponse = null, isLoading: isLoadingCscPlayers } = useCscPlayersGraph(cscNameAndAvatar);
	const { data: playerStats = [], isLoading: isLoadingPlayerStats } = useFetchSeasonData(dataConfig!);

	const cscPlayers = (cscPlayersResponse ?? cscNameAndAvatar)?.data?.players ?? [];
	const players: Player[] = cscPlayers?.map( cscPlayer => ({ ...cscPlayer, stats: playerStats.find( ps => (ps.Steam === "sid".concat(cscPlayer?.steam64Id ?? 0) && ps.Tier === cscPlayer.tier?.name)) ?? null}));

	React.useEffect( () => {
	}, [selectedDataOption] );

    return {
        players: players,
		isLoading: isLoadingCscNameAndAvatar || isLoadingPlayerStats,
		loading: {
			isLoadingCscPlayers,
			isLoadingPlayerStats,
		},
		selectedDataOption, setSelectedDataOption,
		featureFlags:{
			konami: konamiFeatureFlag,
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
