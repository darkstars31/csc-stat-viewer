import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FaceitApiTypes } from "../models/faceit-api-types";

const faceitClientApiKey = "75acc11a-2205-4595-8c59-8adbbaf7a1cb";

const getData = async (faceItId?: string) =>
	await fetch(`https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${faceItId}`, {
		method: "GET",
		headers: {
			"content-type": "text/csv;charset=UTF-8",
			authorization: `Bearer ${faceitClientApiKey}`,
		},
	}).then(async response => {
		return response.json();
	});

const searchPlayers = async (steamId?: string) =>
	await fetch(`https://open.faceit.com/data/v4/search/players?nickname=${steamId}&game=csgo&offset=0&limit=20`, {
		method: "GET",
		headers: {
			"content-type": "text/csv;charset=UTF-8",
			authorization: `Bearer ${faceitClientApiKey}`,
		},
	}).then(async response => {
		return response.json();
	});

const searchPlayersWithCache = async (steamId?: string, playerName?: string) =>
	await fetch(
		`https://tonysanti.com/prx/csc-stat-api/faceit/playerlookup?steamId=${steamId}&cscPlayerName=${playerName}`,
		{
			method: "GET",
			headers: {
				"content-type": "application/json",
			},
		},
	).then(async response => {
		return response.json();
	});

export function useFetchFaceitPlayerData(faceitId?: string): UseQueryResult<FaceitApiTypes> {
	return useQuery(["faceitSearchPlayer", faceitId], () => getData(faceitId), {
		staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
		enabled: Boolean(faceitId),
		onError: () => {},
	});
}

export function useFetchSearchFaceitPlayers(
	player?: Player,
	isDisabled?: boolean,
): UseQueryResult<{
	items: {
		player_id: string;
		nickname: string;
		games: { name: string; skill_level: number }[];
	}[];
}> {
	return useQuery(["faceitPlayerSearch", player?.steam64Id], () => searchPlayers(player?.steam64Id), {
		staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
		enabled: !!player?.steam64Id,
		onError: e => {
			console.info(e);
		},
	});
}

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
