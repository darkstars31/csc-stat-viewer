import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscPlayersQuery } from "../models";
import { cscPlayerGraphSnapShot } from "./snapshots/cscPlayerGraph";

const fetchGraph = async () => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "",
            "query": `query CscPlayers {
                players {
                    steam64Id
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
                        franchise {
                            name,
                            prefix
                        }
                    }
                    type
                }
            }`
            ,
            "variables": {}      
        })
    })
    .then( async response => {
        return response.json();
    } );

export function useCscPlayersGraph(): UseQueryResult<CscPlayersQuery> {
    return useQuery({ 
        queryKey: ["cscplayers-graph"], 
        queryFn: fetchGraph, 
        staleTime: 1000 * 60 * 60,
        placeholderData: cscPlayerGraphSnapShot,
    }); // 1 second * 60 * 60 = 1 hour
}
