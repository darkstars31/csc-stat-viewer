// Normalize a stat
import { CscStats, Player } from "../../models";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";

function calculatePercentileForStat(current: number, low: number, high: number) {
    if (high <= low) {
        return 100;
    }

    if (current < low) {
        return 0;
    }

    if (current > high) {
        return 100;
    }

    const percentile = ((current - low) / (high - low)) * 100;

    return parseFloat(percentile.toFixed(2));
}

function calculateTotalPercentile(percentiles: number[], playerPercentile: number) {
    // No need to do the math if they have no score
    if (playerPercentile < 1) {
        return 0;
    }

    const sortedPercentiles = percentiles.slice().sort((a, b) => a - b);

    // Find the rank of the person's score in the sorted array
    const rank = sortedPercentiles.filter(score => score <= playerPercentile).length;

    // Calculate percentile rank
    const percentile = (rank / sortedPercentiles.length) * 100;

    return percentile < 1 ? 0 : parseFloat(percentile.toFixed(2)); // Return rounded to 2 decimal places

    // Technically in real statistical analysis you can only ever be at the 99th percentile, not 100th
    // but thats confusing for people so the above code will show 100th percentile if you are the best
    // Calculate percentile rank
    // const lowerScoresCount = sortedPercentiles.filter(score => score < playerPercentile).length;
    // const totalScores = sortedPercentiles.length;
    // const percentile = (lowerScoresCount / totalScores) * 100;
    //
    // console.log("New Percentile:", percentile);
    //
    // return parseFloat(percentile.toFixed(2)); // Return rounded to 2 decimal places
}

// Calculate the combined percentile
export function calculateFirepowerPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    // Firepower
    const killsPerRound = stats.kr;
    const adr = stats.adr;
    const multiKillPerRound = stats.multiR;

    const lowKillsPerRound = tierPlayerAverages.lowest["kr"];
    const lowAdr = tierPlayerAverages.lowest["adr"];
    const lowMultiKillPerRound = tierPlayerAverages.lowest["multiR"];

    const highKillsPerRound = tierPlayerAverages.highest["kr"];
    const highAdr = tierPlayerAverages.highest["adr"];
    const highMultiKillPerRound = tierPlayerAverages.highest["multiR"];

    const killsPerRoundPercentile = calculatePercentileForStat(killsPerRound, lowKillsPerRound, highKillsPerRound);
    const adrPercentile = calculatePercentileForStat(adr, lowAdr, highAdr);
    const multiKillPerRoundPercentile = calculatePercentileForStat(multiKillPerRound, lowMultiKillPerRound, highMultiKillPerRound);

    const totalPercentile = killsPerRoundPercentile + adrPercentile + multiKillPerRoundPercentile;
    const allPercentiles = [];
    allPercentiles.push(totalPercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherKillsPerRound = otherStats.kr;
        const otherAdr = otherStats.adr;
        const otherMultiKillPerRound = otherStats.multiR;

        const otherKillsPerRoundPercentile = calculatePercentileForStat(otherKillsPerRound, lowKillsPerRound, highKillsPerRound);
        const otherAdrPercentile = calculatePercentileForStat(otherAdr, lowAdr, highAdr);
        const otherMultiKillPerRoundPercentile = calculatePercentileForStat(otherMultiKillPerRound, lowMultiKillPerRound, highMultiKillPerRound);

        const otherTotalPercentile = otherKillsPerRoundPercentile + otherAdrPercentile + otherMultiKillPerRoundPercentile;
        allPercentiles.push(otherTotalPercentile);
    }

    return calculateTotalPercentile(allPercentiles, totalPercentile);
}

