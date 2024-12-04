// Normalize a stat
import {CscStats, Player} from "../../models";
import {getTotalPlayerAverages} from "../../common/utils/player-utils";

function normalize(stat: number, low: number, high: number) {
    return (stat - low) / (high - low);
}

// Calculate the combined percentile
export function calculateFirepowerPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    // Firepower
    const killsPerRound = stats.kr;
    const adr = stats.adr;
    const multiKillPerRound = stats.multiR;

    const averageKillsPerRound = tierPlayerAverages.average["kr"];
    const averageAdr = tierPlayerAverages.average["adr"];
    const averageMultiKillPerRound = tierPlayerAverages.average["multiR"];

    const lowKillsPerRound = tierPlayerAverages.lowest["kr"];
    const lowAdr = tierPlayerAverages.lowest["adr"];
    const lowMultiKillPerRound = tierPlayerAverages.lowest["multiR"];

    const highKillsPerRound = tierPlayerAverages.highest["kr"];
    const highAdr = tierPlayerAverages.highest["adr"];
    const highMultiKillPerRound = tierPlayerAverages.highest["multiR"];

    // Normalize player's stats
    const normalizedKillsPerRound = normalize(killsPerRound, lowKillsPerRound, highKillsPerRound);
    const normalizedAdr = normalize(adr, lowAdr, highAdr);
    const normalizedMultiKillPerRound = normalize(multiKillPerRound, lowMultiKillPerRound, highMultiKillPerRound);

    // Normalize average stats
    const normalizedAverageKillsPerRound = normalize(averageKillsPerRound, lowKillsPerRound, highKillsPerRound);
    const normalizedAverageAdr = normalize(averageAdr, lowAdr, highAdr);
    const normalizedAverageMultiKillPerRound = normalize(averageMultiKillPerRound, lowMultiKillPerRound, highMultiKillPerRound);

    // Combined scores
    const playerCombinedScore = (
        normalizedKillsPerRound + normalizedAdr + normalizedMultiKillPerRound
    ) / 3;

    const averageCombinedScore = (
        normalizedAverageKillsPerRound + normalizedAverageAdr + normalizedAverageMultiKillPerRound
    ) / 3;

    // Convert to percentile (0 to 100 scale)
    const playerFirepowerPercentile = playerCombinedScore * 100;
    const averageFirepowerPercentile = averageCombinedScore * 100;

    return {
        playerFirepowerPercentile,
        averageFirepowerPercentile
    };
}

