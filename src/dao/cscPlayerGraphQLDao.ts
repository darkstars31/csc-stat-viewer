import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscPlayer, CscPlayersQuery } from "../models";
import { PlayerTypes } from "../common/utils/player-utils";
import { appConfig } from "../dataConfig";

const OneHour = 1000 * 60 * 60;

const cachedEnpointPath = "/CscPlayers";

const fetchGraph = async (playerType: keyof typeof PlayerTypes) =>
	await fetch(appConfig.endpoints.cscGraphQL.core, {
		method: "POST",
		body: JSON.stringify({
			operationName: "",
			query: `query CscPlayers ( $playerType: PlayerTypes) {
                players ( type: $playerType ) {
                    id
                    steam64Id
                    name
                    discordId
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
            }`,
			variables: {
				playerType: playerType,
			},
		}),
		headers: {
			"Content-Type": "application/json",
			// 'Authorization': put your CSC JWT HERE
		},
	}).then(async response => {
		return response.json().then((json: CscPlayersQuery) => {
			return json.data.players;
		});
	});

const fetchCachedGraph = async (playerType: keyof typeof PlayerTypes) =>
	await fetch(
		`${appConfig.endpoints.cloudfrontCache}${cachedEnpointPath}/playerType_${playerType}.json?q=${new Date().getTime()}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		},
	)
		.then(async response => response.json().then((json: CscPlayersQuery) => json.data.players))
		.catch(() => {
			fetchGraph(playerType);
		});

export function useCscPlayersGraph(
	playerType: keyof typeof PlayerTypes,
	options?: Record<string, unknown>,
): UseQueryResult<CscPlayer[]> {
	return useQuery(
		[`cscplayers-${playerType}-graph`],
		() => (options?.skipCache ? fetchGraph(playerType) : fetchCachedGraph(playerType)),
		{
			staleTime: OneHour,
		},
	);
}
