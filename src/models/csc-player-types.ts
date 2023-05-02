export type CscPlayersQuery = {
    data: Data;
}

export type Data = {
   players: CscPlayer[]
}

export type CscPlayer = {
    name: string,
    steam64Id: string,
    faceitName: string,
    mmr: number,
    avatarUrl: string,
    contractDuration: number,
    tier: CscTier,
    team: CscTeam,
    type: string,
}

export type CscTier = {
    name: string
}

export type CscTeam = {
    name: string
    franchise: CscFranchise
}

export type CscFranchise = {
    name: string,
    prefix: string,
}