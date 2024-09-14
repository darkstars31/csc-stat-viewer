import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { TwitchStream } from "../models/twitch-types";
import { ProfileJson } from "../models/profile-types";
import { analytikillHttpClient } from "./httpClients";

export const fetchTwitchStreamData = async (usernames: string[]) =>
	await analytikillHttpClient.post(`/twitch/getTwitchUser`, 
	{
		twitchUsernames: usernames,
	})
	.then( response => response.data.data);

export const fetchUserProfile = (discordId?: string) =>
	analytikillHttpClient.get(`/profile?discordId=${discordId}`)
		.then( response => response.data)
		.catch(err => {
			console.log(err);
			return err;
		});

export function useFetchTwitchStreamData(usernames: string[]): UseQueryResult<TwitchStream[]> {
	return useQuery(["twitch", usernames], async () => await fetchTwitchStreamData(usernames), {
		staleTime: 1000 * 60 * 5,
	});
}

export function useFetchPlayerProfile(discordId?: string): UseQueryResult<ProfileJson> {
	return useQuery(["profile", discordId], () => fetchUserProfile(discordId), {
		enabled: !!discordId,
		staleTime: 1000 * 60 * 60,
	});
}