export function calculateEntryingPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    // Entrying
    const openingDuelsPerRound = stats.odaR
    const openingDuelSuccess = stats.odr
    const deathsTradedOut = stats.tRatio
    const assistsPerRound = stats.assists / stats.rounds
    const supportDamagePerRound = stats.suppXR;

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

    const openingDuelsPerRoundPercentile = calculatePercentileForStat(openingDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
    const openingDuelSuccessPerRoundPercentile = calculatePercentileForStat(openingDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);
    const deathsTradedOutPercentile = calculatePercentileForStat(deathsTradedOut, lowDeathsTradedOut, highDeathsTradedOut);
    const assistsPerRoundPercentile = calculatePercentileForStat(assistsPerRound, lowAssistsPerRound, highAssistsPerRound);
    const supportDamagePerRoundPercentile = calculatePercentileForStat(supportDamagePerRound, lowSupportDamagePerRound, highSupportDamagePerRound);

    const totalPercentile = openingDuelsPerRoundPercentile + openingDuelSuccessPerRoundPercentile + deathsTradedOutPercentile + assistsPerRoundPercentile + supportDamagePerRoundPercentile;
    const allPercentiles = [];
    allPercentiles.push(totalPercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherOpeningDuelsPerRound = otherStats.odaR
        const otherOpeningDuelSuccess = otherStats.odr
        const otherDeathsTradedOut = otherStats.tRatio
        const otherAssistsPerRound = otherStats.assists / otherStats.rounds
        const otherSupportDamagePerRound = otherStats.suppXR;

        const otherOpeningDuelsPerRoundPercentile = calculatePercentileForStat(otherOpeningDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
        const otherOpeningDuelSuccessPerRoundPercentile = calculatePercentileForStat(otherOpeningDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);
        const otherDeathsTradedOutPercentile = calculatePercentileForStat(otherDeathsTradedOut, lowDeathsTradedOut, highDeathsTradedOut);
        const otherAssistsPerRoundPercentile = calculatePercentileForStat(otherAssistsPerRound, lowAssistsPerRound, highAssistsPerRound);
        const otherSupportDamagePerRoundPercentile = calculatePercentileForStat(otherSupportDamagePerRound, lowSupportDamagePerRound, highSupportDamagePerRound);

        const otherTotalPercentile = otherOpeningDuelsPerRoundPercentile + otherOpeningDuelSuccessPerRoundPercentile + otherDeathsTradedOutPercentile + otherAssistsPerRoundPercentile + otherSupportDamagePerRoundPercentile;
        allPercentiles.push(otherTotalPercentile);
    }

    return calculateTotalPercentile(allPercentiles, totalPercentile);
}

export function calculateOpeningPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    const openingDuelsPerRound = stats.odaR
    const openingDuelSuccess = stats.odr

    const lowOpeningDuelsPerRound = tierPlayerAverages.lowest["odaR"];
    const lowOpeningDuelSuccess = tierPlayerAverages.lowest["odr"];

    const highOpeningDuelsPerRound = tierPlayerAverages.highest["odaR"];
    const highOpeningDuelSuccess = tierPlayerAverages.highest["odr"];

    const openingDuelsPerRoundPercentile = calculatePercentileForStat(openingDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
    const openingDuelSuccessPercentile = calculatePercentileForStat(openingDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);

    const totalPercentile = openingDuelsPerRoundPercentile + openingDuelSuccessPercentile;
    const allPercentiles = [];
    allPercentiles.push(totalPercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherOpeningDuelsPerRound = otherStats.odaR
        const otherOpeningDuelSuccess = otherStats.odr

        const otherOpeningDuelsPerRoundPercentile = calculatePercentileForStat(otherOpeningDuelsPerRound, lowOpeningDuelsPerRound, highOpeningDuelsPerRound);
        const otherOpeningDuelSuccessPercentile = calculatePercentileForStat(otherOpeningDuelSuccess, lowOpeningDuelSuccess, highOpeningDuelSuccess);

        const otherTotalPercentile = otherOpeningDuelsPerRoundPercentile + otherOpeningDuelSuccessPercentile;
        allPercentiles.push(otherTotalPercentile);
    }

    return calculateTotalPercentile(allPercentiles, totalPercentile);
}

export function calculateSnipingPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    const awpKillsPerRound = stats.awpR;
    const lowAwpKillsPerRound = tierPlayerAverages.lowest["awpR"];
    const highAwpKillsPerRound = tierPlayerAverages.highest["awpR"];

    const awpKillsPerRoundPercentile = calculatePercentileForStat(awpKillsPerRound, lowAwpKillsPerRound, highAwpKillsPerRound);

    const allPercentiles = [];
    allPercentiles.push(awpKillsPerRoundPercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherAwpKillsPerRound = otherStats.awpR

        const otherAwpKillsPerRoundPercentile = calculatePercentileForStat(otherAwpKillsPerRound, lowAwpKillsPerRound, highAwpKillsPerRound);
        allPercentiles.push(otherAwpKillsPerRoundPercentile);
    }

    return calculateTotalPercentile(allPercentiles, awpKillsPerRoundPercentile);
}

