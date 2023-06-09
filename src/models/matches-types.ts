export type Matches = {
    data: Data;
}

export type Data = {
    matches: Match[];
}

export type Match = {
    id:            string;
    scheduledDate: Date;
    completedAt:   Date;
    demoUrl:       string;
    matchDay:      MatchDay;
    home:          Away;
    away:          Away;
    dathostServer: DathostServer;
    stats:         Stat[];
}

export type Away = {
    franchise: Franchise;
    name:      string;
}

export type Franchise = {
    prefix: string;
    logo:   Logo;
}

export type Logo = {
    url: string;
}

export type DathostServer = {
    connectString: string;
    port:          number;
    gotv:          number;
}

export type MatchDay = {
    number: string;
}

export type Stat = {
    homeScore: number;
    awayScore: number;
    mapName:   string;
    mapNumber: number;
    winner:    Winner;
}

export type Winner = {
    name: string;
}
