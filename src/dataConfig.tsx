
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