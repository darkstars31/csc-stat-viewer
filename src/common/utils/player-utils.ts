import { clamp } from "lodash";
import { PlayerStats } from "../../models";
import { CscStats } from "../../models/csc-stats-types";
import { Player } from "../../models/player";
import { sortBy } from "lodash";

export const PlayerMappings: Record<string,string> = {
    "Team": "Team",
    "Name": "Name",
    "GP": "Games Played",
    "Rating": "Rating",
    "kr": "Kills / Round",
    "adr": "Damage / Round",
    "kast": "Kill Assist Traded Survived (%)",
    "odr": "Opening Duel (%)",
    "Impact": "Impact",
    "CT #": "CT-side Rating",
    "T #": "T-side Rating",
    "adp": "Average Death Placement",
    "utilDmg": "Utility Damage per Match",
    "ef": "Enemies Flashed per Match",
    "fAssists": "Flash Assists per Match",
    "util": "Utility Thrown / Match",
    "hs": "Headshot (%)",
    "awpR": "Awp Kills / Round",
    "multiR": "Multi-Kills / Round", // points based on difficulty/remaining players
    "clutchR": "Clutch-ability", // points based on difficulty/remaining players
    "suppR": "Support Rounds",
    "suppXR": "Support Damage / Round",
    "odaR": "Open Duel Attempts / Round",
    "entriesR": "Entry Kill on T-side / Round",
    "tradesR": "Trade Kills / Round",
    "tRatio": "Deaths Traded Out (%)",
    "savesR": "Saves / Round",
    "sRate": "Rounds Survived (%)",
    "twoK": "2K Rounds",
    "threeK": "3K Rounds",
    "fourK": "4K Rounds",
    "fiveK": "Ace Rounds",
    "cl_1": "1v1 Clutches",
    "cl_2": "1v2 Clutches",
    "cl_3": "1v3 Clutches",
    "cl_4": "1v4 Clutches",
    "cl_5": "Ace Clutches",
    "rounds": "Total Rounds Played",
    "peak": "Single Match Rating Peak",
    "pit": "Single Match Rating Pit",
    "form": "Avg Rating from last 3 games",
    "consistency": "Std Deviation from Rating (Lower is better)",
    "kills": "Total Kills",
    "assists": "Total Assists",
    "deaths": "Total Deaths",
    "MIP/r": "Most Impactful Player / Round",
    "IWR": "Impact on Rounds Won Ratio",
    "KPA": "Average Kill Impact",
    "RWK": "Rounds with at least 1 Kill",
    "ea/R": "Rounds with Opening Duel on T-side",
    "ATD": "Time to Death",
    "ctADP": "Death Placement CT-side",
    "tADP": "Death Placement T-side",
    "EF/F": "Enemies Flashed / Flash",
    "Blind/EF": "Enemy Blind time / Flash",
    "X/nade": "Damage per Frag thrown",
    "AWP/ctr": "CT-side Awp Kills / Round",
    "K/ctr": "CT-side Kills",
    "lurks/tR": "Lurks on T-side / Round",
    "wlp/L": "Lurk Round Points won",
}

export const tiers = ["Premier", "EliPrem", "Elite", "Challenger", "Contender", "Prospect", "New Tier"];

export const teamNameTranslator = ( player?: Player ) => {
    const name = player?.team?.name ?? player?.type ?? player?.stats?.Team ?? "";
    switch( name?.toUpperCase() ){
        case "DRAFT_ELIGIBLE": return "Draft Eligible";
        case "PERMANENT_FREE_AGENT": return "Perm FA";
        case "FREE_AGENT": return "Free Agent";
        case "UNROSTERED_GM": return `GM`;
        default: return name;
    }
}

export function _sort<T>( items: T[], property: string, n?: number, order?: "asc" | "desc" ) {
    const sorted = sortBy(items, property);
    const orderDirection = order === "desc" ? sorted.reverse() : sorted;
    return n ? orderDirection.slice(0,n) : orderDirection;
}
export const getPlayersInTier = ( player: Player, allPlayers: Player[] ) => allPlayers.filter( ap => ap.tier.name === player.tier.name );
export const getPlayersInTier3GP = (player: Player, allPlayers: Player[]) => allPlayers.filter(ap => ap.tier.name === player.tier.name && ap.stats?.GP > 3);
export const getPlayersInTierOrderedByRating = ( player: Player, allPlayers: Player[] ) => getPlayersInTier( player, allPlayers).sort( (a,b) => { if( !b.stats?.Rating) return -1;  return a.stats?.Rating < b.stats?.Rating ? 1 : -1});
export const getTop10PlayersInTier3GP = (
    player: Player,
    allPlayers: Player[],
    property: keyof CscStats
) => {
    const playersInTier3GP = getPlayersInTier3GP(player, allPlayers);
    const sortedPlayers = playersInTier3GP.sort((a, b) => (b.stats[property] as any) - (a.stats[property] as any));
    return sortedPlayers.slice(0, 10);
};
export const getPlayerRatingIndex = ( player: Player, allPlayers: Player[] ) => {
    const playersInTierSortedByRating = getPlayersInTierOrderedByRating(player, allPlayers);
    return playersInTierSortedByRating.findIndex( p => p.name === player.name);
}

