import { Player } from "../models";

export const PlayerMappings: Record<string,string> = {
    "": "",
    "Steam": "SteamID",
    "Team": "Team",
    "Name": "Name",
    "ppR": "Role",
    "GP": "Games Played",
    "Rating": "Rating",
    "K/R": "Kills / Round",
    "ADR": "Damage / Round",
    "KAST": "Kill Assist Traded Survived (%)",
    "ODR": "Opening Duel (%)",
    "Impact": "Impact",
    "CT #": "CT-side Rating",
    "T #": "T-side Rating",
    "ADP": "Average Death Placement",
    "UD": "Utility Damage per Match",
    "EF": "Enemies Flashed per Match",
    "F_Assists": "Flash Assists per Match",
    "Util": "Utility Thrown per Match",
    "HS": "Headshot (%)",
    "awp/R": "Awp Kills / Round",
    "multi/R": "Multi Kills / Round", // points based on difficulty/remaining players
    "clutch/R": "Clutch-ability", // points based on difficulty/remaining players
    "SuppR": "Support Rounds",
    "SuppXr": "Support Damage / Round",
    "oda/R": "Open Duel Attempts / Round",
    "entries/R": "First Kill on T-side / Round",
    "trades/R": "Trade Kills / Round",
    "TRatio": "Deaths Traded Out (%)",
    "saves/R": "Saves / Round",
    "SRate": "Rounds Survived (%)",
    "2k": "2k Rounds",
    "3k": "3k Rounds",
    "4k": "4k Rounds",
    "5k": "Ace Rounds",
    "1v1": "1v1 Clutch Rounds",
    "1v2": "1v2 Clutch Rounds",
    "1v3": "1v3 Clutch Rounds",
    "1v4": "1v4 Clutch Rounds",
    "1v5": "Ace Clutch Rounds",
    "Rounds": "Total Rounds Played",
    "Peak": "Single Match Rating Peak",
    "Pit": "Single Match Rating Pit",
    "Form": "Avg Rating from last 3 games",
    "CONCY": "Std Deviation from Rating (Lower is better)",
    "Kills": "Total Kills",
    "Assists": "Total Assists",
    "Deaths": "Total Deaths",
    "MIP/r": "Most Impactful Player / Round",
    "IWR": "Impact on Rounds Won Ratio",
    "KPA": "Average Kill Impact",
    "RWK": "Rounds with at least 1 Kill",
    "Xdiff": "Damage given vs. taken",
    "ea/R": "Rounds with Opening Duel on T-side",
    "ATD": "Time to Death",
    "ctADP": "Death Placement on CT-side",
    "tADP": "Death Placement on T-side",
    "EF/F": "Enemies Flashed / Flash",
    "Blind/EF": "Enemy Blind time / Flash",
    "X/nade": "Damage per Frag thrown",
    "AWP/ctr": "CT-side Awp Kills / Round",
    "K/ctr": "CT-side Kills",
    "lurks/tR": "Lurks on T-side / Round",
    "wlp/L": "Lurk Round Points won",
    "Tier": "Tier",
}

export const tiers = ["Premier", "Elite", "Challenger", "Contender", "Prospect"];

export const tierColorClassNames = {
    "Premier": "purple",
    "Elite": "blue",
    "Challenger": "green",
    "Contender": "slate",
    "Prospect": "orange",
}

export const teamNameTranslator = ( name: string ) => {
    switch( name?.toUpperCase() ){
        case "DE": return "Draft Eligible";
        case "PFA": return "Perm Free Agent";
        case "FA": return "Free Agent";
        default: return name;
    }
}

export function _sort<T, K extends keyof T>( items: T[], property: K, n?: number ) {
    const sorted = items.sort( (a,b) => a[property] < b[property] ? 1 : -1).slice(0,n);
    return n ? sorted.slice(0,n) : sorted;
}

export const getPlayersInTier = ( player: Player, allPlayers: Player[] ) => allPlayers.filter( ap => ap.Tier === player.Tier);
export const getPlayersInTierOrderedByRating = ( player: Player, allPlayers: Player[] ) => getPlayersInTier( player, allPlayers).sort( (a,b) => a.Rating < b.Rating ? 1 : -1);
export const getPlayerRatingIndex = ( player: Player, allPlayers: Player[] ) => {
    const playersInTierSortedByRating = getPlayersInTierOrderedByRating(player, allPlayers);
    return playersInTierSortedByRating.findIndex( p => p.Name === player.Name );
}
export const getPlayerTeammates = ( player: Player, allPlayers: Player[] ) => {
    return allPlayers
        .filter( allPlayers => !["DE","FA","PFA"].includes(allPlayers.Team))
        .filter( allPlayers => allPlayers.Tier === player.Tier && allPlayers.Team === player.Team && allPlayers.Name !== player.Name);
}

export const TotalPlayerAverages = ( combinePlayerData: Player[], options?: Record<string,unknown> ) => {
    const players = options?.tier ? combinePlayerData.filter( p => p.Tier === options?.tier) : combinePlayerData;

    return {
        avgRating: calculateAverage(players, "Rating"),
        avgRatingConsistency: calculateAverage(players, "CONCY"),
        avgHeadShotPercentage: calculateAverage(players, "HS"),
        avgDamagePerRound: calculateAverage(players, "ADR"),
        avgGamesPlayed: calculateAverage(players, "GP"),
        avgRoundsPlayed: calculateAverage(players, "Rounds"),
        avgUtilThrownPerMatch: calculateAverage(players, "Util"),
        avgTimeTilDeath: calculateAverage(players, "ATD"),
        avgImpactOnWonRounds: calculateAverage(players, "IWR"),
        avgNadeDamagePerNade: calculateAverage(players, "X/nade"),
        avgEnemiesFlashedPerFlash: calculateAverage(players, "EF/F"),
        highest: {
            impactOnRoundsWon: calculateHighest(players,"IWR"),
        }
    }
}

function calculateAverage(players: Player[], prop: string){
    return Number((players.reduce(( cumulative, player ) => cumulative + Number(player[prop as keyof Player]), 0 ) / players.length).toFixed(2));
}

function calculateHighest(players: Player[], prop: keyof Player){
    return _sort(players, prop);
}

export const isPositive = ( value: number ) => value > 0;