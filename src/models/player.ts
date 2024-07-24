import { CscPlayer } from "./csc-player-types";
import { CscStats } from "./csc-stats-types";
import { ExtendedStats } from "./extended-stats";

export type Player = CscPlayer & {
	role?: string;
	hltvTwoPointO: number | undefined;
	stats: CscStats;
	extendedStats: ExtendedStats;
	statsOutOfTier:
		| {
				stats: CscStats | undefined;
				tier: string;
		  }[]
		| null
		| undefined;
};