export function calculateEntryingPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    // Entrying
    const openingDuelsPerRound = stats.odaR
    const openingDuelSuccess = stats.odr
    const deathsTradedOut = stats.tRatio
    const assistsPerRound = stats.assists / stats.rounds
    const supportDamagePerRound = stats.suppXR;

    const averageOpeningDuelsPerRound = tierPlayerAverages.average["odaR"];
    const averageOpeningDuelSuccess = tierPlayerAverages.average["odr"];
    const averageDeathsTradedOut = tierPlayerAverages.average["tRatio"];
    const averageAssistsPerRound = tierPlayerAverages.average["assists"] / tierPlayerAverages.average["rounds"];
    const averageSupportDamagePerRound = tierPlayerAverages.average["suppXR"];

    const lowOpeningDuelsPerRound = tierPlayerAverages.lowest["odaR"];
    const lowOpeningDuelSuccess = tierPlayerAverages.lowest["odr"];
    const lowDeathsTradedOut = tierPlayerAverages.lowest["tRatio"];
    const lowAssistsPerRound = tierPlayerAverages.lowest["assists"] / tierPlayerAverages.lowest["rounds"];
    const lowSupportDamagePerRound = tierPlayerAverages.lowest["suppXR"];

    const highOpeningDuelsPerRound = tierPlayerAverages.highest["odaR"];
    const highOpeningDuelSuccess = tierPlayerAverages.highest["odr"];
    const highDeathsTradedOut = tierPlayerAverages.highest["tRatio"];
    const highAssistsPerRound = tierPlayerAverages.highest["assists"] / tierPlayerAverages.highest["rounds"];
    const highSupportDamagePerRound = tierPlayerAverages.highest["suppXR"];

    // Normalize player's stats
    const normalizedOpeningDuelsPerRound = normalize(openingDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
    const normalizedOpeningDuelSuccess = normalize(openingDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);
    const normalizedDeathsTradedOut = normalize(deathsTradedOut, lowDeathsTradedOut, highDeathsTradedOut);
    const normalizedAssistsPerRound = normalize(assistsPerRound, lowAssistsPerRound, highAssistsPerRound);
    const normalizedSupportDamagePerRound = normalize(supportDamagePerRound, lowSupportDamagePerRound, highSupportDamagePerRound);

    // Normalize average stats
    const normalizedAverageOpeningDuelsPerRound = normalize(averageOpeningDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
    const normalizedAverageOpeningDuelSuccess = normalize(averageOpeningDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);
    const normalizedAverageDeathsTradedOut = normalize(averageDeathsTradedOut, lowDeathsTradedOut, highDeathsTradedOut);
    const normalizedAverageAssistsPerRound = normalize(averageAssistsPerRound, lowAssistsPerRound, highAssistsPerRound);
    const normalizedAverageSupportDamagePerRound = normalize(averageSupportDamagePerRound, lowSupportDamagePerRound, highSupportDamagePerRound);

    // Combined scores
    const playerCombinedScore = (
        normalizedOpeningDuelsPerRound + normalizedOpeningDuelSuccess + normalizedDeathsTradedOut + normalizedAssistsPerRound + normalizedSupportDamagePerRound
    ) / 5;

    const averageCombinedScore = (
        normalizedAverageOpeningDuelsPerRound + normalizedAverageOpeningDuelSuccess + normalizedAverageDeathsTradedOut + normalizedAverageAssistsPerRound + normalizedAverageSupportDamagePerRound
    ) / 5;

    // Convert to percentile (0 to 100 scale)
    const playerEntryingPercentile = playerCombinedScore * 100;
    const averageEntryingPercentile = averageCombinedScore * 100;

    return {
        playerEntryingPercentile,
        averageEntryingPercentile
    };
}

export function calculateOpeningPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    const openingDuelsPerRound = stats.odaR
    const openingDuelSuccess = stats.odr

    const averageOpeningDuelsPerRound = tierPlayerAverages.average["odaR"];
    const averageOpeningDuelSuccess = tierPlayerAverages.average["odr"];

    const lowOpeningDuelsPerRound = tierPlayerAverages.lowest["odaR"];
    const lowOpeningDuelSuccess = tierPlayerAverages.lowest["odr"];

    const highOpeningDuelsPerRound = tierPlayerAverages.highest["odaR"];
    const highOpeningDuelSuccess = tierPlayerAverages.highest["odr"];

    // Normalize player's stats
    const normalizedOpeningDuelsPerRound = normalize(openingDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
    const normalizedOpeningDuelSuccess = normalize(openingDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);

    // Normalize average stats
    const normalizedAverageOpeningDuelsPerRound = normalize(averageOpeningDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
    const normalizedAverageOpeningDuelSuccess = normalize(averageOpeningDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);

    // Combined scores
    const playerCombinedScore = (
        normalizedOpeningDuelsPerRound + normalizedOpeningDuelSuccess
    ) / 2;

    const averageCombinedScore = (
        normalizedAverageOpeningDuelsPerRound + normalizedAverageOpeningDuelSuccess
    ) / 2;

    // Convert to percentile (0 to 100 scale)
    const playerOpeningPercentile = playerCombinedScore * 100;
    const averageOpeningPercentile = averageCombinedScore * 100;

    return {
        playerOpeningPercentile,
        averageOpeningPercentile
    };
}

export function calculateSnipingPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    const awpKillsPerRound = stats.awpR;
    const averageAwpKillsPerRound = tierPlayerAverages.average["awpR"];
    const lowAwpKillsPerRound = tierPlayerAverages.lowest["awpR"];
    const highAwpKillsPerRound = tierPlayerAverages.highest["awpR"];

    // Normalize player's stats
    const normalizedAwpKillsPerRound = normalize(awpKillsPerRound, lowAwpKillsPerRound, highAwpKillsPerRound);

    // Normalize average stats
    const normalizedAverageAwpKillsPerRound = normalize(averageAwpKillsPerRound, lowAwpKillsPerRound, highAwpKillsPerRound);

    // Convert to percentile (0 to 100 scale)
    const playerSnipingPercentile = normalizedAwpKillsPerRound * 100;
    const averageSnipingPercentile = normalizedAverageAwpKillsPerRound * 100;

    return {
        playerSnipingPercentile,
        averageSnipingPercentile
    };
}

export function calculateTradePercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    const trades = stats.tradesR;
    const avgTrades = tierPlayerAverages.average["tradesR"];
    const lowTrades = tierPlayerAverages.lowest["tradesR"];
    const highTrades = tierPlayerAverages.highest["tradesR"];

    // Normalize player's stats
    const normalizedTrades = normalize(trades, lowTrades, highTrades);

    // Normalize average stats
    const normalizedAverageTrades = normalize(avgTrades, lowTrades, highTrades);

    // Convert to percentile (0 to 100 scale)
    const playerTradePercentile = normalizedTrades * 100;
    const averageTradePercentile = normalizedAverageTrades * 100;

    return {
        playerTradePercentile,
        averageTradePercentile
    };
}

