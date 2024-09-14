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
	return useQuery(
		["faceitPlayerSearch", player?.steam64Id],
		() => searchPlayersWithCache(player?.steam64Id, player?.name),
		{
			staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
			enabled: !!player?.steam64Id,
			onError: e => {
				console.info(e);
			},
		},
	);
}
