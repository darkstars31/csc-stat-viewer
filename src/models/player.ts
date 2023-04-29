import { CscPlayer } from "./csc-player-types";
import { PlayerStats } from "./player-stats";

export type Player = 
    CscPlayer &
    {
        stats: PlayerStats | null
    }