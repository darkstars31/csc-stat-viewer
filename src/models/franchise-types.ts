export type FranchiseRequest = {
    data: Data;
}

export type Data = {
    franchises: Franchise[];
}

export type Franchise = {
    name:   string;
    prefix: string;
    logo:   Gm;
    gm:     Gm;
    agms:    Gm[] | null;
    teams:  Team[];
}

export type Gm = {
    name: string;
}

export type Team = {
    name:    string;
    tier: Tier;
    players: Player[];
}

export type Player = {
    name: string;
    mmr: number;
    discordId: number;
    steam64Id: string;
}

export type Tier = {
    name: string;
    mmrCap: number;
}