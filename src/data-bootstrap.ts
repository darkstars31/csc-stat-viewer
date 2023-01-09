import * as React from "react";
import { Player } from "./models";
import { fetchCombinePlayerData } from "./dao/combinePlayerDao";

declare global {
    interface Window { combinePlayerRequest: {
        data: Player[],
        isLoading: boolean,
    }
 }
}
window.combinePlayerRequest = {
    data: [],
    isLoading: false,
};

export const DataBootStrap = () => {
    const [ runs, setRuns ] = React.useState(0);
    React.useEffect( () => {
        fetchCombinePlayerData();
        setRuns( prev => prev + 1);
    }, [window.combinePlayerRequest.data.length === 0 || !window.combinePlayerRequest.isLoading]);
    console.info(`Runs ${runs}`);

    return null;
}