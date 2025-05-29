import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { analytikillHttpClient } from "./httpClients";

const searchPlayersWithCache = async (steamId?: string, playerName?: string) =>
	await analytikillHttpClient.get(`/faceit/playerlookup?steamId=${steamId}&cscPlayerName=${playerName}`)
	.then( response => response.data);

export function useFetchFaceItPlayerWithCache(
	player?: Player,
	isDisabled?: boolean,
): UseQueryResult<{
	id: number;
	faceitIdentifier: string;
	updatedAt: string;
	rank: number;
	highestRank: number;
	faceitName: string;
	elo: number;
}> {
	return useQuery({
        queryKey: ["faceitPlayerSearch", player?.steam64Id],
        queryFn: () => searchPlayersWithCache(player?.steam64Id, player?.name),
        staleTime: 1000 * 60 * 60 * 6,
        enabled: !!player?.steam64Id,
    });
}

export type HubData = {
	 player_id: string, 
	 nickname: string, 
	 stats: Record<string,string> 
}

export function useFetchFaceItHubStats(): UseQueryResult<{ Upper: HubData[], Lower: HubData[]}> {
	return useQuery({
        queryKey: ["fapl-stats"],
        queryFn: () => analytikillHttpClient.get("/faceit/fapl/stats"),

        // 1 second * 60 * 60 = 1 hour
        staleTime: 1000 * 60 * 60
    });
}
