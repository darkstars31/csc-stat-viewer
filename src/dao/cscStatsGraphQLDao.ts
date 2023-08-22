import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscStats, CscStatsQuery } from "../models/csc-stats-types";
import { appConfig } from "../dataConfig";

// const cachedUrl = `/getTierSeasonStats`;

type CscTiers = "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async ( tier: CscTiers, season?: number, matchType?: string ) => await fetch(appConfig.endpoints.cscGraphQL.stats,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "getTierSeasonStats",
            "query": `query getTierSeasonStats($tier: String!, $season: Int!, $matchType: String!) {
                tierSeasonStats(tier: $tier, season: $season, matchType: $matchType) {
                    adp
                    adr
                    assists
                    awpR
                    cl_1
                    cl_2
                    cl_3
                    cl_4
                    cl_5
                    clutchR 
                    consistency 
                    deaths
                    ef 
                    fAssists 
                    fiveK
                    form
                    fourK
                    gameCount
                    hs
                    impact
                    kast
                    kills
                    kr
                    multiR
                    name
                    odaR
                    odr
                    peak
                    pit
                    rating
                    rounds
                    saveRate
                    savesR
                    suppR
                    suppXR
                    Team: team
                    threeK
                    tradesR
                    tRatio
                    twoK
                    util
                    utilDmg
                }
            }`
            ,
            "variables": {
                "tier": tier,
                "season": season,
                "matchType": matchType
            }      
        }),
        headers: {
            'Content-Type': "application/json"
        }
    })
    .then( async response => {
        return response.json().then( (json: CscStatsQuery) => {
            return json.data.tierSeasonStats;
        });
    } );

// const fetchCachedGraph = async (tier: CscTiers, season?: number, matchType?: string) => await fetch(`${appConfig.endpoints.cloudfrontCache}${cachedUrl}/season_${season}_tier_${tier}.json?q=${new Date().getTime()}`,
//         {
//             method: "GET",    
//             headers: {'Content-Type': "application/json" }
//         }).then( async response => 
//             response.json().then( (json: CscStatsQuery) => 
//                 json.data.tierSeasonStats
//         ) ).catch( () => {
//             fetchGraph( tier, season, matchType );
//         });

export function useCscStatsGraph( tier: CscTiers, season?: number, matchType?: string ): UseQueryResult<CscStats[]> {
    return useQuery( 
        [`cscstats-${tier}-graph`], 
        () => fetchGraph(tier, season, matchType), 
        {
            staleTime: OneHour,
        }
    );
}