export const getPlayerTeammates = ( player: PlayerStats, allPlayers: PlayerStats[] ) => {
    return allPlayers
        .filter( allPlayers => !["DE","FA","PFA"].includes(allPlayers.Team))
        .filter( allPlayers => allPlayers.Tier === player.Tier && allPlayers.Team === player.Team && allPlayers.Name !== player.Name);
}

export const getTotalPlayerAverages = (Players: Player[], options?: Record<string,unknown> ) => {
    const players = options?.tier ? Players.filter( p => p.tier.name === options?.tier) : Players;
    const standardDeviation: Record<string, number> = {};
    const average: Record<string, number> = {};
    const median: Record<string, any> = {};
    const lowest: Record<string, any> = {};
    const highest: Record<string, any> = {};

    for (const key in PlayerMappings) {
        if ( players[0] && players[0].hasOwnProperty(key) && Boolean(players[0].stats[key as keyof CscStats])) {
            const statsKey = key as keyof CscStats;

            // TODO: FIX
            standardDeviation[key] = calculateStandardDeviation( [] ?? players, statsKey);
            average[key] = calculateAverage(players.map( p => p.stats), statsKey);
            median[key] = calcuateMedian(players.map( p => p.stats), statsKey);
            lowest[key] = calculateMinMax(players.map( p => p.stats), statsKey, 'min');
            highest[key] = calculateMinMax(players.map( p => p.stats), statsKey, 'max');
        }
    }

    return {
        standardDeviation,
        average,
        lowest,
        highest,
    }
}

function calculateStandardDeviation( players: PlayerStats[], prop: string) {
    const mean = players.map( p => Number(p[prop as keyof PlayerStats])).reduce((a, b) => a + b, 0) / players.length;
    return Number(Math.sqrt(players.map(p => Math.pow(Number(p[prop as keyof PlayerStats]) - mean, 2)).reduce((a, b) => a + b, 0) / players.length).toFixed(2));
}

function calculateAverage(players: CscStats[], prop: string){
    return Number((players.reduce(( cumulative, player ) => cumulative + Number(player[prop as keyof (PlayerStats | CscStats)]), 0 ) / players.length).toFixed(2));
}

function calculateMinMax(players: CscStats[], prop: keyof CscStats, type: 'min' | 'max') {
    const sortedPlayers = _sort(players, prop);
    if( sortedPlayers.length === 0 ) return [];
    return type === 'max' ? sortedPlayers[0][prop] : sortedPlayers?.reverse()[0][prop];
}

function calcuateMedian(players: CscStats[], prop: keyof CscStats) {
    const sortedPlayers = _sort(players, prop);
    if( sortedPlayers.length === 0 ) return [];
    if( sortedPlayers.length % 2 === 0 ){
        return (Number(sortedPlayers[sortedPlayers.length / 2 - 1][prop]) + Number(sortedPlayers[sortedPlayers.length / 2][prop])) / 2;
    }
    return Number(sortedPlayers[sortedPlayers.length / 2][prop]);
}

export function determinePlayerRole( stats: CscStats ){
    if( !stats?.GP || stats?.GP < 3 ) return '';
    const roles = {
        AWPER: clamp(stats["awpR"],0, .5) / .5, // Awper
        ENTRY: clamp(stats.odr*(stats["odaR"]*3), 0, 1.1) / 1.1, // Entry
        FRAGGER: clamp(stats["multiR"], 0, 1.3) / 1.3, // Fragger
        RIFLER: clamp(stats.adr, 0, 230) / 230, // Rifler
        SUPPORT: clamp((stats.suppR*12)+stats.suppXR, 0, 55) / 55, // Support
        //clamp(player.stats["wlpL"], 0, 5), // Lurker
    };

    return Object.entries(roles).reduce( ( role, [key, value]) => value > role[1] ? [key, value] : role, ['', 0])[0];
    
}

