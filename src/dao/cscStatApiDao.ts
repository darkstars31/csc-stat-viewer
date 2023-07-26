import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { TwitchStream } from "../models/twitch-types";

export const fetchTwitchStreamData = (usernames: string[]) => 
    fetch( "https://tonysanti.com/prx/csc-stat-api/twitch/getTwitchUser", {
        method: "POST",
        body: JSON.stringify({ 
            twitchUsernames: usernames
        }),                                 
        headers: {
            "Content-Type": "application/json",
        }
    }).then( async res => {
        const json = await res.json();
        return json.data;
    }
);

export function useFetchTwitchStreamData (usernames: string[]): UseQueryResult<TwitchStream[]> {
    return useQuery( 
        ["twitch", usernames], 
        () => fetchTwitchStreamData(usernames), {
            staleTime: 1000 * 60 * 5,
        }
    );
}