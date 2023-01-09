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
    React.useEffect( () => {
        fetchCombinePlayerData();
    }, []);

    return null;
}