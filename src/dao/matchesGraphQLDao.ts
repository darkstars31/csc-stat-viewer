import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Match } from "../models/matches-types";

const fetchMatchesGraph = async ( teamId?: string) => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
                "operationName": "",
                "query": `query matches ( $teamId: String!) {
                    matches (teamId: $teamId, daysAgo: 7) {
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
                            logo {
                              url
                            }
                          }
                          name
                        }
                        away {
                          franchise {
                            prefix
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
                    "teamId": teamId
                }      
            })     
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