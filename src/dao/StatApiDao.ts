import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { TwitchStream } from "../models/twitch-types";
import { Profile } from "../models/profile-types";

export const fetchTwitchStreamData = (usernames: string[]) =>
	fetch("https://tonysanti.com/prx/csc-stat-api/twitch/getTwitchUser", {
		method: "POST",
		body: JSON.stringify({
			twitchUsernames: usernames,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async res => {
		const json = await res.json();
		return json.data;
	});

export const fetchUserProfile = (discordId?: string) =>
	fetch(`https://tonysanti.com/prx/csc-stat-api/profile?discordId=${discordId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then(async res => {
			return await res.json();
		})
		.catch(err => {
			console.log(err);
			return err;
		});

export function useFetchTwitchStreamData(usernames: string[]): UseQueryResult<TwitchStream[]> {
	return useQuery(["twitch", usernames], () => fetchTwitchStreamData(usernames), {
		staleTime: 1000 * 60 * 5,
	});
}

export function useFetchPlayerProfile(discordId?: string): UseQueryResult<Profile> {
	return useQuery(["profile", discordId], () => fetchUserProfile(discordId), {
		enabled: !!discordId,
		staleTime: 1000 * 60 * 60,
	});
}
