import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscStats, CscStatsQuery } from "../models/csc-stats-types";
import { appConfig } from "../dataConfig";
import { analytikillHttpClient } from "./httpClients";

const cachedUrl = `/csc/cached-tier-season-stats`;

export type CscTiers = "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async (tier: CscTiers, season?: number, matchType?: string) =>
	await fetch(appConfig.endpoints.cscGraphQL.stats, {
		method: "POST",
		body: JSON.stringify({
			operationName: "getTierSeasonStats",
			query: `query getTierSeasonStats($tier: String!, $season: Int!, $matchType: String!) {
                tierSeasonStats(tier: $tier, season: $season, matchType: $matchType) {
                    adp
                    adr
                    assists
                    awpR
                    cl_1
                    cl_2
                    cl_3
                    cl_4
                    cl_5
                    clutchR 
                    consistency 
                    deaths
                    ef 
                    fAssists 
                    fiveK
                    form
                    fourK
                    gameCount
                    hs
                    impact
                    kast
                    kills
                    kr
                    multiR
                    name
                    odaR
                    odr
                    peak
                    pit
                    rating
                    ctRating
                    TRating
                    rounds
                    saveRate
                    savesR
                    suppR
                    suppXR
                    Team: team
                    threeK
                    tradesR
                    tRatio
                    twoK
                    util
                    utilDmg
                }
            }`,
			variables: {
				tier: tier,
				season: season,
				matchType: matchType,
			},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async response => {
		return response.json().then((json: CscStatsQuery) => {
			return json.data?.tierSeasonStats;
		});
	});

const fetchCachedGraph = async (tier: CscTiers, season?: number, matchType?: string) =>
	await fetch(`${appConfig.endpoints.analytikill}${cachedUrl}?season=${season}&tier=${tier}&matchType=${matchType}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	})
		.then(async response => response.json().then((json: CscStatsQuery) => json.data?.tierSeasonStats))
		.catch(() => {
			fetchGraph(tier, season, matchType);
		});

export function useCscStatsGraph(tier: CscTiers, season?: number, matchType?: string): UseQueryResult<CscStats[]> {
	return useQuery([`cscstats-graph`, tier, season, matchType], () => fetchCachedGraph(tier, season, matchType), {
        enabled: Boolean(season),
		staleTime: OneHour,
	});
}

type StatsCache = { 
    lastUpdate: string, 
    data: {
        Recruit: CscStats[],
        Prospect: CscStats[],
        Contender: CscStats[],
        Challenger: CscStats[],
        Elite: CscStats[],
        Premier: CscStats[],
    }
}

export function useCscStatsCache(season?: number, matchType?: string, options?: Record<string, unknown>): UseQueryResult<StatsCache> {
	return useQuery([`cscstats-cache`, season, matchType], 
        async () => await analytikillHttpClient.get(`/csc/cached-stats?season=${season}&matchType=${matchType}`)
        .then( response => response.data ),
    {
        enabled: options?.enabled as boolean ?? true,
		staleTime: OneHour,
	});
}

export function useMultipleCscStatsGraph(tiers: string[], season?: number, matchType?: string): UseQueryResult<void | CscStats[], unknown>[] {
	const queries = tiers.map(tier => ({
		queryKey: ["cscstats-graph", tier, season, matchType],
		queryFn: () => fetchCachedGraph(tier as CscTiers, season, matchType)
            .catch( () => { 
                console.warn("Error Fetching Cached Graph for all tiers.");
                return []; 
                }),
	}));
	return useQueries({ queries });
}
