import { CscPlayer } from "./csc-player-types";
import { CscStats } from "./csc-stats-types";

export type Player = 
    CscPlayer &
    {
        role?: string,
        hltvTwoPointO: number | undefined,
        stats: CscStats
        statsOutOfTier: {
            stats : CscStats | undefined,
            tier: string,
        }[]
    }