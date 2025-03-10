import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";
import { Player } from "../models/player";
import { CscPlayerMatchHistoryQuery } from "../models/csc-player-match-history-types";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async (filter: Record<string, any>) =>
	await fetch(appConfig.endpoints.cscGraphQL.stats, {
		method: "POST",
		body: JSON.stringify({
			operationName: "getMatchesHistoryByPlayerName",
			query: `query getMatchesHistoryByPlayerName($whereFilter: MatchWhereInput!) {
                findManyMatch(where: $whereFilter) {
                    matchId
                    mapName
                    totalRounds
                    matchType
                    createdAt
                    tier
                    teamStats {
                        name
                    }
                    matchStats (where: { side: { equals: 4}}) {
                        name
                        kills
                        assists
                        deaths
                        damage
                        adr
                        hs
                        FAss
                        teamENUM
                        teamClanName
                        rating
                        RF
                        RA
                        utilDmg
                        ok
                        ol
                        cl_1
                        cl_2
                        cl_3
                        cl_4
                        cl_5
                    }
                }
            }`,
			variables: filter,
		}),
		headers: {
			"Content-Type": "application/json",
			// 'Authorization': put your CSC JWT HERE
		},
	}).then(async response => {
		return response.json().then((json: CscPlayerMatchHistoryQuery) => {
			return json.data.findManyMatch;
		});
	});

export function useCscPlayerMatchHistoryGraph(
	player: Player,
	season: number
): UseQueryResult<CscPlayerMatchHistoryQuery["data"]["findManyMatch"]> {
	return useQuery({
        queryKey: [`cscplayermatchhistory-graph`, player.name],

        queryFn: () =>
			fetchGraph({
				whereFilter: {
					matchStats: {
						some: {
							name: {
								equals: player.name,
							},
						},
					},
					season: {
						equals: season, // Current Season
					},
				},
			}),

        staleTime: OneHour
    });
}

export function useCscTeamMatchHistoryGraph(
	teamname: string,
	matchIds: string[],
	season: number,
): UseQueryResult<CscPlayerMatchHistoryQuery["data"]["findManyMatch"]> {
	return useQuery({
        queryKey: [`cscteammatchhistory-graph`,teamname],

        queryFn: () =>
			fetchGraph({
				whereFilter: {
					matchId: {
						in: matchIds,
					},
					season: {
						equals: season,
					},
				},
			}),

        staleTime: OneHour
    });
}
