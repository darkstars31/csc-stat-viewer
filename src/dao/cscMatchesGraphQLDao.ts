import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Match } from "../models/matches-types";
import { Team } from "../models/franchise-types";
import { appConfig } from "../dataConfig";

// CSC Removed daysAgo on the query for this graph
// const calculateDaysSinceSeasonStart = () => {
//   const oneDay = 1000 *60*60*24;
//   const currentDate = new Date();
//   const startOfSeasonDate = new Date(2023,5,2);
//   const diff = currentDate.getTime() - startOfSeasonDate.getTime();
//   const diffInDays = Math.round( diff / oneDay);
//   return diffInDays;
// }

export const fetchMatchesGraph = async (teamId?: string, season: number = 11) => await fetch(appConfig.endpoints.cscGraphQL.core,
	{
		method: "POST",
		body: JSON.stringify({
			"operationName": "",
			"query": `query matches ( $teamId: String!, $season: Int!) {
                    matches (teamId: $teamId, season: $season) {
                        id
                        scheduledDate
                        completedAt
                        demoUrl
						lobby {
							id
							mapBans {
							  map
							  team {
								id
								name
							  }
							}
						  }
                        matchDay {
                          number
                        }
                        home {
                          franchise {
                            prefix
                            name
                            logo {
                              url
                            }
                          }
                          name
                        }
                        away {
                          franchise {
                            prefix
                            name
                            logo {
                              url
                            }
                          }
                          name
                        }
                        dathostServer {
                          connectString
                          port
                          gotv
                        }
                        stats {
                          homeScore
                          awayScore
                          mapName
                          mapNumber
                          winner {
                            name
                          }
                        }
                      }
                }`
			,
			"variables": {
				"teamId": teamId,
				"season": season,
			}
		}),
		headers: {
			'content-type': "application/json"
		}
	})
	.then(async response => {
		return response.json().then(json => {
			return json.data.matches;
		});
	});

export const fetchIndividualMatchInfoGraph = async (matchId: string) => await fetch(appConfig.endpoints.cscGraphQL.stats,
	{
		method: "POST",
		body: JSON.stringify({
			"operationName": "ScoreboardQuery",
			"query": `query ScoreboardQuery($matchId: String!) {
                  findManyMatch(where: {matchId: {startsWith: $matchId}}, orderBy: {matchId: asc}) {
                    mapName
                    matchId
                    tier
                    teamStats {
                      name
                      score
                    }
                    matchStats(where: {side: {equals: 4}}) {
                      name
                      kills
                      assists
                      deaths
                      hs
                      adr
                      kast
                      impactRating
                      rating
                      teamClanName
                      utilDmg
                      ef
                      cl_1
                      cl_2
                      cl_3
                      cl_4
                      cl_5
                    }
                    rounds {
                      winnerClanName
                      winnerENUM
                      endDueToBombEvent
                      winTeamDmg
                      defuser
                    }
                  }
                }`
			,
			"variables": {
				"matchId": matchId,
			}
		}),
		headers: {
			'content-type': "application/json"
		}
	})
	.then(async response => {
		return response.json().then(json => {
			return json.data.findManyMatch;
		});
	});


export function useFetchMatchesGraph(season?: number, teamId?: string): UseQueryResult<Match[]> {
	return useQuery(
		["matches-graph", teamId],
		() => fetchMatchesGraph(teamId, season), {
		enabled: Boolean(teamId),
		staleTime: 1000 * 60 * 60 // 1 second * 60 * 60 = 1 hour
	});
}

export function useFetchMultipleTeamsMatchesGraph(tier: string, teams: Team[]): UseQueryResult<unknown, unknown>[] {
	const queries = teams.map(team =>
	({
		queryKey: ["matches-graph", team.id],
		queryFn: () => fetchMatchesGraph(team.id),
	}));
	return useQueries({ queries });
}

export function useFetchMultipleMatchInfoGraph(matchIds: string[]): UseQueryResult<unknown, unknown>[] {
	const queries = matchIds.map(matchId =>
	({
		queryKey: ["match-info-graph", matchId],
		queryFn: () => fetchIndividualMatchInfoGraph(matchId),
	}));
	return useQueries({ queries });
}