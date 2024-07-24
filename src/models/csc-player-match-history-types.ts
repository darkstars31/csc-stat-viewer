export type CscPlayerMatchHistoryQuery = {
	data: Data;
};

export type Data = {
	findManyMatch: Match[];
};

export type Match = {
	matchId: number;
	mapName: string;
	totalRounds: number;
	matchType: string;
	teamStats: TeamStats[];
	matchStats: MatchStats[];
	createdAt: string;
	tier: string;
};

export type TeamStats = {
	name: string;
};

export type MatchStats = {
	name: string;
	kills: number;
	assists: number;
	deaths: number;
	damage: number;
	adr: number;
	hs: number;
	FAss: number;
	teamENUM: string;
	teamClanName: string;
	rating: number;
	RF: number;
	RA: number;
	utilDmg: number;
	ok: number;
	ol: number;
	cl_1: number;
	cl_2: number;
	cl_3: number;
	cl_4: number;
	cl_5: number;
};