export function calculateClutchPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    const clutch = stats.clutchR;
    const avgClutch = tierPlayerAverages.average["clutchR"];
    const lowClutch = tierPlayerAverages.lowest["clutchR"];
    const highClutch = tierPlayerAverages.highest["clutchR"];

    // Normalize player's stats
    const normalizedClutch = normalize(clutch, lowClutch, highClutch);

    // Normalize average stats
    const normalizedAverageClutch = normalize(avgClutch, lowClutch, highClutch);

    // Convert to percentile (0 to 100 scale)
    const playerClutchPercentile = normalizedClutch * 100;
    const averageClutchPercentile = normalizedAverageClutch * 100;

    return {
        playerClutchPercentile,
        averageClutchPercentile,
    };
}

export function calculateUtilityPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    const utilDamage = stats.utilDmg;
    const util = stats.util;
    const flashes = stats.ef;
    const flashAssists = stats.fAssists;

    const averageUtilDamage = tierPlayerAverages.average["utilDmg"];
    const averageUtil = tierPlayerAverages.average["util"];
    const averageFlashes = tierPlayerAverages.average["ef"];
    const averageFlashAssists = tierPlayerAverages.average["fAssists"];

    const lowUtilDamage = tierPlayerAverages.lowest["utilDmg"];
    const lowUtil = tierPlayerAverages.lowest["util"];
    const lowFlashes = tierPlayerAverages.lowest["ef"];
    const lowFlashAssists = tierPlayerAverages.lowest["fAssists"];

    const highUtilDamage = tierPlayerAverages.highest["utilDmg"];
    const highUtil = tierPlayerAverages.highest["util"];
    const highFlashes = tierPlayerAverages.highest["ef"];
    const highFlashAssists = tierPlayerAverages.highest["fAssists"];

    const normalizedUtilDamage = normalize(utilDamage, lowUtilDamage, highUtilDamage);
    const normalizedUtil = normalize(util, lowUtil, highUtil);
    const normalizedFlashes = normalize(flashes, lowFlashes, highFlashes);
    const normalizedFlashAssists = normalize(flashAssists, lowFlashAssists, highFlashAssists);

    const normalizedAverageUtilDamage = normalize(averageUtilDamage, lowUtilDamage, highUtilDamage);
    const normalizedAverageUtil = normalize(averageUtil, lowUtil, highUtil);
    const normalizedAverageFlashes = normalize(averageFlashes, lowFlashes, highFlashes);
    const normalizedAverageFlashAssists = normalize(averageFlashAssists, lowFlashAssists, highFlashAssists);

    // Combined scores
    const playerCombinedScore = (
        normalizedUtilDamage + normalizedUtil + normalizedFlashes + normalizedFlashAssists
    ) / 4;

    const averageCombinedScore = (
        normalizedAverageUtilDamage + normalizedAverageUtil + normalizedAverageFlashes + normalizedAverageFlashAssists
    ) / 4;

    const playerUtilityPercentile = playerCombinedScore * 100;
    const averageUtilityPercentile = averageCombinedScore * 100;

    return {
        playerUtilityPercentile,
        averageUtilityPercentile
    };
}