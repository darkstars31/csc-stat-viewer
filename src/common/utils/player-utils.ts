import { PlayerStats } from "../../models";
import { Player } from "../../models/player";

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
    "Util": "Utility Thrown / Match",
    "HS": "Headshot (%)",
    "awp/R": "Awp Kills / Round",
    "multi/R": "Multi-Kills / Round", // points based on difficulty/remaining players
    "clutch/R": "Clutch-ability", // points based on difficulty/remaining players
    "SuppR": "Support Rounds",
    "SuppXr": "Support Damage / Round",
    "oda/R": "Open Duel Attempts / Round",
    "entries/R": "Entry Kill on T-side / Round",
    "trades/R": "Trade Kills / Round",
    "TRatio": "Deaths Traded Out (%)",
    "saves/R": "Saves / Round",
    "SRate": "Rounds Survived (%)",
    "2k": "2K Rounds",
    "3k": "3K Rounds",
    "4k": "4K Rounds",
    "5k": "Ace Rounds",
    "1v1": "1v1 Clutches",
    "1v2": "1v2 Clutches",
    "1v3": "1v3 Clutches",
    "1v4": "1v4 Clutches",
    "1v5": "Ace Clutches",
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
    "ctADP": "Death Placement CT-side",
    "tADP": "Death Placement T-side",
    "EF/F": "Enemies Flashed / Flash",
    "Blind/EF": "Enemy Blind time / Flash",
    "X/nade": "Damage per Frag thrown",
    "AWP/ctr": "CT-side Awp Kills / Round",
    "K/ctr": "CT-side Kills",
    "lurks/tR": "Lurks on T-side / Round",
    "wlp/L": "Lurk Round Points won",
    "Tier": "Tier",
}

export const tiers = ["Premier", "EliPrem", "Elite", "Challenger", "Contender", "Prospect", "New Tier"];

export const tierColorClassNames = {
    "Premier": "purple",
    "EliPrem": "purple",
    "Elite": "blue",
    "Challenger": "green",
    "Contender": "slate",
    "Prospect": "orange",
    "New Tier": "red"
}

export const roleColors = {
	"AWPER": "blue",
	"ENTRY": "orange",
	"FRAGGER": "red",
	"SUPPORT": "green",
	"LURKER": "purple",
	"RIFLER": "black",
}

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

export function _sort<T, K extends keyof T>( items: T[], property: K, n?: number ) {
    const sorted = items.sort( (a,b) => a[property] < b[property] ? 1 : -1).slice(0,n);
    return n ? sorted.slice(0,n) : sorted;
}
export const getPlayersInTier = ( player: PlayerStats, allPlayers: PlayerStats[] ) => allPlayers.filter( ap => ap.Tier === player.Tier);
export const getPlayersInTier3GP = (player: PlayerStats, allPlayers: PlayerStats[]) => allPlayers.filter(ap => ap.Tier === player.Tier && ap.GP > 3);
export const getPlayersInTierOrderedByRating = ( player: PlayerStats, allPlayers: PlayerStats[] ) => getPlayersInTier( player, allPlayers).sort( (a,b) => a.Rating < b.Rating ? 1 : -1);
export const getTop10PlayersInTier3GP = (
    player: PlayerStats,
    allPlayers: PlayerStats[],
    property: keyof PlayerStats
) => {
    const playersInTier3GP = getPlayersInTier3GP(player, allPlayers);
    const sortedPlayers = playersInTier3GP.sort((a, b) => (b[property] as any) - (a[property] as any));
    return sortedPlayers.slice(0, 10);
};
export const getPlayerRatingIndex = ( player: PlayerStats, allPlayers: PlayerStats[] ) => {
    const playersInTierSortedByRating = getPlayersInTierOrderedByRating(player, allPlayers);
    return playersInTierSortedByRating.findIndex( p => p.Name === player.Name);
}

export const getPlayerTeammates = ( player: PlayerStats, allPlayers: PlayerStats[] ) => {
    return allPlayers
        .filter( allPlayers => !["DE","FA","PFA"].includes(allPlayers.Team))
        .filter( allPlayers => allPlayers.Tier === player.Tier && allPlayers.Team === player.Team && allPlayers.Name !== player.Name);
}

