export type Matches = {
    data: Data;
}

export type Data = {
    matches: Match[];
}

export type Match = {
    demoUrl:  null;
    matchDay: MatchDay;
    home:     Away;
    away:     Away;
    stats:    any[];
}

export type Away = {
    name: string;
}

export type MatchDay = {
    id:            string;
    number:        string;
    scheduledDate: Date;
}
