import React from "react";
import { useDataContext } from "../DataContext";
import { useCscSeasonMatches } from "../dao/cscSeasonMatches";
import { Container } from "../common/components/container";
import { Card } from "../common/components/card";
import { Loading } from "../common/components/loading";
import { Link, useSearch, useLocation } from "wouter";
import { franchiseImages } from "../common/images/franchise";
import { sortBy } from "lodash";
import { Franchise } from "../models/franchise-types";
import { calculatePercentage, getCssColorGradientBasedOnPercentage } from "../common/utils/string-utils";
import { Exandable } from "../common/components/containers/Expandable";
import csclogo from "../assets/images/placeholders/csc-logo.png";
import { ToolTip } from "../common/utils/tooltip-utils";
import { Toggle } from "../common/components/toggle";

type ProcessedTeamStandings = {
	franchise?: Franchise;
	elo: number;
	name: string;
	wins: number;
	losses: number;
	roundsWon: number;
	roundsLost: number;
	ctRoundsWon: number;
	tRoundsWon: number;
	ctTotalRounds: number;
	tTotalRounds: number;
	pistolRoundsWon: number;
	pistolTotalRounds: number;
};

const calclulateElo = (team1: ProcessedTeamStandings, team2Elo: number, team1Won: boolean) => {
	const k = 21.333;
	const c = 266.66;
	const team1Win = team1Won ? 1 : 0;
	return team1.elo + k * (team1Win - 1 / (1 + 10 ** ((team2Elo - team1.elo) / c)));
};

function TeamRecordRow({
	team,
	index,
	SoS,
	showExtras,
}: {
	team: any;
	index: number;
	SoS: number;
	showExtras: boolean;
}) {
	return (
		<tr key={`${team.name}${index}`} className={`${index % 2 === 0 ? "bg-slate-800" : ""} p-2`}>
			<td className="font-bold pl-4">{index + 1}</td>
			<td className="uppercase leading-10">
				<Link
					to={`/franchises/${team?.franchise?.name}/${team.name}`}
					className="hover:cursor-pointer hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300"
				>
					<img
						className="w-8 h-8 md:w-10 md:h-10 mr-2 float-left"
						src={franchiseImages[team?.franchise?.prefix]}
						alt=""
					/>
					{team.name} ({team?.franchise?.prefix})
				</Link>
			</td>
			<td>
				<div>
					<span className="text-green-400 font-bold">{team.wins}</span> :{" "}
					<span className="text-red-400">{team.losses}</span>
				</div>
				<div className="text-gray-400 text-xs pl-2">
					{calculatePercentage(team.wins, team.wins + team.losses, 2)}%
				</div>
			</td>
			<td>
				<div>
					<span className="text-green-400">{team.roundsWon}</span> :{" "}
					<span className="text-red-400">{team.roundsLost}</span>
				</div>
				<div>
					<span className="text-gray-400 text-xs">
						diff {team.roundsWon - team.roundsLost > 0 ? "+" : ""}
						{team.roundsWon - team.roundsLost}
					</span>{" "}
					<span className="text-gray-400 text-xs">
						{calculatePercentage(team.roundsWon, team.roundsWon + team.roundsLost, 1)}%
					</span>
				</div>
			</td>
			<td
				className={`${getCssColorGradientBasedOnPercentage(calculatePercentage(team.ctRoundsWon, team.ctTotalRounds, 1))} collapse md:visible`}
			>
				{calculatePercentage(team.ctRoundsWon, team.ctTotalRounds, 1)}%
			</td>
			<td
				className={`${getCssColorGradientBasedOnPercentage(calculatePercentage(team.tRoundsWon, team.tTotalRounds, 1))} collapse md:visible`}
			>
				{calculatePercentage(team.tRoundsWon, team.tTotalRounds, 1)}%
			</td>
			<td
				className={`${getCssColorGradientBasedOnPercentage(calculatePercentage(team.pistolRoundsWon, team.pistolTotalRounds, 1))} collapse md:visible`}
			>
				{calculatePercentage(team.pistolRoundsWon, team.pistolTotalRounds, 1)}%
			</td>
			{showExtras && (
				<>
					{/* <td>{team.elo.toFixed(0)}</td> */}
					<td className={`${getCssColorGradientBasedOnPercentage(100 - SoS)}`}>{SoS.toFixed(1)}%</td>
				</>
			)}
		</tr>
	);
}

