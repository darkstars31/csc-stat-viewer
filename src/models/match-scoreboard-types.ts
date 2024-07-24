export interface MatchScoreboard {
	mapName: string;
	matchId: string;
	tier: string;
	teamStats: TeamStat[];
	matchStats: MatchStat[];
	rounds: Round[];
}

export interface TeamStat {
	name: string;
	score: number;
}

export interface MatchStat {
	name: string;
	kills: number;
	assists: number;
	deaths: number;
	hs: number;
	adr: number;
	kast: number;
	impactRating: number;
	rating: number;
	teamClanName: string;
	utilDmg: number;
	ef: number;
	cl_1: number;
	cl_2: number;
	cl_3: number;
	cl_4: number;
	cl_5: number;
}

export interface Round {
	winnerClanName: string;
	winnerENUM: number;
	endDueToBombEvent: boolean;
	winTeamDmg: number;
	defuser: string;
}
