import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FranchiseRequest } from "../models/franchise-types";

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
                        agm {
                            name
                        }
                        teams {
                            name
                            tier { 
                                name
                                mmrCap
                            }
                            players {
                                name
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
        return response.json();
    } );

export function useFetchFranchisesGraph(): UseQueryResult<FranchiseRequest> {
    return useQuery({ queryKey: ["franchises-graph"], queryFn: fetchFranchisesGraph, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}