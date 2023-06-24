import { CscPlayer } from "./csc-player-types";
import { CscStats } from "./csc-stats-types";

export type Player = 
    CscPlayer &
    {
        role?: string,
        stats: CscStats
    }