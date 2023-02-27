import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchContractsGraph = async () => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "Contract",
            "query": "query Contract {\n  franchises {\n    id\n    active\n    name\n    gm {\n      id\n      name\n      __typename\n    }\n    agm {\n      id\n      name\n      __typename\n    }\n    teams {\n      id\n      name\n      tier {\n        id\n        name\n        __typename\n      }\n      captain {\n        name\n        __typename\n      }\n      players {\n        id\n        name\n        type\n        mmr\n        contractDuration\n        tier {\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tiers {\n    name\n    color\n    mmrCap\n    __typename\n  }\n  fas {\n    id\n    name\n    type\n    mmr\n    tier {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}",
            "variables": {}      
        })
    })
    .then( async response => {
        console.info( response );
        return response;
    } );

export function useFetchContractGraph(): UseQueryResult<unknown> {
    return useQuery({ queryKey: ["contracts-graph"], queryFn: fetchContractsGraph, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}

const fetchSchemaIntrospection = async () => await fetch(`https://core.csconfederation.com/graphql`,
    { method: "POST", 
        body: JSON.stringify({
            "operationName": "Contract",
            "query": "query Contract {\n  franchises {\n    id\n    active\n    name\n    gm {\n      id\n      name\n      __typename\n    }\n    agm {\n      id\n      name\n      __typename\n    }\n    teams {\n      id\n      name\n      tier {\n        id\n        name\n        __typename\n      }\n      captain {\n        name\n        __typename\n      }\n      players {\n        id\n        name\n        type\n        mmr\n        contractDuration\n        tier {\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tiers {\n    name\n    color\n    mmrCap\n    __typename\n  }\n  fas {\n    id\n    name\n    type\n    mmr\n    tier {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n}",
            "variables": {}      
        })
    })
    .then( async response => {
        console.info( response );
        return response;
    } );

export function useSchemaIntrospection(): UseQueryResult<unknown> {
    return useQuery({ queryKey: ["graph-introspection"], queryFn: fetchSchemaIntrospection, staleTime: 1000 * 60 * 60}); // 1 second * 60 * 60 = 1 hour
}