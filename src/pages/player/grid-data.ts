import {PlayerMappings} from "../../common/utils/player-utils";
import { CscStats } from "../../models/csc-stats-types";

export const getGridData = (currentStats: CscStats) => {

    const {  
        rating,
        rounds,
        // ppR,
        gameCount,
        kills,
        assists,
        deaths,
        "twoK": twoKills,
        "threeK": threeKills,
        "fourK": fourKills,
        "fiveK": aces,
        hs,
        kast,
        adr,
        kr: avgKillsPerRound,
        // "CT #": ctRating,
        // "T #": tRating,
        "cl_1": clutch1v1,
        "cl_2": clutch1v2,
        "cl_3": clutch1v3,
        "cl_4": clutch1v4,
        "cl_5": clutch1v5,
        peak,
        pit,
        form,
        consistency: ratingConsistency,
        ef,
        // "EF/F": enemiesFlashedPerFlash,
        // "Blind/EF": enemyBlindTime,
        fAssists,
        utilDmg,
        // "X/nade": nadeDmgPerFrag,
        util: utilThrownPerMatch,
        odr: openDuelPercentage,
        odaR: openDuelsPerRound,
        // "entries/R": TsidedEntryFragsPerRound,
        // "ea/R": avgRoundsOpenDuelOnTside,
        "tradesR": tradesPerRound,
        "savesR": savesPerRound,
        // RWK,
        adp,
        // ctADP,
        // tADP,
        impact,
        // IWR,
        // KPA,
        "multiR": multiKillRound,
        "clutchR": clutchPerRound,
        suppR,
        suppXR,
        saveRate,
        tRatio,
        // ATD,
        // "lurks/tR": lurksPerTsideRound,
        // "wlp/L": lurkPointsEarned,
        // "AWP/ctr": awpKillsCTside,
        // Rounds,
        // "MIP/r": mvpRounds,
        // "K/ctr": killsCTside,
        // awpR: awpKillsPerRound,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...playerRest
    } = currentStats as CscStats;

    return [
        [
            {name: "Kills  /  Assists  /  Deaths", value: `${kills} / ${assists} / ${deaths}`, rowIndex: 0},
            {name: PlayerMappings["hs"], value: `${hs}%`, rowIndex: 1},
            {name: "K/D Ratio", value: (kills / deaths).toFixed(2), rowIndex: 0},
            {name: PlayerMappings["adr"], value: `${adr.toFixed(2)}`, rowIndex: 1},
            // {name: PlayerMappings["KPA"], value: `${KPA}`, rowIndex: 0},
            {name: PlayerMappings["kast"], value: `${(kast * 100).toFixed(2).replace(/[.,]00$/, "")}%`, rowIndex: 1},
        ],
        [
            {name: PlayerMappings["kr"], value: `${avgKillsPerRound.toFixed(2)}`, rowIndex: 0},
            {name: PlayerMappings["sRate"], value: `${(savesPerRound*100).toFixed(2)}%`, rowIndex: 1},
            // {name: PlayerMappings["ATD"], value: `${ATD}s`, rowIndex: 0},
            {name: PlayerMappings["multiR"], value: `${multiKillRound.toFixed(2)}`, rowIndex: 1},
            {name: PlayerMappings["clutchR"], value: `${(clutchPerRound*100).toFixed(2)}%`, rowIndex: 0},
            {
                name: "2k  /  3k  /  4k  /  Ace",
                value: `${twoKills}  /  ${threeKills}  /  ${fourKills}  /  ${aces}`,
                rowIndex: 1
            },
        ],
        [
            {name: PlayerMappings["odr"], value: `${(openDuelPercentage * 100).toFixed(0)}%`, rowIndex: 0},
            // {name: "Entry Frags T-side per Round", value: `${TsidedEntryFragsPerRound}`, rowIndex: 1},
            {name: PlayerMappings["tRatio"], value: `${(tRatio * 100).toFixed(0)}%`, rowIndex: 0},
            {name: PlayerMappings["savesR"], value: `${savesPerRound.toFixed(2)}`, rowIndex: 1},
        ],
        [
            {name: PlayerMappings["odaR"], value: `${openDuelsPerRound.toFixed(2)}`, rowIndex: 0},
            // {name: "Average Opening Duel T-side", value: `${avgRoundsOpenDuelOnTside}`, rowIndex: 1},
            {name: PlayerMappings["tradesR"], value: `${tradesPerRound.toFixed(2)}`, rowIndex: 0},
            // {name: PlayerMappings["RWK"], value: `${(RWK * 100).toFixed(0)}%`, rowIndex: 1},
        ],
        [
            {name: PlayerMappings["util"], value: `${utilThrownPerMatch}`, rowIndex: 0},
            {name: PlayerMappings["utilDmg"], value: `${utilDmg.toFixed(2)}`, rowIndex: 1},
            // {name: PlayerMappings["X/nade"], value: `${nadeDmgPerFrag}`, rowIndex: 0},

        ],
        [
            // {name: PlayerMappings["Blind/EF"], value: `${enemyBlindTime}s`, rowIndex: 0},
            // {name: PlayerMappings["EF/F"], value: `${enemiesFlashedPerFlash}`, rowIndex: 1},
            {name: PlayerMappings["fAssists"], value: `${fAssists.toFixed(2)}`, rowIndex: 0},
            {name: PlayerMappings["ef"], value: `${ef.toFixed(2)}`, rowIndex: 1}
        ],
        [
            {name: PlayerMappings["suppR"], value: `${suppR.toFixed(2)}`, rowIndex: 0},
            // {name: PlayerMappings["lurks/tR"], value: `${lurksPerTsideRound}`, rowIndex: 1},
            // {name: PlayerMappings["AWP/ctr"], value: `${awpKillsCTside}`, rowIndex: 0},
        ],
        [
            {name: PlayerMappings["suppXR"], value: `${suppXR.toFixed(2)}`, rowIndex: 0},
            // {name: PlayerMappings["wlp/L"], value: `${lurkPointsEarned}`, rowIndex: 1},
            // {name: PlayerMappings["AWP/ctr"], value: `${awpKillsCTside}`, rowIndex: 0},
        ],
        [
            {name: PlayerMappings["rounds"], value: `${rounds}`, rowIndex: 0},
            {name: PlayerMappings["adp"], value: `${adp.toFixed(2)}`, rowIndex: 1},
            // {name: PlayerMappings["ctADP"], value: `${ctADP}`, rowIndex: 0},
        ],
        [
            {
                name: "1v1/2/3/4/5 Clutch Rounds",
                value: `${clutch1v1} / ${clutch1v2} / ${clutch1v3} / ${clutch1v4} / ${clutch1v5}`,
                rowIndex: 1
            },
            // {name: PlayerMappings["MIP/r"], value: `${mvpRounds}`, rowIndex: 0},
            // {name: PlayerMappings["K/ctr"], value: `${killsCTside}`, rowIndex: 1},
            // {name: PlayerMappings["tADP"], value: `${tADP}`, rowIndex: 0},
            // {name: PlayerMappings["Xdiff"], value: `${Xdiff}`, rowIndex: 1},
        ],
    ];
}