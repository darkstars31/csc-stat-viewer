import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscPlayersQuery } from "../models";

const url = `https://core.csconfederation.com/graphql`

const fetchNameAndAvatar = async () => await fetch(url,
    { method: "POST", 
    body: JSON.stringify({
        "operationName": "",
        "query": `query CscPlayers {
            players {
                name
                avatarUrl
                steam64Id
                tier {
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

const fetchGraph = async () => await fetch(url,
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

export function useCscNameAndAvatar(): UseQueryResult<CscPlayersQuery> {
    return useQuery({ 
        queryKey: ["cscplayers-nameAndAvatar"], 
        queryFn: fetchNameAndAvatar, 
        staleTime: 1000 * 60 * 60,
    }); // 1 second * 60 * 60 = 1 hour
}

export function useCscPlayersGraph( placeholderData: CscPlayersQuery | undefined ): UseQueryResult<CscPlayersQuery> {
    return useQuery({ 
        queryKey: ["cscplayers-graph"], 
        queryFn: fetchGraph, 
        staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
        placeholderData: placeholderData,
    });
}
