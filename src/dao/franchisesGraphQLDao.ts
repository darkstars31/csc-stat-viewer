import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Franchise } from "../models/franchise-types";
import { appConfig } from "../dataConfig";

const fetchFranchisesGraph = async () =>
	await fetch(appConfig.endpoints.cscGraphQL.core, {
		method: "POST",
		body: JSON.stringify({
			operationName: "",
			query: `query franchises {
                    franchises(active: true) {
                        name
                        prefix
                        logo {
                            name
                        }
                        gm {
                            name
                        }
                        agms {
                            name
                        }
                        teams {
                            id
                            name
                            captain {
                                steam64Id
                            }
                            tier { 
                                name
                                mmrCap
                            }
                            players {
                                name
                                discordId
                                steam64Id
                                mmr
                            }
                        }
                    }
                }`,
			variables: {},
		}),
		headers: {
			"content-type": "application/json",
		},
	}).then(async response => {
		return response.json().then(json => {
			return json.data.franchises;
		});
	});

const fetchCachedGraph = async () =>
	await fetch(`${appConfig.endpoints.cloudfrontCache}/CscFranchises/CscFranchises.json?q=${new Date().getTime()}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	})
		.then(async response => response.json().then(json => json.data.franchises))
		.catch(() => {
			fetchFranchisesGraph();
		});

export function useFetchFranchisesGraph(): UseQueryResult<Franchise[]> {
	return useQuery({
		queryKey: ["franchises-graph"],
		queryFn: fetchCachedGraph,
		staleTime: 1000 * 60 * 60,
	}); // 1 second * 60 * 60 = 1 hour
}
