import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async (steamId: string | undefined, season?: number) =>
	await fetch(appConfig.endpoints.cscGraphQL.stats, {
		method: "POST",
		body: JSON.stringify({
			operationName: "PlayerProfile",
			query: `query PlayerProfile($steamId: String!, $season: Int!) {
                playerSummary(steamId: $steamId, season: $season) {
                  ctRating
                  TRating
                }
              }`,
			variables: {
				season: season,
				steamId: steamId,
			},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async response => {
		return response.json().then((json: { data: { playerSummary: any } }) => {
			return json.data.playerSummary;
		});
	});

export function useCscStatsProfileGraph(
	steamId: string | undefined,
	season?: number,
): UseQueryResult<{ ctRating: number; tRating: number } | undefined> {
	return useQuery({
        queryKey: [`cscstats-${steamId}-graph`],
        queryFn: () => fetchGraph(steamId, season),
        enabled: Boolean(steamId),
        staleTime: OneHour
    });
}
