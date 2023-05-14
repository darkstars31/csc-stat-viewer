import { PlayerStats } from "../../models";
import { getTop10PlayersInTier3GP } from "./player-utils";

export const awardProperties = [
    'HS',
    'EF',
    'Kills',
    '2k',
    '3k',
    '4k',
    '5k',
    '1v1',
    '1v2',
    '1v3',
    '1v4',
    '1v5',
    'multi/R',
    'Impact',
    'Assists',
    'ADR',
    'F_Assists',
    'trades/R',
    'X/nade',
    'SuppR',
    'SuppXr',
    'KAST',
    'UD',
    'Util',
    'clutch/R',
    'entries/R',
    'IWR',
    'AWP/ctr',
    'wlp/L'] as (keyof PlayerStats)[]; // add properties here

  /* AWARDS logic */
export const isCurrentPlayerNumberOneForProperty = (
    currentPlayer: PlayerStats,
    allPlayers: PlayerStats[],
    property: keyof PlayerStats
): boolean => {
    if (currentPlayer[property] === 0) {
        return false;
    }
    const top10Players = getTop10PlayersInTier3GP(currentPlayer, allPlayers, property);
    const numberOnePlayer = top10Players[0];
    return numberOnePlayer && numberOnePlayer.Name === currentPlayer.Name;
};

export const isCurrentPlayerInTop10ForProperty = (
    currentPlayer: PlayerStats,
    allPlayers: PlayerStats[],
    property: keyof PlayerStats
): boolean => {
    if (currentPlayer[property] === 0) {
        return false;
    }
    const top10Players = getTop10PlayersInTier3GP(currentPlayer, allPlayers, property);
    return top10Players.some(p => p.Name === currentPlayer.Name);
};
export const propertiesCurrentPlayerIsInTop10For = (
    currentPlayer: PlayerStats,
    allPlayers: PlayerStats[],
    properties: (keyof PlayerStats)[]
): (keyof PlayerStats)[] => {
    return properties.filter((property) => isCurrentPlayerInTop10ForProperty(currentPlayer, allPlayers, property));
};

export const propertiesCurrentPlayerIsNumberOneFor = (
    currentPlayer: PlayerStats,
    allPlayers: PlayerStats[],
    properties: (keyof PlayerStats)[]
): (keyof PlayerStats)[] => {
    return properties.filter((property) => isCurrentPlayerNumberOneForProperty(currentPlayer, allPlayers, property));
};