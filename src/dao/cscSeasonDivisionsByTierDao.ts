import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";
import { ConferencesQuery, Standing } from "../models/cscSeasonDivisionByTier";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async (season?: number) =>
	await fetch(appConfig.endpoints.cscGraphQL.core, {
		method: "POST",
		body: JSON.stringify({
			operationName: "",
			query: `query Seasons( $season: Int) {
                season(number: $season) {
                    standings {
                        tier {
                            name
                        }
                        divisions {
                            name
                            teams {
                                team {
                                    name
                                }
                            }
                        }
                    }
                }
            }
            `,
			variables: {
				season: 11,
			},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async response => {
		return response.json().then((json: ConferencesQuery) => {
			return json.data.season.standings;
		});
	});

export function useCscSeasonDivisionsByTier(season?: number): UseQueryResult<Standing[]> {
	return useQuery({
        queryKey: [`cscSeasonDivisionsByTier-${season}-graph`],
        queryFn: () => fetchGraph(season),
        staleTime: OneHour
    });
}
