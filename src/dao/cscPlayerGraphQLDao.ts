import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscPlayer, CscPlayersQuery } from "../models";

const url = `https://core.csconfederation.com/graphql`

type CscPlayerTypes = "SIGNED" | "FREE_AGENT" | "DRAFT_ELIGIBLE" | "PERMANENT_FREE_AGENT" | "SPECTATOR";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async ( playerType: CscPlayerTypes ) => await fetch(url,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "",
            "query": `query CscPlayers ( $playerType: PlayerTypes) {
                players ( type: $playerType ) {
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
            "variables": {
                "playerType": playerType
            }      
        })
    })
    .then( async response => {
        return response.json().then( (json: CscPlayersQuery) => {
            return json.data.players;
        });
    } );

export function useCscPlayersGraph( playerType: CscPlayerTypes ): UseQueryResult<CscPlayer[]> {
    return useQuery( 
        [`cscplayers-${playerType}-graph`], 
        () => fetchGraph( playerType ), 
        {
            staleTime: OneHour,
        }
    );
}
