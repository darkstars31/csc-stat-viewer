import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CscStats, CscStatsQuery } from "../models/csc-stats-types";

const url = `https://stats.csconfederation.com/graphql`
const cachedUrl = `https://d286fmnshh73ml.cloudfront.net/tier_season_stats`;

type CscTiers = "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier";

const OneHour = 1000 * 60 * 60;

const fetchGraph = async ( tier: CscTiers, season?: number ) => await fetch(url,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "getTierSeasonStats",
            "query": `query getTierSeasonStats($tier: String!, $season: Int!) {
                tierSeasonStats(tier: $tier, season: $season) {
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

const fetchCachedGraph = async (tier: CscTiers, season?: number) => await fetch(`${cachedUrl}/${tier}_season_${season}.json?q=${new Date().toISOString()}`,
        {
            method: "GET",    
            headers: {'Content-Type': "application/json" }
        }).then( async response => 
            response.json().then( (json: CscStatsQuery) => 
                json.data.tierSeasonStats
        ) ).catch( () => {
            fetchGraph( tier, season );
        });

export function useCscStatsGraph( tier: CscTiers, season?: number ): UseQueryResult<CscStats[]> {
    return useQuery( 
        [`cscstats-${tier}-graph`], 
        () => fetchCachedGraph(tier, season), 
        {
            staleTime: OneHour,
        }
    );
}