export function calculateTradePercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    const trades = stats.tradesR;
    const lowTrades = tierPlayerAverages.lowest["tradesR"];
    const highTrades = tierPlayerAverages.highest["tradesR"];

    const tradePercentile = calculatePercentileForStat(trades, lowTrades, highTrades);

    const allPercentiles = [];
    allPercentiles.push(tradePercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherTrades = otherStats.tradesR

        const otherTradePercentile = calculatePercentileForStat(otherTrades, lowTrades, highTrades);
        allPercentiles.push(otherTradePercentile);
    }

    return calculateTotalPercentile(allPercentiles, tradePercentile);
}

export function calculateClutchPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    const clutch = stats.clutchR;
    const lowClutch = tierPlayerAverages.lowest["clutchR"];
    const highClutch = tierPlayerAverages.highest["clutchR"];

    const clutchPercentile = calculatePercentileForStat(clutch, lowClutch, highClutch);

    const allPercentiles = [];
    allPercentiles.push(clutchPercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherClutch = otherStats.clutchR

        const otherClutchPercentile = calculatePercentileForStat(otherClutch, lowClutch, highClutch);
        allPercentiles.push(otherClutchPercentile);
    }

    return calculateTotalPercentile(allPercentiles, clutchPercentile);
}

export function calculateUtilityPercentile(player: Player, stats: CscStats, players: Player[]) {
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })

    players = players.filter(p => p.tier.name == player.tier.name).filter(p => p.name != player.name);

    const utilDamage = stats.utilDmg;
    const util = stats.util;
    const flashes = stats.ef;
    const flashAssists = stats.fAssists;

    const lowUtilDamage = tierPlayerAverages.lowest["utilDmg"];
    const lowUtil = tierPlayerAverages.lowest["util"];
    const lowFlashes = tierPlayerAverages.lowest["ef"];
    const lowFlashAssists = tierPlayerAverages.lowest["fAssists"];

    const highUtilDamage = tierPlayerAverages.highest["utilDmg"];
    const highUtil = tierPlayerAverages.highest["util"];
    const highFlashes = tierPlayerAverages.highest["ef"];
    const highFlashAssists = tierPlayerAverages.highest["fAssists"];

    const utilDamagePercentile = calculatePercentileForStat(utilDamage, lowUtilDamage, highUtilDamage);
    const utilPercentile = calculatePercentileForStat(util, lowUtil, highUtil);
    const flashesPercentile = calculatePercentileForStat(flashes, lowFlashes, highFlashes);
    const flashAssistsPercentile = calculatePercentileForStat(flashAssists, lowFlashAssists, highFlashAssists);

    const totalPercentile = utilDamagePercentile + utilPercentile + flashesPercentile + flashAssistsPercentile;
    const allPercentiles = [];
    allPercentiles.push(totalPercentile);

    // get all other players total percentile
    for (let i in players) {
        const otherPlayer: Player = players[i];
        const otherStats = otherPlayer.stats;
        if (otherStats == null) continue;

        const otherUtilDamage = otherStats.utilDmg;
        const otherUtil = otherStats.util;
        const otherFlashes = otherStats.ef;
        const otherFlashAssists = otherStats.fAssists;

        const otherUtilDamagePercentile = calculatePercentileForStat(otherUtilDamage, lowUtilDamage, highUtilDamage);
        const otherUtilPercentile = calculatePercentileForStat(otherUtil, lowUtil, highUtil);
        const otherFlashesPercentile = calculatePercentileForStat(otherFlashes, lowFlashes, highFlashes);
        const otherFlashAssistsPercentile = calculatePercentileForStat(otherFlashAssists, lowFlashAssists, highFlashAssists);

        const otherTotalPercentile = otherUtilDamagePercentile + otherUtilPercentile + otherFlashesPercentile + otherFlashAssistsPercentile;
        allPercentiles.push(otherTotalPercentile);
    }

    return calculateTotalPercentile(allPercentiles, totalPercentile);
}