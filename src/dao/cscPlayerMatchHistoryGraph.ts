import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig, dataConfiguration } from "../dataConfig";
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
): UseQueryResult<CscPlayerMatchHistoryQuery["data"]["findManyMatch"]> {
	return useQuery(
		[`cscplayermatchhistory-${player.name}-graph`],
		() =>
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
						equals: dataConfiguration[0].season, // Current Season
					},
				},
			}),
		{
			staleTime: OneHour,
		},
	);
}

export function useCscTeamMatchHistoryGraph(
	teamname: string,
	matchIds: string[],
): UseQueryResult<CscPlayerMatchHistoryQuery["data"]["findManyMatch"]> {
	return useQuery(
		[`cscteammatchhistory-${teamname}-graph`],
		() =>
			fetchGraph({
				whereFilter: {
					matchId: {
						in: matchIds,
					},
					season: {
						equals: dataConfiguration[0].season, // Current Season
					},
				},
			}),
		{
			staleTime: OneHour,
		},
	);
}
