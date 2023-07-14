import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const faceitClientApiKey = '75acc11a-2205-4595-8c59-8adbbaf7a1cb';

const getData = async ( faceitName?: string ) => await fetch(`https://open.faceit.com/data/v4/players?nickname=${faceitName}`,
    { 
        method: "GET", 
        headers: { 
            'content-type': 'text/csv;charset=UTF-8',
            'authorization': `Bearer ${faceitClientApiKey}`
        }})
    .then( async response => {
        return response.json();
    } );

export function useFetchFaceitPlayerData( player?: Player ): UseQueryResult<any[]> {
    return useQuery(
        ["faceitPlayerData", player?.faceitName ], 
        () => getData( player?.faceitName ), 
        {
            staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
            enabled: Boolean(player?.faceitName),
            onError: () => {},
        }
    );
}