
export type MatchHistoryPlayerStat = {
    csc_match_id?: string,
    match_uuid: string,
    Team: string,
    steam: string,
    Name: string,
    Map: string,
    Rating: number,
    Kills: number,
    Assists: number,
    Deaths: number,
    ADR: number,
    F_Ass: number,
    HS: number,
    RF: number,
    RA: number,
    Match_Match_Player_Stat_match_uuidToMatch: {
        type: string,
        server: string,
        matchStartTime: string,
        
    }
}

export type MatchHistory = {
    csc_match_id?: string,
    match_uuid: string,
    server?: string,
    matchStartTime?: string,
    type: string,
    map: string,
    Match_Player_Stat_Match_Player_Stat_match_uuidToMatch: MatchHistoryPlayerStat[],
}