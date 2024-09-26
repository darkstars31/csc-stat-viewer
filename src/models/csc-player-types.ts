import { PlayerTypes } from "../common/utils/player-utils";

export type CscPlayersQuery = {
	data: Data;
};

export type Data = {
	players: CscPlayer[];
};

export type CscPlayer = {
	id: string;
	name: string;
	avatarUrl: string;
	steam64Id: string;
	faceitName?: string;
	discordId?: string;
	mmr?: number;
	contractDuration?: number;
	tier: CscTier;
	team?: CscTeam;
	type?: PlayerTypes;
};

export type CscTier = {
	name: string;
};

export type CscTeam = {
	name: string;
	franchise: CscFranchise;
};

export type CscFranchise = {
	name: string;
	prefix: string;
};
