import papa from "papaparse";
import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const cscSeason10Stats = "1AKmIPSLS1kcmvMvptWXSVRtCZXe6lLZwzxkR_DrKvMU";
const sheetGid = "334898684"

const x = async () => await fetch(`https://docs.google.com/spreadsheets/d/${cscSeason10Stats}/gviz/tq?gid=${sheetGid}&tqx=out:csv&tq`,
    { method: "GET", headers: { 'content-type': 'text/csv;charset=UTF-8'}})
    .then( async response => {
        return papa.parse<Player>( await response.text(), { header: true, dynamicTyping: true}).data;
    } );

export function useFetchSeason10PlayerData(): UseQueryResult<Player[]> {
    return useQuery({ queryKey: ["season-stats", 10], queryFn: x, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}