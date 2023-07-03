import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";

export type RepoResponse = {
    name: string,
    updated_at: string,
    stargazer_count: number,
    watchers_count: number,
}

export type StarGazerResponse = {
    "avatar_url": string,
    "login": string,
}

export type ContributorsResponse = {
    "login": string,
    "avatar_url": string,
    html_url: string,
}

const getRepoData = async ( url: string ) => await fetch(url,
    { method: "GET", headers: { 'content-type': 'text/csv;charset=UTF-8'}})
    .then( async response => {
        return response.json();
    } );

export function useFetchGitHubRepoJson(): UseQueryResult<RepoResponse> {
    return useQuery(
        ["githubRepo"], 
        () => getRepoData(appConfig.endpoints.githubRepository), 
        {
            staleTime: 1000 * 60 * 60 * 24 * 365, // 1 year
            onError: () => {},
        }
    );
}

export function useFetchGitHubStargazers(): UseQueryResult<StarGazerResponse[]> {
    return useQuery(
        ["githubRepoStargazers"], 
        () => getRepoData(`${appConfig.endpoints.githubRepository}/stargazers`), 
        {
            staleTime: 1000 * 60 * 60 * 24 * 365, // 1 year
            onError: () => {},
        }
    );
}

export function useFetchGitHubContributors(): UseQueryResult<ContributorsResponse[]> {
    return useQuery(
        ["githubRepoContributors"], 
        () => getRepoData(`${appConfig.endpoints.githubRepository}/contributors`), 
        {
            staleTime: 1000 * 60 * 60 * 24 * 365, // 1 year
            onError: () => {},
        }
    );
}
