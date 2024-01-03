export const appConfig = {
    endpoints: {
        cscGraphQL: {
            core: "https://core.csconfederation.com/graphql",
            stats: "https://stats.csconfederation.com/graphql",
        },
        analytikill: "https://tonysanti.com/prx/csc-stat-api",
        cloudfrontCache: 'https://d286fmnshh73ml.cloudfront.net/csc_api_stats',
        githubRepository: 'https://api.github.com/repos/darkstars31/csc-stat-viewer',

    }
};  


const googleSheetsUrl = ( spreadsheetId: string, spreadsheetGuid?: number ) => {
 const queryParams = spreadsheetGuid ? `gid=${spreadsheetGuid}&tqx=out:csv&tq` : "tqx=out:csv&tq";
 return`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${queryParams}`
}

export type DataConfiguration = {
    season: number,
    name: string,
    spreadsheetUrl: string,
}

export const dataConfiguration = [
    // {
    //     season: 13,
    //     seasonStartDate: "2024-01-11",
    //     seasonEndDate: "2024-04-30",
    //     name: "Season 13",
    //     spreadsheetUrl: googleSheetsUrl("18qgpc4NdPNg4I5Q9lmzaEgUYyxHtq25JKZfTxiQg_lc",334898684),
    // },
    {
        season: 13,
        seasonStartDate: "2024-01-11",
        seasonEndDate: "2024-04-30",
        name: "Season 13 (Combines)",
        spreadsheetUrl: googleSheetsUrl("18qgpc4NdPNg4I5Q9lmzaEgUYyxHtq25JKZfTxiQg_lc",334898684),
    },
    {
        season: 12,
        seasonStartDate: "2023-09-11",
        seasonEndDate: "2023-11-30",
        name: "Season 12",
        spreadsheetUrl: googleSheetsUrl("18qgpc4NdPNg4I5Q9lmzaEgUYyxHtq25JKZfTxiQg_lc",334898684),
    },
    {
        season: 11,
        seasonEndDate: "2023-08-01",
        name: "Season 11",
        spreadsheetUrl: googleSheetsUrl("18qgpc4NdPNg4I5Q9lmzaEgUYyxHtq25JKZfTxiQg_lc",334898684),
    },
    {
        season: 11,
        name: "Season 11 (Combines)",
        spreadsheetUrl: googleSheetsUrl("16sdOBw-0fjwIZAvY7CT_r6O8Dji5mb6LpA7xcgwp1DI",334898684),
    },
    {
        season: 11,
        name: "Season 11 (Combines V2)",
        spreadsheetUrl: googleSheetsUrl("16sdOBw-0fjwIZAvY7CT_r6O8Dji5mb6LpA7xcgwp1DI",302214624),
    },
    {
        season: 10,
        name: "Season 10",
        spreadsheetUrl: googleSheetsUrl("1AKmIPSLS1kcmvMvptWXSVRtCZXe6lLZwzxkR_DrKvMU", 334898684),
    },
    {
        season: 10,
        name: "Season 10 (Combines)",
        spreadsheetUrl: googleSheetsUrl("1IatVycM30WHbxHCHvtb2rk49impu7TAlMNgxReQb4Qo"),
    },
    {
        season: 9,
        name: "Season 9",
        spreadsheetUrl: googleSheetsUrl("1u-MUrCbqslMKU3JuzrGfu2UNSDWKQ_z9iqYxU0Pvidg", 334898684),
    },
    {
        season: 8,
        name: "Season 8",
        spreadsheetUrl: googleSheetsUrl("1NLdWBucFOMOmnSzvl66kK5R-EPSMjx47XEv_ES0pcFA", 334898684),
    },
    {
        season: 7,
        name: "Season 7",
        spreadsheetUrl: googleSheetsUrl("1jdM-77RxdDDrs07LxeTxIONhuyf8HTC5pHAZB2thPcE", 334898684),
    }
]