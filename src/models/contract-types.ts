export type ContractsQuery = {
	data: Data;
};

export type Data = {
	franchises: Franchise[];
	tiers: TierElement[];
	fas: Fa[];
};

export type Fa = {
	id: string;
	name: string;
	type: FaType;
	mmr: number;
	tier: GmClass;
	__typename: FaTypename;
};

export enum FaTypename {
	Player = "Player",
	Tiers = "Tiers",
}

export type GmClass = {
	id: string;
	name: string;
	__typename: FaTypename;
};

export enum FaType {
	FreeAgent = "FREE_AGENT",
	PermanentFreeAgent = "PERMANENT_FREE_AGENT",
}

export type Franchise = {
	id: string;
	active: boolean;
	name: string;
	gm: GmClass;
	agm: GmClass | null;
	teams: Team[];
	__typename: FranchiseTypename;
};

export enum FranchiseTypename {
	Franchise = "Franchise",
}

export type Team = {
	id: string;
	name: string;
	tier: GmClass;
	captain: Captain | null;
	players: Player[];
	__typename: TeamTypename;
};

export enum TeamTypename {
	Teams = "Teams",
}

export type Captain = {
	name: string;
	__typename: FaTypename;
};

export type Player = {
	id: string;
	name: string;
	type: PlayerType;
	mmr: number;
	contractDuration: number;
	tier: Captain;
	__typename: FaTypename;
};

export enum PlayerType {
	FreeAgent = "FREE_AGENT",
	InactiveReserve = "INACTIVE_RESERVE",
	Signed = "SIGNED",
	SignedPromoted = "SIGNED_PROMOTED",
}

export type TierElement = {
	name: string;
	color: null | string;
	mmrCap: number;
	__typename: FaTypename;
};
