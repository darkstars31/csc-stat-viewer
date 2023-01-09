import papa from "papaparse";
import { Player } from "../models";

export function fetchCombinePlayerData() {

    const cscSeason10CombineStatsGoogleSheetsId = "1IatVycM30WHbxHCHvtb2rk49impu7TAlMNgxReQb4Qo";
    window.combinePlayerRequest.isLoading = true;
    fetch(`https://docs.google.com/spreadsheets/d/${cscSeason10CombineStatsGoogleSheetsId}/gviz/tq?tqx=out:csv&tq`,
        { method: "GET", headers: { 'content-type': 'text/csv;charset=UTF-8'
        }})
        .then( response => response.text()
            .then( text => {
                    const playerJson = papa.parse<Player>(text, { header: true}).data;
                    window.combinePlayerRequest = {
                        data: playerJson,
                        isLoading: false,
                    }
                }
            ) 
        )
        .catch( err => console.info( err ))
}