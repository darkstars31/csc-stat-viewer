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

    export const AwardsMappings: Record<string, string> = {
        "name": "Name",
        "gameCount": "Games Played",
        "rating": "Rating",
        "kr": "Ks/r",
        "adr": "ADR",
        "kast": "KAST",
        "odr": "Opening Duel (%)",
        "impact": "Impact",
        "adp": "ADP",
        "utilDmg": "Util Dmg",
        "ef": "EF",
        "fAssists": "FA",
        "util": "Util Thrown",
        "hs": "HS%",
        "awpR": "Awp Ks",
        "multiR": "Multi-Ks",
        "clutchR": "Clutch",
        "suppR": "Support",
        "suppXr": "Support DMG",
        "odaR": "ODA",
        "tradesR": "Trade Ks",
        "Xnade": "Nade DMG Eff",
        "tRatio": "Death Traded(%)",
        "savesR": "Saves",
        "twoK": "2Ks",
        "threeK": "3Ks",
        "fourK": "4Ks",
        "fiveK": "Aces",
        "cl_1": "1v1s",
        "cl_2": "1v2s",
        "cl_3": "1v3s",
        "cl_4": "1v4s",
        "cl_5": "1v5s",
        "rounds": "Rounds Played",
        "peak": "Peak Rating",
        "pit": "Pit Rating",
        "form": "Avg Rating from last 3 games",
        "consistency": "Consistency",
        "kills": "Ks",
        "assists": "Assists",
        "deaths": "Deaths",
      };
      export const AwardsDescriptions: Record<string, string> = {
        "name": "Name",
        "gameCount": "Games Played",
        "rating": "Rating",
        "kr": "Kills per Round",
        "adr": "Average Damage per Round",
        "kast": "Percentage of rounds that you either got a kill, assist, were traded, or survived.",
        "odr": "Opening Duel (%)",
        "impact": "Impact",
        "adp": "Average Death Placement",
        "utilDmg": "Util Dmg",
        "ef": "Enemies Flashed",
        "fAssists": "Flash Assists",
        "util": "Total Util Thrown",
        "hs": "Headshot (%)",
        "awpR": "Awp Kills Per Round",
        "multiR": "Each multikill is given a point value based on difficulty (2k = 1, 3k = 2, etc). These points are added together and divided by the amount of rounds played.",
        "clutchR": "Each clutch is given a point value based on difficulty (1v1 = 1, 1v2 = 2, etc). These points are added together and divided by the amount of rounds played.",
        "suppR": "The percentage of rounds that you had either an assist, a flash assist, or over 60 support damage.",
        "suppXr": "Support Damage Per Round",
        "odaR": "Open Duel Attempts Per Round",
        "tradesR": "Trade Kills Per Round",
        "Xnade": "The average amount of damage you deal per grenade you throw.",
        "tRatio": "Deaths Traded (%)",
        "savesR": "Saves Rounds",
        "twoK": "Total Rounds with 2Ks",
        "threeK": "Total 3Ks",
        "fourK": "Total 4Ks",
        "fiveK": "Total Aces",
        "cl_1": "Total 1v1 Clutches",
        "cl_2": "Total 1v2 Clutches",
        "cl_3": "Total 1v3 Clutches",
        "cl_4": "Total 1v4 Clutches",
        "cl_5": "Total 1v5 Clutches",
        "rounds": "Total Rounds Played",
        "peak": "Peak Rating",
        "pit": "Pit Rating",
        "form": "Avg Rating from last 3 games",
        "consistency": "Consistency",
        "kills": "Total Kills",
        "assists": "Total Assists",
        "deaths": "Total Deaths",
      };

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