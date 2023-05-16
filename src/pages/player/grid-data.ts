import {PlayerStats} from "../../models";
import {PlayerMappings} from "../../common/utils/player-utils";

export const getGridData = (currentPlayerStats: PlayerStats) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
        Name,
        Tier,
        Team,
        Rating,
        Steam,
        ppR,
        GP,
        Kills,
        Assists,
        Deaths,
        "2k": twoKills,
        "3k": threeKills,
        "4k": fourKills,
        "5k": aces,
        HS,
        KAST,
        ADR,
        "K/R": avgKillsPerRound,
        "CT #": ctRating,
        "T #": tRating,
        "1v1": clutch1v1,
        "1v2": clutch1v2,
        "1v3": clutch1v3,
        "1v4": clutch1v4,
        "1v5": clutch1v5,
        Peak,
        Pit,
        Form,
        "CONCY": ratingConsistency,
        EF,
        "EF/F": enemiesFlashedPerFlash,
        "Blind/EF": enemyBlindTime,
        F_Assists,
        UD,
        "X/nade": nadeDmgPerFrag,
        Util: utilThrownPerMatch,
        ODR: openDuelPercentage,
        "oda/R": openDuelsPerRound,
        "entries/R": TsidedEntryFragsPerRound,
        "ea/R": avgRoundsOpenDuelOnTside,
        "trades/R": tradesPerRound,
        "saves/R": savesPerRound,
        RWK,
        ADP,
        ctADP,
        tADP,
        Impact,
        IWR,
        KPA,
        "multi/R": multiKillRound,
        "clutch/R": clutchPerRound,
        SuppR,
        SuppXr,
        SRate,
        TRatio,
        ATD,
        "lurks/tR": lurksPerTsideRound,
        "wlp/L": lurkPointsEarned,
        "AWP/ctr": awpKillsCTside,
        Rounds,
        "MIP/r": mvpRounds,
        "K/ctr": killsCTside,
        Xdiff,
        "awp/R": awpKillsPerRound,
        ...playerRest
    } = currentPlayerStats;

    return [
        [
            {name: "Kills  /  Assists  /  Deaths", value: `${Kills} / ${Assists} / ${Deaths}`, rowIndex: 0},
            {name: PlayerMappings["HS"], value: `${HS}%`, rowIndex: 1},
            {name: "K/D Ratio", value: (Kills / Deaths).toFixed(2), rowIndex: 0},
            {name: PlayerMappings["ADR"], value: `${ADR}`, rowIndex: 1},
            {name: PlayerMappings["KPA"], value: `${KPA}`, rowIndex: 0},
            {name: PlayerMappings["KAST"], value: `${(KAST * 100).toFixed(2).replace(/[.,]00$/, "")}%`, rowIndex: 1},
        ],
        [
            {name: PlayerMappings["K/R"], value: `${avgKillsPerRound}`, rowIndex: 0},
            {name: PlayerMappings["SRate"], value: `${(SRate * 100).toFixed(0)}%`, rowIndex: 1},
            {name: PlayerMappings["ATD"], value: `${ATD}s`, rowIndex: 0},
            {name: PlayerMappings["multi/R"], value: `${multiKillRound}`, rowIndex: 1},
            {name: PlayerMappings["clutch/R"], value: `${clutchPerRound}`, rowIndex: 0},
            {
                name: "2k  /  3k  /  4k  /  Ace",
                value: `${twoKills}  /  ${threeKills}  /  ${fourKills}  /  ${aces}`,
                rowIndex: 1
            },
        ],
        [
            {name: PlayerMappings["ODR"], value: `${(openDuelPercentage * 100).toFixed(0)}%`, rowIndex: 0},
            {name: "Entry Frags T-side per Round", value: `${TsidedEntryFragsPerRound}`, rowIndex: 1},
            {name: PlayerMappings["TRatio"], value: `${(TRatio * 100).toFixed(0)}%`, rowIndex: 0},
            {name: PlayerMappings["saves/R"], value: `${savesPerRound}`, rowIndex: 1},
        ],
        [
            {name: PlayerMappings["oda/R"], value: `${openDuelsPerRound}`, rowIndex: 0},
            {name: "Average Opening Duel T-side", value: `${avgRoundsOpenDuelOnTside}`, rowIndex: 1},
            {name: PlayerMappings["trades/R"], value: `${tradesPerRound}`, rowIndex: 0},
            {name: PlayerMappings["RWK"], value: `${(RWK * 100).toFixed(0)}%`, rowIndex: 1},
        ],
        [
            {name: PlayerMappings["Util"], value: `${utilThrownPerMatch}`, rowIndex: 0},
            {name: PlayerMappings["UD"], value: `${UD}`, rowIndex: 1},
            {name: PlayerMappings["X/nade"], value: `${nadeDmgPerFrag}`, rowIndex: 0},
        ],
        [
            {name: PlayerMappings["Blind/EF"], value: `${enemyBlindTime}s`, rowIndex: 0},
            {name: PlayerMappings["EF/F"], value: `${enemiesFlashedPerFlash}`, rowIndex: 1},
            {name: PlayerMappings["F_Assists"], value: `${F_Assists}`, rowIndex: 0},
            {name: PlayerMappings["EF"], value: `${EF}`, rowIndex: 1}
        ],
        [
            {name: PlayerMappings["SuppR"], value: `${SuppR}`, rowIndex: 0},
            {name: PlayerMappings["lurks/tR"], value: `${lurksPerTsideRound}`, rowIndex: 1},
            {name: PlayerMappings["AWP/ctr"], value: `${awpKillsCTside}`, rowIndex: 0},
        ],
        [
            {name: PlayerMappings["SuppXr"], value: `${SuppXr}`, rowIndex: 0},
            {name: PlayerMappings["wlp/L"], value: `${lurkPointsEarned}`, rowIndex: 1},
            {name: PlayerMappings["AWP/ctr"], value: `${awpKillsCTside}`, rowIndex: 0},
        ],
        [
            {name: PlayerMappings["Rounds"], value: `${Rounds}`, rowIndex: 0},
            {name: PlayerMappings["ADP"], value: `${ADP}`, rowIndex: 1},
            {name: PlayerMappings["ctADP"], value: `${ctADP}`, rowIndex: 0},
            {
                name: "1v1/2/3/4/5 Clutch Rounds",
                value: `${clutch1v1} / ${clutch1v2} / ${clutch1v3} / ${clutch1v4} / ${clutch1v5}`,
                rowIndex: 1
            },
        ],
        [
            {name: PlayerMappings["MIP/r"], value: `${mvpRounds}`, rowIndex: 0},
            {name: PlayerMappings["K/ctr"], value: `${killsCTside}`, rowIndex: 1},
            {name: PlayerMappings["tADP"], value: `${tADP}`, rowIndex: 0},
            {name: PlayerMappings["Xdiff"], value: `${Xdiff}`, rowIndex: 1},
        ],
    ];
}