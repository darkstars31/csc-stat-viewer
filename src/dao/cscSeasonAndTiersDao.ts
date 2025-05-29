import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";
import { CscLatestSeason } from "../models/csc-season-tiers-types";
import { analytikillHttpClient } from "./httpClients";

const OneDay = 1000 * 60 * 60 * 24;

const fetchGraph = async () =>
	await fetch(appConfig.endpoints.cscGraphQL.core, {
		method: "POST",
		body: JSON.stringify({
			operationName: "LatestActiveSeason",
			query: `query LatestActiveSeason {
                latestActiveSeason {
                    number
                    league {
                        leagueTiers {
                            tier {
                                name
                                mmrCap
                                color
                                mmrMin
                                mmrMax
                            }
                        }
                    }
                }
            }`,
			variables: {},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async response => {
		return response.json().then((json: CscLatestSeason) => {
			return json.data.latestActiveSeason;
		});
	});

export function useCscSeasonAndTiersGraph(): UseQueryResult<CscLatestSeason["data"]["latestActiveSeason"]> {
	return useQuery({
        queryKey: [`cscSeasonAndTiers-graph`],
        queryFn: () => fetchGraph(),
        staleTime: OneDay
    });
}

export function useCachedCscSeasonAndTiers(): UseQueryResult<CscLatestSeason["data"]["latestActiveSeason"] & { hasSeasonStarted: boolean, lastUpadated: string }> {
    return useQuery({
        queryKey: [`cscSeasonAndTiers-graph`],
        queryFn: async () => (await analytikillHttpClient.get(`/csc/cached-season-metadata`)).data,
        staleTime: OneDay,
    });
}
