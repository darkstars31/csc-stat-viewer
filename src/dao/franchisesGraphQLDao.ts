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
                                id
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
		queryFn: fetchFranchisesGraph,
		staleTime: 1000 * 60 * 60,
	}); // 1 second * 60 * 60 = 1 hour
}

export type FranchiseManagement = {
    prefix: string;
    gm: {
        id: string;
    };
    agm: {
        id: string;
    }
    agms: {
        id: string;
    }[];
};

export const fetchFranchiseManagementIds = async (): Promise<FranchiseManagement[]> =>
    await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST",
        body: JSON.stringify({
            "operationName": "franchises",
            "query": `query franchises {
                franchises(active: true) {
                    prefix
                    gm {
                        id
                    }
                    agm {
                        id
                    }
                    agms {
                        id
                    }
                }
            }`,
            "variables": {
            }
        }),
        headers: {
            'Content-Type': "application/json",
            'Accept-Encoding': "gzip, deflate, br"
        }
    })
    .then(async response => {
        return response.json().then((json) => {
            return json.data?.franchises;
        });
    });

export function useFetchFranchiseManagementIdsGraph( options: { enabled?: boolean }): UseQueryResult<FranchiseManagement[]> {
    return useQuery({
        queryKey: ["franchiseManagementIds-graph"],
        queryFn: fetchFranchiseManagementIds,
        staleTime: 1000 * 60 * 60 * 24,
        enabled: options.enabled ?? true,
    }); // 1 second * 60 * 60 = 1 hour
}