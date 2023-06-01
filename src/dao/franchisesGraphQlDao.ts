import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Franchise } from "../models/franchise-types";

const fetchFranchisesGraph = async () => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
                "operationName": "",
                "query": `query franchises {
                    franchises(active: true) {
                        name
                        prefix
                        logo {
                            name
                        }
                        gm {
                            name
                        }
                        agms {
                            name
                        }
                        teams {
                            name
                            captain {
                                steam64Id
                            }
                            tier { 
                                name
                                mmrCap
                            }
                            players {
                                name
                                discordId
                                steam64Id
                                mmr
                            }
                        }
                    }
                }`
                ,
                "variables": {}      
            })     
        })
    .then( async response => {
        return response.json().then( json => {
            return json.data.franchises;
        });
    } );

export function useFetchFranchisesGraph(): UseQueryResult<Franchise[]> {
    return useQuery({ queryKey: ["franchises-graph"], queryFn: fetchFranchisesGraph, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}