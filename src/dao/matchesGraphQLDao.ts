import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Match } from "../models/matches-types";

const calculateDaysSinceSeasonStart = () => {
  const oneDay = 1000 *60*60*24;
  const currentDate = new Date();
  const startOfSeasonDate = new Date(2023,5);
  const diff = currentDate.getTime() - startOfSeasonDate.getTime();
  const diffInDays = Math.round( diff/ oneDay);
  console.info( diff, diffInDays);
  return diffInDays;
}

const fetchMatchesGraph = async ( teamId?: string) => await fetch(`https://core.csconfederation.com/graphql`,
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
                    "teamId": teamId,
                    "daysAgo": calculateDaysSinceSeasonStart()
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