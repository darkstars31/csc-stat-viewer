import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FaceitApiTypes } from "../models/faceit-api-types";

const faceitClientApiKey = '75acc11a-2205-4595-8c59-8adbbaf7a1cb';

const getData = async ( faceItId?: string ) => await fetch(`https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${faceItId}`,
    { 
        method: "GET", 
        headers: { 
            'content-type': 'text/csv;charset=UTF-8',
            'authorization': `Bearer ${faceitClientApiKey}`
        }})
    .then( async response => {
        return response.json();
    } );

const searchPlayers = async ( steamId?: string ) => await fetch(`https://open.faceit.com/data/v4/search/players?nickname=${steamId}&game=csgo&offset=0&limit=20`,
    { 
        method: "GET", 
        headers: { 
            'content-type': 'text/csv;charset=UTF-8',
            'authorization': `Bearer ${faceitClientApiKey}`
        }})
    .then( async response => {
        return response.json();
    } );

export function useFetchFaceitPlayerData( faceitId?: string ): UseQueryResult<FaceitApiTypes> {
    return useQuery(
        ["faceitSearchPlayer", faceitId ], 
        () => getData( faceitId ), 
        {
            staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
            enabled: Boolean(faceitId),
            onError: () => {},
        }
    );
}

export function useFetchSearchFaceitPlayers( player?: Player ): UseQueryResult<{ items: { player_id: string, nickname: string, games: { skill_level: number }[] }[]}> {
    return useQuery(
        ["faceitPlayerSearch", player?.steam64Id ], 
        () => searchPlayers( player?.steam64Id ), 
        {
            staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
            enabled: Boolean(player?.steam64Id),
            onError: () => {},
        }
    );
}