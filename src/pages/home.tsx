import * as React from "react";
import { Container } from "../common/components/container";
import { DashboardFooter } from "./dashboard/footer";
import { useFetchGitHubContributors } from "../dao/githubRepo";
import { RxDiscordLogo } from "react-icons/rx"
import { BsGithub } from "react-icons/bs";

export function Home(){
    const { data: contributors = [] } = useFetchGitHubContributors();

    return (
        <>
        <Container>
            <div className="mx-auto max-w-xlg">
                <h2 className="text-3xl font-bold sm:text-4xl">CSConfederation Statistic Visualizer</h2>
                <p className="mt-4 text-gray-300">
                    Unofficial stats and analysis tools for the CS:Confederation Draft League
                </p>
                <p className="mt-4 text-gray-300">
                    Season 11 (Combine) Stats now available! Use the dropdown menu in the header to select the data source you're interested in.
                </p>
                <p className="mt-4 text-gray-300">
                    <a className="flex flex-row leading-8 text-blue-300" href="https://discord.gg/csc"><RxDiscordLogo className="mr-2" size="2em" /> Join the Discord, become apart of our amazing community.</a>
                </p>
                <div className="mt-4 text-gray-300">
                    <a className="flex flex-row leading-8 text-blue-300" href="https://github.com/darkstars31/csc-stat-viewer" target="_blank" rel="noreferrer">
                        <BsGithub className="mr-2" size="2em"/> This project is open source on GitHub, check it out!
                        </a>
                        <br />
                    <div>
                        If you think this project is helpful or awesome, throw us a star on GitHub
                    </div>
                    <div className="pt-4">
                        <h3>Contributors</h3>
                        <div className="flex flex-row">
                            {contributors?.map( item =>
                                <a href={item.html_url} target="_blank" rel="noreferrer">
                                    <img className="w-12 rounded-full m-1" src={item.avatar_url} title={item.login} alt={item.login}/>
                                </a>
                                )}
                        </div>
                    </div>
                    <div className="pt-4">
                        <h3>Special Thanks To</h3>
                        <div className="flex flex-row">
                           yetiF, the Stats Team, the Numbers Team and the entire Staff that volunteer their time to help run CSC, for which this project could not exist without.
                        </div>
                    </div>
                </div>
            </div>
        </Container>
        <DashboardFooter />
        </>
    );
}