export const TotalPlayerAverages = ( combinePlayerData: PlayerStats[], options?: Record<string,unknown> ) => {
    const players = options?.tier ? combinePlayerData.filter( p => p.Tier === options?.tier) : combinePlayerData;

    const standardDeviation = {
        rating: calculateStandardDeviation(players, "Rating"),
        ratingConsistency: calculateStandardDeviation(players, "CONCY"),
        headShotPercentage: calculateStandardDeviation(players, "HS"),
        damagePerRound: calculateStandardDeviation(players, "ADR"),
        gamesPlayed: calculateStandardDeviation(players, "GP"),
        roundsPlayed: calculateStandardDeviation(players, "Rounds"),
        utilThrownPerMatch: calculateStandardDeviation(players, "Util"),
        timeTilDeath: calculateStandardDeviation(players, "ATD"),
        impactOnWonRounds: calculateStandardDeviation(players, "IWR"),
        nadeDamagePerNade: calculateStandardDeviation(players, "X/nade"),
        enemiesFlashedPerFlash: calculateStandardDeviation(players, "EF/F"),
    };

    const average = {
        form: calculateAverage(players, "Form"),
        peak: calculateAverage(players, "Peak"),
        pit: calculateAverage(players, "Pit"),
        rating: calculateAverage(players, "Rating"),
        ratingConsistency: calculateAverage(players, "CONCY"),
        headShotPercentage: calculateAverage(players, "HS"),
        damagePerRound: calculateAverage(players, "ADR"),
        gamesPlayed: calculateAverage(players, "GP"),
        roundsPlayed: calculateAverage(players, "Rounds"),
        utilThrownPerMatch: calculateAverage(players, "Util"),
        timeTilDeath: calculateAverage(players, "ATD"),
        impactOnWonRounds: calculateAverage(players, "IWR"),
        nadeDamagePerNade: calculateAverage(players, "X/nade"),
        enemiesFlashedPerFlash: calculateAverage(players, "EF/F"),
    };

    const lowest = {
        rating: calculateLowest(players, "Rating"),
        ratingConsistency: calculateLowest(players, "CONCY"),
        headShotPercentage: calculateLowest(players, "HS"),
        damagePerRound: calculateLowest(players, "ADR"),
        gamesPlayed: calculateLowest(players, "GP"),
        roundsPlayed: calculateLowest(players, "Rounds"),
        utilThrownPerMatch: calculateLowest(players, "Util"),
        timeTilDeath: calculateLowest(players, "ATD"),
        impactOnWonRounds: calculateLowest(players, "IWR"),
        nadeDamagePerNade: calculateLowest(players, "X/nade"),
        enemiesFlashedPerFlash: calculateLowest(players, "EF/F"),
    };

    const highest = {
        rating: calculateHighest(players, "Rating"),
        ratingConsistency: calculateHighest(players, "CONCY"),
        headShotPercentage: calculateHighest(players, "HS"),
        damagePerRound: calculateHighest(players, "ADR"),
        gamesPlayed: calculateHighest(players, "GP"),
        roundsPlayed: calculateHighest(players, "Rounds"),
        utilThrownPerMatch: calculateHighest(players, "Util"),
        timeTilDeath: calculateHighest(players, "ATD"),
        impactOnWonRounds: calculateHighest(players, "IWR"),
        nadeDamagePerNade: calculateHighest(players, "X/nade"),
        enemiesFlashedPerFlash: calculateHighest(players, "EF/F"),
    };

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

function calculateAverage(players: PlayerStats[], prop: string){
    return Number((players.reduce(( cumulative, player ) => cumulative + Number(player[prop as keyof PlayerStats]), 0 ) / players.length).toFixed(2));
}

function calculateHighest(players: PlayerStats[], prop: keyof PlayerStats){
    const sortedPlayers = _sort(players, prop).at(0);
    return sortedPlayers![prop as keyof PlayerStats];
}

function calculateLowest(players: PlayerStats[], prop: keyof PlayerStats){
    const sortedPlayers = _sort(players, prop).reverse().at(0);
    return sortedPlayers![prop as keyof PlayerStats];
}


