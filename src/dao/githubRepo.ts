import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { appConfig } from "../dataConfig";
import { GitHubBranch } from "../models/github-branch-request-types";

export type RepoResponse = {
	name: string;
	updated_at: string;
	stargazer_count: number;
	watchers_count: number;
};

export type StarGazerResponse = {
	avatar_url: string;
	login: string;
};

export type ContributorsResponse = {
	login: string;
	avatar_url: string;
	html_url: string;
};

const getRepoData = async (url: string) =>
	await fetch(url, {
		method: "GET",
		headers: { "content-type": "text/csv;charset=UTF-8" },
	}).then(async response => {
		return response.json();
	});

export function useFetchGitHubRepoJson(): UseQueryResult<RepoResponse> {
	return useQuery({
        queryKey: ["githubRepo"],
        queryFn: () => getRepoData(appConfig.endpoints.githubRepository),

        // 1 year
        staleTime: 1000 * 60 * 60 * 24 * 365,
    });
}

export function useFetchGithubRepoBranchJson(): UseQueryResult<GitHubBranch> {
	return useQuery({
        queryKey: ["githubRepoBranch"],
        queryFn: () => getRepoData(`${appConfig.endpoints.githubRepository}/branches/gh-pages`),

        // 15 minutes
        staleTime: 1000 * 60 * 15,
    });
}

export function useFetchGitHubStargazers(): UseQueryResult<StarGazerResponse[]> {
	return useQuery({
        queryKey: ["githubRepoStargazers"],
        queryFn: () => getRepoData(`${appConfig.endpoints.githubRepository}/stargazers`),

        // 1 year
        staleTime: 1000 * 60 * 60 * 24 * 365,
    });
}

export function useFetchGitHubContributors(): UseQueryResult<ContributorsResponse[]> {
	return useQuery({
        queryKey: ["githubRepoContributors"],
        queryFn: () => getRepoData(`${appConfig.endpoints.githubRepository}/contributors`),

        // 1 year
        staleTime: 1000 * 60 * 60 * 24 * 365,
    });
}
