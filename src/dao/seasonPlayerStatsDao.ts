import papa from "papaparse";
import { Player } from "../models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { type DataConfiguration } from "../dataConfig";

const getData = async ( seasonConfig: DataConfiguration ) => await fetch(`${seasonConfig.spreadsheetUrl}`,
    { method: "GET", headers: { 'content-type': 'text/csv;charset=UTF-8'}})
    .then( async response => {
        return papa.parse<Player>( await response.text(), { header: true, dynamicTyping: true}).data;
    } );

export function useFetchSeasonData( seasonConfig: DataConfiguration ): UseQueryResult<Player[]> {
    return useQuery(
        ["season", seasonConfig.name], 
        () => getData( seasonConfig ), 
        {
            staleTime: 1000 * 60 * 60, // 1 second * 60 * 60 = 1 hour
            onError: () => {},
        }
    );
}