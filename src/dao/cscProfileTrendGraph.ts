import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";

const OneHour = 1000 * 60 * 60;

const fetchPlayerGraph = async ( steamId: string | undefined, season?: number ) => await fetch(appConfig.endpoints.cscGraphQL.stats,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "ProfileTrendGraph",
                "query": `query ProfileTrendGraph($steamId: BigInt!, $season: Int!) {
                    findManyPlayerMatchStats(
                        where: {
                            steamID: {
                                equals: $steamId
                            }, 
                            match: {
                                season: {
                                    equals: $season
                                }
                            }, 
                            side: {
                                equals: 4
                            }
                        }
                        orderBy: {
                            matchId: asc
                        }
                    ) {
                        rating
                        impactRating
                        adr
                        ef
                        kast
                        utilDmg
                        match {
                            matchDay
                            __typename
                        }
                        __typename
                    }
                }`,
            "variables": {
                "season": season,
                "steamId": steamId,
            }      
        }),
        headers: {
            'Content-Type': "application/json"
        }
    })
    .then( async response => {
        return response.json().then( (json: { data: { findManyPlayerMatchStats: any}}) => {
            return json.data.findManyPlayerMatchStats;
        });
    })

    interface Match {
        matchDay: string;
        __typename: string;
        }
      
    interface PlayerMatchStats {
    rating: number;
    impactRating: number;
    adr: number;
    ef: number;
    kast: number;
    utilDmg: number;
    match: Match;
    __typename: string;
        }

export function useCscStatsProfileTrendGraph(steamId: string | undefined, season?: number): UseQueryResult<PlayerMatchStats[] | undefined> {
    return useQuery(
        [`cscstats-${steamId}-trend-graph`], 
        () => fetchPlayerGraph(steamId, season),
        {
        enabled: Boolean(steamId),
        staleTime: OneHour,
        }
    );
}