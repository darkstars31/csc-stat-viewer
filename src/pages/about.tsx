import * as React from "react";
import { Container } from "../common/components/container";
import { DashboardFooter } from "./dashboard/footer";
import { useFetchGitHubContributors } from "../dao/githubRepo";
import { RxDiscordLogo } from "react-icons/rx";
import { BsGithub } from "react-icons/bs";
import { useDataContext } from "../DataContext";
import { Exandable } from "../common/components/containers/Expandable";

const Paragraph = ({ children }: { children: React.ReactNode }) => <p className="mt-4 text-gray-300">{children}</p>

export function About() {
	const { seasonAndMatchType } = useDataContext();
	const { data: contributors = [] } = useFetchGitHubContributors();

	return (
		<>
			<Container>
				<div className="mx-auto max-w-xlg">
					<h2 className="text-3xl font-bold sm:text-4xl">AnalytiKill</h2>
					<Paragraph>
						Advanced Statistics, Analysis, and Visualizations for{" "}
						<a href="https://csconfederation.com/" target="_blank" rel="noreferrer">
							CS:Confederation Draft League
						</a>
					</Paragraph>
					<Paragraph>
						Season {seasonAndMatchType.season} Stats now available! Use the dropdown menu in the header to select
						the data source you're interested in.
					</Paragraph>
					<Paragraph>
						<a className="flex flex-row leading-8 text-blue-300" href="https://discord.gg/csc">
							<RxDiscordLogo className="mr-2" size="2em" /> Join the Discord, become apart of our amazing
							community.
						</a>
					</Paragraph>
					<div className="mt-4 text-gray-300">
						<a
							className="flex flex-row leading-8 text-blue-300"
							href="https://github.com/darkstars31/csc-stat-viewer"
							target="_blank"
							rel="noreferrer"
						>
							<BsGithub className="mr-2" size="2em" /> This project is open source on GitHub, check it
							out!
						</a>
						<br />
						<div>
							If you think this project is helpful or awesome, throw us a star on GitHub <br />
							<a className="inline" href="https://ko-fi.com/L4L310VRKM" target="_blank" rel="noreferrer">
								<img
									height="36"
									style={{ border: "0px", height: "36px" }}
									src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
									alt="Buy Me a Coffee at ko-fi.com"
								/>
							</a>
						</div>
						<div className="pt-4">
							<h3>Contributors</h3>
							<div className="flex flex-row">
								{contributors?.map(item => (
									<a href={item.html_url} target="_blank" rel="noreferrer">
										<img
											className="w-12 rounded-full m-1"
											src={item.avatar_url}
											title={item.login}
											alt={item.login}
										/>
									</a>
								))}
							</div>
						</div>
						<div className="pt-4">
							<h3>Special Thanks To</h3>
							<div className="flex flex-row">
								yetiF, Stats and Tech Committee, Numbers Team and the entire Staff that volunteer their
								time to help run CSC, for which this project could not exist without.
							</div>
						</div>
					</div>
					<br />
					<h2>FAQ</h2>
					<Exandable title="What is the Counter Strike: Confederation (CSC)?">
						<p className="mt-4 text-gray-300 text-sm">
							A free to join, community maintained draft esports league based on Counter-Strike 2. A nice
							blend of casual competitive team-based play. Think "beer league" but for esports. We have
							tiers that cover all ranges of skills
						</p>
					</Exandable>
					<Exandable title="Where does this data come from?">
						<p className="mt-4 text-gray-300 text-sm">
							Most of the data comes directly from{" "}
							<a
								className="text-blue-300"
								href="https://csconfederation.com/"
								target="_blank"
								rel="noreferrer"
							>
								CSC
							</a>
							. Some of the data is cached every 15 minutes to avoid excessive requests. Data is also
							aggregate from other sources such as Faceit.
						</p>
					</Exandable>
					<Exandable title="HLTV 2.0 Rating?">
						<p className="mt-4 text-gray-300 text-sm">
							This is an approximate HLTV 2.0 rating based on this{" "}
							<a
								className="text-blue-300"
								href="https://flashed.gg/posts/reverse-engineering-hltv-rating/"
								target="_blank"
								rel="noreferrer"
							>
								reverse engineering
							</a>{" "}
							effort.
						</p>
						<p className="mt-4 text-gray-300 text-sm">
							Additionally, it's important to remember that the way the rating applies to the pro scene
							and how it would apply to CSC players in a season are different and it is not intended to
							replace the CSC rating system.
						</p>
						<p className="mt-4 text-gray-300 text-sm">
							fraGG 2.0 (f2) rating system was developed by YetiF and the stats team to address issues
							with the HLTV rating. More information can be found{" "}
							<a
								className="text-blue-300"
								href="https://discord.com/channels/644377562516029460/644574303316082716/710522252126322748"
							>
								here
							</a>
							.
						</p>
						<p className="mt-4 text-gray-300 text-sm">
							A quick rundown of the f2 rating is a combination of the following:
							<code className="text-sm">
								<ul>
									<li>K/D : Kills per death</li>
									<li>AD/R : Average damage per round</li>
									<li>D/R : Deaths per round</li>
									<li>
										KAST : Percentage of rounds the player got a kill or assist, was traded, or
										survived
									</li>
									<li>IMPACT : Detailed below</li>
								</ul>
								<br />
								Impact combines every kill, assist, multikill, clutch, and successful bomb detonation
								and defusal. Points are awarded for each of these actions. Points for kills are
								contextualized based on the economy of both players, whether the round was won, and what
								type of kill it was (entry, trade, etc). The final Impact rating combines a players
								relative points for the whole game, relative points on won rounds, and opening duel
								rate.
							</code>
						</p>
					</Exandable>
					<Exandable title="Beta Features">
						<p className="mt-4 text-gray-300 text-sm">
							These are typically new and/or experiemntal features. If you see a "beta" tag near a
							feature, it means that it is still in development or being tested. Some times beta features
							are available to everyone and some times they are available only to a select group of
							individuals when logged in.
						</p>
					</Exandable>
				</div>
			</Container>
			<DashboardFooter />
		</>
	);
}
