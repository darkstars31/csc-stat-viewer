import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";

const OneHour = 1000 * 60 * 60;

const fetchPlayerGraph = async (steamId: string | undefined, season?: number) =>
	await fetch(appConfig.endpoints.cscGraphQL.stats, {
		method: "POST",
		body: JSON.stringify({
			operationName: "ProfileTrendGraph",
			query: `query ProfileTrendGraph($steamId: BigInt!, $season: Int!) {
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
                        damage
                        adr
                        deaths
                        rounds
                        assists
                        KR
                        ef
                        kast
                        utilDmg
                        TRating
                        ctRating
                        match {
                            matchDay
                            matchId
                            __typename
                        }
                        __typename
                    }
                }`,
			variables: {
				season: season,
				steamId: steamId,
			},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async response => {
		return response.json().then((json: { data: { findManyPlayerMatchStats: any } }) => {
			return json.data.findManyPlayerMatchStats;
		});
	});

interface Match {
	matchDay: string;
	matchId: number;
	__typename: string;
}

interface PlayerMatchStats {
	rating: number;
	impactRating: number;
	damage: number;
	adr: number;
	ef: number;
	KR: number;
	kast: number;
	utilDmg: number;
	rounds: number;
	assists: number;
	deaths: number;
	TRating: number;
	ctRating: number;
	match: Match;
	__typename: string;
}

export function useCscStatsProfileTrendGraph(
	steamId: string | undefined,
	season?: number,
): UseQueryResult<PlayerMatchStats[] | undefined> {
	return useQuery([`cscstats-${steamId}-trend-graph`], () => fetchPlayerGraph(steamId, season), {
		enabled: Boolean(steamId),
		staleTime: OneHour,
	});
}
