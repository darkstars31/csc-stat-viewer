
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { MatchHistory, MatchHistoryPlayerStat } from "../models/match-history-types";

const getPlayerMatchHistoryData = async ( steamId?: string ) => await fetch(`https://tonysanti.com/prx/csc-stat-api/csc/player-match-history?steamId=${steamId}`,
    { 
        method: "GET", 
        headers: { 
            'content-type': 'application/json',
            
        }})
    .then( async response => {
        return response.json();
    } );

const getIndividualMatchHistory = async ( matchId?: string ) => await fetch(`https://tonysanti.com/prx/csc-stat-api/csc/match-history?matchId=${matchId}`,
    { 
        method: "GET", 
        headers: { 
            'content-type': 'application/json',
            
        }})
    .then( async response => {
        return response.json();
    } );

export function useAnalytikillPlayerMatchHistory( steamId?: string ): UseQueryResult<MatchHistoryPlayerStat[]> {
    return useQuery(
        ["analytikillPlayerMatchHistory", steamId ], 
        () => getPlayerMatchHistoryData( steamId ), 
        {
            staleTime: 1000 * 60 * 60 * 24, // 1 second * 60 * 60 * 24 = 24 hour
            enabled: Boolean(steamId),
            onError: () => {},
        }
    );
}

export function useAnalytikillIndividualMatchHistory( matchId?: string ): UseQueryResult<MatchHistory> {
    return useQuery(
        ["analytikillIndividualMatchHistory", matchId ], 
        () => getIndividualMatchHistory( matchId ), 
        {
            staleTime: 1000 * 60 * 60 * 24, // 1 second * 60 * 60 * 24 = 24 hour
            enabled: Boolean(matchId),
            onError: () => {},
        }
    );
}