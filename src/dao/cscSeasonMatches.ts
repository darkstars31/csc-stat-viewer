import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";

const OneHour = 1000 * 60 * 60;

type StandingMatches = {
	mapName: string;
	matchDay: string;
	matchId: string;
	matchType: string;
	season: number;
	teamStats: TeamStats[];
	tier: "Contender";
	totalRounds: number;
};

type TeamStats = {
	TR: number;
	TRW: number;
	ctR: number;
	ctRW: number;
	name: string;
	pistols: number;
	pistolsW: number;
	score: number;
};

const fetchGraph = async (tier: string, season?: number) =>
	await fetch(appConfig.endpoints.cscGraphQL.stats, {
		method: "POST",
		body: JSON.stringify({
			operationName: "SeasonMatches",
			query: `query SeasonMatches($season: Int!, $tier: Tier, $matchType: MatchType!) {
                findManyMatch(
                  where: {season: {equals: $season}, tier: {equals: $tier}, matchType: {equals: $matchType}}
                ) {
                  matchId
                  totalRounds
                  mapName
                  matchDay
                  season
                  tier
                  matchType
                  teamStats {
                    name
                    score
                    TR
                    TRW
                    ctR
                    ctRW
                    pistols
                    pistolsW
                  }
                }
              }
            `,
			variables: {
				matchType: "Regulation",
				season: season,
				tier: tier,
			},
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async response => {
		return response.json().then((json: { data: { findManyMatch: StandingMatches } }) => {
			return json.data.findManyMatch;
		});
	});

export function useCscSeasonMatches(tier: string, season?: number): UseQueryResult<StandingMatches[]> {
	return useQuery([`cscSeasonMatches-${season}-${tier}-graph`], () => fetchGraph(tier, season), {
		enabled: Boolean(season),
		staleTime: OneHour,
	});
}