export function TeamStandings() {
	const qs = new URLSearchParams(window.location.search);
	const q = qs.get("q");
	const [, setLocation] = useLocation();
	const queryParams = new URLSearchParams(useSearch());
	const { franchises = [], seasonAndTierConfig, dataConfig } = useDataContext();
	const [selectedTier, setSelectedTier] = React.useState(q ?? "Contender");
	const [showExtras, setShowExtras] = React.useState(true);

	const { data: matches = [], isLoading } = useCscSeasonMatches(
		selectedTier[0].toUpperCase() + selectedTier.slice(1),
		dataConfig?.season,
	);
	const tieBreakers: string[] = [];
	console.info(matches);

	const teamsWithScores = matches.reduce(
		(acc, match) => {
			match.teamStats.forEach(team => {
				if (!acc[team.name]) {
					const franchise = franchises.find(f => f.teams.find(t => t.name === team.name));
					acc[team.name] = {
						elo: 1000,
						franchise: franchise,
						name: team.name,
						wins: 0,
						losses: 0,
						roundsWon: 0,
						roundsLost: 0,
						ctRoundsWon: 0,
						tRoundsWon: 0,
						ctTotalRounds: 0,
						tTotalRounds: 0,
						pistolRoundsWon: 0,
						pistolTotalRounds: 0,
					};
				}

				const opponent = match.teamStats.find(t => t.name !== team.name);
				if (acc[opponent?.name ?? ""]) {
					const opponentElo = acc[opponent!.name].elo;
					if (team.score > match.totalRounds / 2) {
						// win elo
						acc[team.name].elo = calclulateElo(acc[team.name], opponentElo, true);
						acc[opponent!.name].elo = calclulateElo(acc[opponent!.name], acc[team.name].elo, false);
					} else {
						//lose elo
						acc[team.name].elo = calclulateElo(acc[team.name], opponentElo, false);
						acc[opponent!.name].elo = calclulateElo(acc[opponent!.name], acc[team.name].elo, true);
					}
				}

				if (team.score > match.totalRounds / 2) {
					acc[team.name].wins += 1;
				} else {
					acc[team.name].losses += 1;
				}

				acc[team.name].roundsWon += team.score;
				acc[team.name].roundsLost += match.totalRounds - team.score;
				acc[team.name].ctRoundsWon += team.ctRW;
				acc[team.name].tRoundsWon += team.TRW;
				acc[team.name].ctTotalRounds += team.ctR;
				acc[team.name].tTotalRounds += team.TR;
				acc[team.name].pistolRoundsWon += team.pistolsW;
				acc[team.name].pistolTotalRounds += team.pistols;
			});

			return acc;
		},
		{} as Record<string, ProcessedTeamStandings>,
	);

	const SoS = Object.values(teamsWithScores).reduce(
		(acc: any, team: ProcessedTeamStandings) => {
			if (acc[team.name]) {
				acc[team.name] = 0;
			}

			const opponents = matches.reduce((acc, match) => {
				if (match.teamStats.find(t => t.name === team.name)) {
					const oppName = match.teamStats.find(t => t.name !== team.name)?.name;
					acc.push(oppName ?? "");
				}
				return acc;
			}, [] as string[]);

			const opponentsOP = Object.values(teamsWithScores)
				.filter(t => opponents.includes(t.name))
				.map(opponent => opponent.wins / (opponent.wins + opponent.losses));
			const oow = +opponentsOP.reduce((acc: number, opp: number) => acc + opp, 0) / opponentsOP.length;
			acc[team.name] = oow * 100;
			return acc;
		},
		{} as Record<string, number>,
	);

	const sorted = sortBy(Object.values(teamsWithScores), "wins").reverse();
	sorted.sort((a, b) => {
		if (a.wins === b.wins) {
			const foundMatches = matches.filter(
				m => m.teamStats.find(t => t.name === a.name) && m.teamStats.find(t => t.name === b.name),
			);
			if (foundMatches.length === 1) {
				const match = foundMatches[0];
				const teamA = match.teamStats.find(t => t.name === a.name);
				tieBreakers.push(
					teamA?.score! > match.totalRounds / 2 ?
						`${a.name} over ${b.name} in Head-to-Head`
					:	`${b.name} over ${a.name} in Head-to-Head`,
				);
				return teamA?.score! > match.totalRounds / 2 ? -1 : 1;
			} else if (foundMatches.length > 1) {
				tieBreakers.push(
					`Standings currently does not account for multiple head-to-head matches between ${a.name} and ${b.name}`,
				);
			}

			tieBreakers.push(
				SoS[a.name] > SoS[b.name] ? `${a.name} over ${b.name} in SoS` : `${b.name} over ${a.name} in SoS`,
			);
			return SoS[a.name] > SoS[b.name] ? -1 : 1;

			// Round Win Percentage (Old Tiebreaker)
			//tieBreakers.push( (a.roundsWon / (a.roundsWon+a.roundsLost)) > (b.roundsWon / (b.roundsWon+b.roundsLost)) ? `${a.name} over ${b.name} in RWP` : `${b.name} over ${a.name} in RWP` );
			//return (a.roundsWon / (a.roundsWon+a.roundsLost)) > (b.roundsWon / (b.roundsWon+b.roundsLost)) ? -1 : 1;
		}
		return 0;
	});

	const tierButtonClass =
		"rounded-md flex-grow px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-700";

	const tiers = [
		{ name: "Recruit", color: "red", playoffLine: 12 },
		{ name: "Prospect", color: "orange", playoffLine: 16 },
		{ name: "Contender", color: "yellow", playoffLine: 16 },
		{ name: "Challenger", color: "green", playoffLine: 12 },
		{ name: "Elite", color: "blue", playoffLine: 10 },
		{ name: "Premier", color: "purple", playoffLine: 12 },
	];

	const matchDaysPlayed = matches.length > 0 ? sorted[0].wins + sorted[0].losses : 0;

	return (
		<Container>
			<div>
				<div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]"></div>
				<div
					className="justify-center flex flex-wrap rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out bg-slate-700 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-700 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
					role="group"
				>
					{tiers.map(tier => (
						<button
							key={tier.name}
							type="button"
							onClick={() => {
								queryParams.set("q", tier.name);
								setLocation(window.location.pathname + "?" + queryParams.toString());
								setSelectedTier(tier.name);
							}}
							className={`${selectedTier === tier.name ? "bg-blue-500" : "bg-slate-700"} text-${tier.color}-300 ${tierButtonClass}`}
						>
							{tier.name}
						</button>
					))}
				</div>
			</div>
			<div className="pt-2">
				{isLoading ?
					<Loading />
				:	<Card>
						<div className="w-full">
							<div className="flex flex-row">
								<h1 className="text-4xl font-black uppercase">{selectedTier}</h1>
								<div className="flex flex-row w-full justify-end m-1 text-sm">
									<Toggle checked={showExtras} onChange={() => setShowExtras(!showExtras)}></Toggle>{" "}
									Show Extras
								</div>
							</div>
							<h3
								className="text-xl font-bold"
								style={{ backgroundImage: `url(${csclogo})`, overflow: "auto" }}
							>
								MATCH DAY <span className="text-yellow-400">{matchDaysPlayed}</span>
							</h3>
						</div>
						<div className="flex">
							<div className="basis-1/12 collapse md:visible">
								<div className="text-3xl -rotate-90 font-black translate-y-16">
									SEASON {seasonAndTierConfig?.number}
								</div>
							</div>
							<div className="basis-full min-h-[300px]">
								<table className="table-auto w-full">
									<thead className="underline decoration-yellow-400">
										<tr className="text-left">
											<th>POS.</th>
											<th>Team</th>
											<th>Win : Loss</th>
											<th>Rounds</th>
											<th className="collapse md:visible">CT</th>
											<th className="collapse md:visible">T</th>
											<th className="collapse md:visible">Pistols</th>
											{showExtras && (
												<>
													{/* <th><ToolTip type="generic" message="Calculated based on opponent record and the weighted odds of winning against each opponent. Base Elo is 1000."><span className="underline decoration-yellow-400">Elo</span></ToolTip></th> */}
													<th>
														<ToolTip type="generic" message="Strength of Schedule">
															<span className="underline decoration-yellow-400">SoS</span>
														</ToolTip>
													</th>
												</>
											)}
										</tr>
									</thead>
									<tbody>
										{matches.length < 1 ?
											<tr className="text-center text-xl font-italic">
												Season {seasonAndTierConfig?.number} hasn't started yet! Check back
												after Match Day 1.
											</tr>
										:	sorted.map((team: any, index: number) => (
												<>
													<TeamRecordRow
														key={`${index}`}
														team={team}
														SoS={SoS[team.name]}
														showExtras={showExtras}
														index={index}
													/>
													{tiers.find(tier => tier.name === selectedTier)?.playoffLine ===
														index + 1 && (
														<tr className="text-gray-500 text-xs italic">
															<td className="-mt-[.8em] ml-20 border-dotted border-b border-gray-400">
																Playoff Line
															</td>
															<td className="-mt-[.8em] ml-20 border-dotted border-b border-gray-400"></td>
														</tr>
													)}
												</>
											))
										}
									</tbody>
								</table>
							</div>
						</div>
					</Card>
				}
				{tieBreakers.length > 0 && (
					<Exandable title="Tie-Breakers">
						<div className="m-4">
							{tieBreakers.map((tieBreaker, index) => (
								<li className="text-xs">{tieBreaker}</li>
							))}
						</div>
					</Exandable>
				)}
				{selectedTier && (
					<div className="text-center text-xs m-4 text-slate-400">
						* Tie-Breakers implemented in order: Head-to-Head Record, Strength of Schedule <br />
						* Strength of Schedule calculated based on played match ups (unplayed teams not included).{" "}
						<br />* Unofficial Standings, calculated based on available match data. <br />* Design inspired
						by <a href="/players/spidey">Spidey</a> <br />
					</div>
				)}
				{!selectedTier && <div className="text-center text-xl m-4">Select a tier to get started.</div>}
			</div>
		</Container>
	);
}
