import { CscStats } from "../../models/csc-stats-types";
import { Player } from "../../models/player";
import { getTop10PlayersInTier3GP } from "./player-utils";

export const awardProperties = [
    'hs',
    'ef',
    'kills',
    'twoK',
    'threeK',
    'fourK',
    'fiveK',
    'cl_1',
    'cl_2',
    'cl_3',
    'cl_4',
    'cl_5',
    'clutchR',
    'impact',
    'assists',
    'adr',
    'fAssists',
    'tradesR',
    'Xnade',
    'suppR',
    'suppXr',
    'kast',
    'utilDmg',
    'util',
    ] as (keyof CscStats)[]; // add properties here

  /* AWARDS logic */
export const isCurrentPlayerNumberOneForProperty = (
    currentPlayer: Player,
    allPlayers: Player[],
    property: keyof CscStats
): boolean => {
    if (currentPlayer.stats[property] === 0) {
        return false;
    }
    const top10Players = getTop10PlayersInTier3GP(currentPlayer, allPlayers, property);
    const numberOnePlayer = top10Players[0];
    return numberOnePlayer && numberOnePlayer.name === currentPlayer.name;
};

export const isCurrentPlayerInTop10ForProperty = (
    currentPlayer: Player,
    allPlayers: Player[],
    property: keyof CscStats
): boolean => {
    if (currentPlayer.stats[property] === 0) {
        return false;
    }
    const top10Players = getTop10PlayersInTier3GP(currentPlayer, allPlayers, property);
    return top10Players.some(p => p.name === currentPlayer.name);
};
export const propertiesCurrentPlayerIsInTop10For = (
    currentPlayer: Player,
    allPlayers: Player[],
    properties: (keyof CscStats)[]
): (keyof CscStats)[] => {
    return properties.filter((property) => isCurrentPlayerInTop10ForProperty(currentPlayer, allPlayers, property));
};

export const propertiesCurrentPlayerIsNumberOneFor = (
    currentPlayer: Player,
    allPlayers: Player[],
    properties: (keyof CscStats)[]
): (keyof CscStats)[] => {
    return properties.filter((property) => isCurrentPlayerNumberOneForProperty(currentPlayer, allPlayers, property));
};