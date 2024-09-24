import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { analytikillHttpClient } from "./httpClients";
import { ExtendedStats } from "../models/extended-stats";
import { ProfileJson } from "../models/profile-types";

const getExtendedStats = async () =>
	await analytikillHttpClient.get(`/analytikill/extendedStats`)
		.then( response => response.data);

const getExtendedMatchStats = async (matchId?: string) =>
	await analytikillHttpClient.get(`/analytikill/extendedMatchStats?matchId=${matchId}`)
		.then( response => response.data);

const getPlayerReputation = async ( discordId?: string) =>
	await analytikillHttpClient.get(`/analytikill/plusRep?discordId=${discordId}`)
		.then( response =>  response.data);

export function useAnalytikillExtendedStats(): UseQueryResult<ExtendedStats> {
	return useQuery(["analytikillExtendedStats"], () => getExtendedStats(), {
		staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 * 24 = 24 hour
		onError: () => {},
	});
}

export function useAnalytikillExtendedMatchStats( matchId: string, shouldFetch = false): UseQueryResult<Record<string,any>> {
	return useQuery(["analytikillExtendedMatchStats", matchId], () => getExtendedMatchStats( matchId ), {
		staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
		enabled: shouldFetch,
		onError: () => {},
	});
}

export function useFetchReputation( discordId?: string): UseQueryResult<{ repped: number, plusRep: Record<string, string>}> {
	return useQuery(["Reputation", discordId], () => getPlayerReputation( discordId ), {
		staleTime: 1000 * 60 * 60 * 1, // 1 second * 60 * 60 * 1 = 1 hour
		enabled: Boolean(discordId),
		onError: () => {},
	});
}

export function useFetchPlayerProfile( discordId?: string ): UseQueryResult<ProfileJson> {
	return useQuery(["PlayerProfile", discordId], async () => 
		await analytikillHttpClient.get(`/profile?discordId=${discordId}`)
			.then( response => response.data ), 
	{
		staleTime: 1000 * 60 * 60 * 24, // 1 second * 60 * 60 * 1 = 1 hour
		onError: () => {},
	});
}

export function useFetchArticles() {
	return useQuery(["Posts"], async () => 
		await analytikillHttpClient.get(`/analytikill/articles`)
			.then( response => response.data ), 
	{
		staleTime: 1000 * 60 * 60 * 24, // 1 second * 60 * 60 * 1 = 1 hour
		onError: () => {},
	});
}

export function useFetchArticle( id: string ) {
	return useQuery(["Post", id], async () => 
		await analytikillHttpClient.get(`/analytikill/articles/${id}`)
			.then( response => response.data ), 
	{
		staleTime: 1000 * 60 * 60 * 24, // 1 second * 60 * 60 * 1 = 1 hour
		onError: () => {},
	});
}

export function useMutateArticle( payload: any ) {
	return useMutation({ mutationFn: async () => 
		await analytikillHttpClient.post(`/analytikill/articles`,
			payload
		)
	});
}


