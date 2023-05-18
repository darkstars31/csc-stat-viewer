import * as React from "react";

const DEFAULT_STORE_NAME = 'jsonStore';

export function useLocalStorage() {
    const [ storedValues, setStoredValues ] = React.useState<Record<string,unknown>>({});

    React.useEffect( () => {
        if( typeof localStorage.getItem(DEFAULT_STORE_NAME) !== "string" ){
            localStorage.setItem(DEFAULT_STORE_NAME, JSON.stringify({}));
        }
    },[]);

    React.useEffect( () => {
        const localStorageValues = localStorage.getItem(DEFAULT_STORE_NAME);
        if( localStorageValues ) {
            const values = JSON.parse(localStorageValues);
            setStoredValues( values );
        }
    }, [ storedValues ]);

    const setItem = (key: string, value? : any ) => {
        const localStorageValues = localStorage.getItem(DEFAULT_STORE_NAME);
        const storedValues = JSON.parse(localStorageValues ?? "{}");
        const newStoredValues = { ...storedValues, [key]: value};
        localStorage.setItem('jsonStore', JSON.stringify(newStoredValues));
        setStoredValues(newStoredValues);
    }

    const removeItem =( key: string ) => {
        const localStorageValues = localStorage.getItem(DEFAULT_STORE_NAME);
        const storedValues = JSON.parse(localStorageValues ?? "{}");
        delete storedValues[key];
        const newStoredValues = { ...storedValues};
        localStorage.setItem('jsonStore', { ...storedValues});
        setStoredValues(newStoredValues);
    }

    const getItem = ( key: string) => storedValues[key as keyof {}];
    
    return {
        storedValues,
        setItem,
        removeItem,
        getItem,
    } ;
}