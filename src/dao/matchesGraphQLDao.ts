import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Match } from "../models/matches-types";
import { Team } from "../models/franchise-types";

const calculateDaysSinceSeasonStart = () => {
  const oneDay = 1000 *60*60*24;
  const currentDate = new Date();
  const startOfSeasonDate = new Date(2023,5,2);
  const diff = currentDate.getTime() - startOfSeasonDate.getTime();
  const diffInDays = Math.round( diff/ oneDay);
  return diffInDays;
}

export const fetchMatchesGraph = async ( teamId?: string) => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
                "operationName": "",
                "query": `query matches ( $teamId: String!, $daysAgo: Int) {
                    matches (teamId: $teamId, daysAgo: $daysAgo) {
                        id
                        scheduledDate
                        completedAt
                        demoUrl
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
                    "daysAgo": calculateDaysSinceSeasonStart()
                }      
            }),
            headers: {
                'content-type': "application/json"
            }   
        })
    .then( async response => {
        return response.json().then( json => {
            return json.data.matches;
        });
    } );

export function useFetchMatchesGraph( teamId?: string): UseQueryResult<Match[]> {
    return useQuery( 
        ["matches-graph", teamId], 
        () => fetchMatchesGraph( teamId ), {
            enabled: Boolean(teamId),
            staleTime: 1000 * 60 * 60 // 1 second * 60 * 60 = 1 hour
        });
}

export function useFetchMultipleTeamsMatchesGraph( tier: string, teams: Team[]): UseQueryResult<unknown,unknown>[] {
    const queries = teams.map( team => 
      ( { queryKey: ["matches-graph", team.id],
          queryFn: () => fetchMatchesGraph( team.id ),
      } ) );
    return useQueries( { queries } );
}