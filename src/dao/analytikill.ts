import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { analytikillHttpClient } from "./httpClients";
import { ExtendedStats } from "../models/extended-stats";
import { ProfileJson } from "../models/profile-types";
import { Post } from "../pages/articles/posts";

const getExtendedStats = async ( season?: number) =>
	await analytikillHttpClient.get(`/analytikill/extendedStats?season=${season}`)
		.then( response => response.data);

const getExtendedMatchStats = async (matchId?: string, matchType?: string) =>
	await analytikillHttpClient.get(`/analytikill/extendedMatchStats?matchId=${matchId}&matchType=${matchType}`)
		.then( response => response.data);

const getPlayerReputation = async ( discordId?: string) =>
	await analytikillHttpClient.get(`/analytikill/plusRep?discordId=${discordId}`)
		.then( response =>  response.data);

export function useAnalytikillExtendedStats( season?: number): UseQueryResult<ExtendedStats> {
	return useQuery({
        queryKey: ["analytikillExtendedStats"],
        queryFn: () => getExtendedStats( season ),

        // 1 second * 60 * 60 * 24 = 24 hour
        staleTime: 1000 * 60 * 60,
        enabled: Boolean(season)
    });
}

export function useAnalytikillExtendedMatchStats( matchId: string, matchType: string, shouldFetch = false): UseQueryResult<Record<string,any>> {
	return useQuery({
        queryKey: ["analytikillExtendedMatchStats", matchId],
        queryFn: () => getExtendedMatchStats( matchId, matchType ),

        // 7 days
        staleTime: 1000 * 60 * 60 * 24 * 7,
        enabled: shouldFetch,
    });
}

export function useFetchReputation( discordId?: string): UseQueryResult<{ repped: number, plusRep: Record<string, string>}> {
	return useQuery({
        queryKey: ["Reputation", discordId],
        queryFn: () => getPlayerReputation( discordId ),

        // 1 second * 60 * 60 * 1 = 1 hour
        staleTime: 1000 * 60 * 60 * 1,
        enabled: Boolean(discordId),
    });
}

export function useFetchPlayerProfile( discordId?: string ): UseQueryResult<ProfileJson> {
	return useQuery({
        queryKey: ["PlayerProfile", discordId],

        queryFn: async () => 
            await analytikillHttpClient.get(`/profile?discordId=${discordId}`)
                .then( response => response.data ),

        // 1 second * 60 * 60 * 1 = 1 hour
        staleTime: 1000 * 60 * 60 * 24,
    });
}

export function useFetchArticles(): UseQueryResult<Post[]> {
	return useQuery({
        queryKey: ["Posts"],

        queryFn: async () => 
            await analytikillHttpClient.get(`/analytikill/articles`)
                .then( response => response.data ),

        // 1 second * 60 * 60 * 1 = 1 hour
        staleTime: 1000 * 60 * 60 * 24,
    });
}

export function useFetchArticle( id: string ): UseQueryResult<Post[]> {
	return useQuery({
        queryKey: ["Post", id],

        queryFn: async () => 
            await analytikillHttpClient.get(`/analytikill/articles/${id}`)
                .then( response => response.data ),

        // 1 second * 60 * 60 * 1 = 1 hour
        staleTime: 1000 * 60 * 60 * 24,
    });
}

export function useMutateArticle( payload: any ) {
	return useMutation({ mutationFn: async () => 
		await analytikillHttpClient.post(`/analytikill/articles`,
			payload
		)
	});
}


