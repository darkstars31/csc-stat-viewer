import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ContractsQuery } from "../models/contract-types";

const fetchContractsGraph = async () => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "",
            "query": `query contracts {
                players {
                    name
                    faceitName
                    mmr
                    avatarUrl
                    contractDuration
                    tier {
                        name
                    }
                    team {
                        name
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

type CscPlayerData = {};

export function useFetchContractGraph(): UseQueryResult<CscPlayerData> {
    return useQuery({ queryKey: ["contracts-graph"], queryFn: fetchContractsGraph, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}
