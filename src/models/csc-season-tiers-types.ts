export type CscLatestSeason = {
    data: {
        latestActiveSeason: {
            number: number,
            league: {
                leagueTiers: CscTier[]
            }
        }
    }
}

type CscTier = {
    tier: {
        name: string
        mmrCap: number
        color: string
        mmrMin: number
        mmrMax: number
    }
}