import { Player } from "../models";

export const PlayerMappings: Record<string,string> = {
    "": "",
    "Steam": "SteamID",
    "Team": "Team",
    "Name": "Name",
    "ppR": "Role",
    "GP": "Games Played",
    "Rating": "Rating",
    "K/R": "Avg Kills per Round",
    "ADR": "Avg Damage per Round",
    "KAST": "Kill/Assist/Traded/Survived Percentage",
    "ODR": "Opening Duel Percentage",
    "Impact": "Impact",
    "CT #": "CT-side Rating",
    "T #": "T-side Rating",
    "ADP": "Avg Death Placement",
    "UD": "Avg Utility Damage per Match",
    "EF": "Enemies Flashed per Match",
    "F_Assists": "Avg Flash Assists per Match",
    "Util": "# of Utility Thrown per Match",
    "HS": "Headshot Percentage",
    "awp/R": "Awp Kills per Round",
    "multi/R": "Multi-Kills per Round w/ points based on difficulty",
    "clutch/R": "Clutches per Round w/ points based on difficulty",
    "SuppR": "Support Rounds",
    "SuppXr": "Support Damage per Round",
    "oda/R": "Open Duel Attempts per Round",
    "entries/R": "First Kill on T-side per Round",
    "trades/R": "Trade Kills per Round",
    "TRatio": "Percentage of deaths traded out",
    "saves/R": "Saves Per Round",
    "SRate": "Rounds Survived Percentage",
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
    "MIP/r": "MIP/r(?)",
    "IWR": "Impact on Rounds Won Ratio",
    "KPA": "Avg Kill Impact",
    "RWK": "Rounds with at least 1 Kill",
    "Xdiff": "Difference between Damage Dealt and Received",
    "ea/R": "Avg Rounds with Opening Duel on T-side",
    "ATD": "Avg Time to Death",
    "ctADP": "Avg Death Placement on CT-side",
    "tADP": "Avg Death Placement on T-side",
    "EF/F": "Enemies Flashed per Thrown Flash",
    "Blind/EF": "Enemy Blind time per Thrown Flash",
    "X/nade": "Avg Damage per Frag thrown",
    "AWP/ctr": "CT-sided Awp Kills per Round",
    "K/ctr": "CT-sided Kills",
    "lurks/tR": "T-sided Lurks per Round",
    "wlp/L": "Avg amount of points won on Lurk Rounds",
    "Tier": "Tier",
}

export const tierColorClassNames = {
    "Premier": "purple",
    "Elite": "blue",
    "Challenger": "green",
    "Contender": "slate",
    "Prospect": "orange",
}

export const teamNameTranslator = ( name: string ) => {
    switch( name.toUpperCase() ){
        case "DE": return "Draft Eligible";
        case "PFA": return "Perm Free Agent";
        case "FA": return "Free Agent";
        default: return name;
    }
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

    }
}

function calculateAverage(players: Player[], prop: string){
    return Number((players.reduce(( cumulative, player ) => Number(cumulative) + Number(player[prop as keyof Player]), 0 ) / players.length).toFixed(2));
}