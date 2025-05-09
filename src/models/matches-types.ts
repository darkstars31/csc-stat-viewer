import { Team } from "./franchise-types";

export type Matches = {
	data: Data;
};

export type Data = {
	matches: Match[];
};

export type Match = {
	id: string;
	scheduledDate: Date;
	completedAt: Date;
	demoUrl: string;
	lobby: Lobby;
	matchDay: MatchDay;
	home: Home;
	away: Away;
	dathostServer: DathostServer;
	stats: Stat[];
};

export type Lobby = {
	id: string;
	mapBans: MapBan[];
};

export type MapBan = {
	map: string;
	number: number;
	team: Team;
};

export type Home = {
	franchise: Franchise;
	id: number;
	name: string;
	tier: {
		name: string;
	};
};
export type Away = {
	franchise: Franchise;
	id: number;
	name: string;
};

export type Franchise = {
	prefix: string;
	name: string;
	logo: Logo;
};

export type Logo = {
	url: string;
};

export type DathostServer = {
	connectString: string;
	port: number;
	gotv: number;
};

export type MatchDay = {
	number: string;
};

export type Stat = {
	homeScore: number;
	awayScore: number;
	mapName: string;
	mapNumber: number;
	winner: Winner;
};

export type Winner = {
	id: number;
	name: string;
};
