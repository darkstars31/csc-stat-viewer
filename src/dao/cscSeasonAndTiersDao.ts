import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";
import { CscLatestSeason } from "../models/csc-season-tiers-types";

const OneDay = 1000 * 60 * 60 * 24;

const fetchGraph = async () => await fetch(appConfig.endpoints.cscGraphQL.core,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "LatestActiveSeason",
            "query": `query LatestActiveSeason {
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
            "variables": {}      
        }),
        headers: {
            'Content-Type': "application/json",
        }
    })
    .then( async response => {
        return response.json().then( (json: CscLatestSeason) => {
            return json.data.latestActiveSeason;
        });
    } );


export function useCscSeasonAndTiersGraph(): UseQueryResult<CscLatestSeason['data']['latestActiveSeason']> {
    return useQuery( 
        [`cscSeasonAndTiers-graph`], 
        () =>  
            fetchGraph(),           
        {
            staleTime: OneDay,
        }
    );
}