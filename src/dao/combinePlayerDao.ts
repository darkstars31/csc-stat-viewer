import papa from "papaparse";
import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const cscSeason10CombineStatsGoogleSheetsId = "1IatVycM30WHbxHCHvtb2rk49impu7TAlMNgxReQb4Qo";

const fetchPlayerCombineData = async () => await fetch(`https://docs.google.com/spreadsheets/d/${cscSeason10CombineStatsGoogleSheetsId}/gviz/tq?tqx=out:csv&tq`,
    { method: "GET", headers: { 'content-type': 'text/csv;charset=UTF-8'}})
    .then( async response => {
        return papa.parse<Player>( await response.text(), { header: true, dynamicTyping: true}).data;
    } );

export function useFetchCombinePlayerData(): UseQueryResult<Player[]> {
    return useQuery({ queryKey: ["combine-stats", 10], queryFn: fetchPlayerCombineData, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}