export type ConferencesQuery = {
    data: Data;
}

export type Data = {
    season: Season;
}

export type Season = {
    standings: Standing[];
}

export type Standing = {
    tier:      Tier;
    divisions: Division[];
}

export type Division = {
    name:  Name;
    teams: Team[];
}

export enum Name {
    Froggers = "Froggers",
    Kermits = "Kermits",
}

export type Team = {
    team: Tier;
}

export type Tier = {
    name: string;
}