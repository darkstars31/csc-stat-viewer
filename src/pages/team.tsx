import * as React from "react";
import { useDataContext } from "../DataContext";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Link, useRoute } from "wouter";
import { useFetchMatchesGraph } from "../dao/cscMatchesGraphQLDao";
import { MatchCards } from "./team/matches";
import { MapRecord } from "./team/mapRecord";
import { franchiseImages } from "../common/images/franchise";
import { calculateTeamRecord } from "../common/utils/match-utils";
import { AwardsMappings } from "../common/utils/awards-utils";
import { queryClient } from "../App";
import { TeamPlayerCards } from "./team/playerCards";
import { MapAnalysis } from "./team/mapBans";
import { CompareLink } from "../common/components/compareLink";
import { ToolTip } from "../common/utils/tooltip-utils";
import { TeamMatchHistory } from "./player/matchHistory";

export function Team() {
	// zeslint-disable-next-line @typescript-eslint/no-unused-vars
	const {
		franchises = [],
		players: cscPlayers = [],
		seasonAndMatchType,
		tiers,
		loading,
	} = useDataContext();
	// zeslint-disable-next-line @typescript-eslint/no-unused-vars
	const [, params] = useRoute("/franchises/:franchiseName/:teamName");
	const franchiseName = decodeURIComponent(params?.franchiseName ?? "");
	const teamName = decodeURIComponent(params?.teamName ?? "");
	const [isRefreshing, setIsRefreshing] = React.useState(false);

	React.useEffect(() => {
		if (isRefreshing) {
			setInterval(() => {
				queryClient.invalidateQueries(["matches-graph", currentTeam?.id]);
			}, 45 * 1000);
		}
	});

	const teamAwardMappings: Record<string, string> = {
		...AwardsMappings,
		avgMmr: "Avg MMR",
	};

	const currentFranchise = franchises.find(f => f.name === franchiseName);
	const currentTeam = currentFranchise?.teams.find(t => t.name === teamName);
	const currentTier = tiers.find(t => t.tier.name === currentTeam?.tier.name);
	const currentTeamTotalMmr = currentTeam?.players.reduce((sum, next) => sum + (next.mmr ?? 0), 0) ?? 0;
	const currentTeamMMRMinusCapDiff = (currentTier?.tier.mmrCap ?? 0) - currentTeamTotalMmr;
	const currentTeamTotalMmrPercent = ((currentTeamTotalMmr / (currentTier?.tier.mmrCap ?? 0)) * 100).toFixed(2);
	const playersWithStats = currentTeam?.players.map(t => cscPlayers.find(p => p.steam64Id === t.steam64Id));
	let iterations = 0;
	const currentTeamStatAggregation = currentTeam?.players.reduce(
		(acc, player, index) => {
			const cscPlayerWithStats = cscPlayers.find(p => p.steam64Id === player.steam64Id && p.stats?.rating);
			if (!cscPlayerWithStats) return acc;
			iterations++;
			acc["avgMmr"] = acc["avgMmr"] + cscPlayerWithStats.mmr;
			acc["rating"] = acc["rating"] + cscPlayerWithStats.stats.rating;
			acc["ef"] = acc["ef"] + cscPlayerWithStats.stats.ef;
			acc["adr"] = acc["adr"] + cscPlayerWithStats.stats.adr;
			acc["kast"] = acc["kast"] + cscPlayerWithStats.stats.kast;
			acc["utilDmg"] = acc["utilDmg"] + cscPlayerWithStats.stats.utilDmg;
			acc["impact"] = acc["impact"] + cscPlayerWithStats.stats.impact;
			acc["clutchR"] = acc["clutchR"] + cscPlayerWithStats.stats.clutchR;

			if (index === currentTeam.players.length - 1) {
				acc["avgMmr"] = Math.floor(acc["avgMmr"] / iterations);
				acc["rating"] = acc["rating"] / iterations;
				acc["ef"] = acc["ef"] / iterations;
				acc["adr"] = acc["adr"] / iterations;
				acc["kast"] = acc["kast"] / iterations;
				acc["utilDmg"] = acc["utilDmg"] / iterations;
				acc["impact"] = acc["impact"] / iterations;
				acc["clutchR"] = acc["clutchR"] / iterations;
			}

			return acc;
		},
		{
			rating: 0,
			ef: 0,
			adr: 0,
			kast: 0,
			utilDmg: 0,
			impact: 0,
			clutchR: 0,
			avgMmr: 0,
		} as any,
	);

	// zeslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: matches = [], isLoading: isLoadingMatches } = useFetchMatchesGraph(
		seasonAndMatchType.season,
		currentTeam?.id,
	);
	const matchIds = React.useMemo(() => matches.map(match => match.id), [matches]);

	//const presesasonMatches = matches.filter( match => match.stats.length <= 1 && match.matchDay.number.includes("P"));
	const regularSeasonMatches = matches.filter(
		match => match.stats.length <= 1 && match.matchDay.number.includes("M"),
	);
	const playoffMatches = matches.filter(match => match.stats.length > 1);

	const teamRecord = calculateTeamRecord(currentTeam, matches);

	return (
		<div
			style={{
				backgroundImage: `url(${franchiseImages[currentFranchise?.prefix ?? ""]})`,
				overflow: "auto",
			}}
			className={`bg-repeat bg-center bg-fixed`}
		>
			<div className="backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] overflow-auto">
				<Container>
					<div className="m-2 p-2 bg-opacity-60 bg-black rounded-lg">
						<div className="my-4">
							<i>
								<Link className="hover:text-blue-400" to={`/franchises`}>
									Franchises
								</Link>{" "}
								{"> "}
								<Link className="hover:text-blue-400" to={`/franchises/${currentFranchise?.name}`}>
									{currentFranchise?.name}
								</Link>
							</i>{" "}
							{"> "}
							{currentTeam?.tier.name}
						</div>
						{loading.isLoadingFranchises && loading.isLoadingCscSeasonAndTiers && <Loading />}
						<h2 className="text-5xl font-bold text-white grow text-center">{currentTeam?.name}</h2>
						<div className="text-center p-4 text-xl">
							{currentFranchise?.name} - <i>{currentFranchise?.prefix}</i>
						</div>
						<div className="flex flex-wrap justify-between">
							{Object.entries(currentTeamStatAggregation ?? []).map(([key, value]) => (
								<div className="flex-initial m-2 p-2 text-center">
									<div>
										<b>{(value as number).toFixed(2)}</b>
									</div>
									<div className="text-sm">{teamAwardMappings[key]}</div>
								</div>
							))}
						</div>
						<div className="flex flex-wrap justify-between">
							<div className="flex-initial m-2 p-2 text-center">
								<ToolTip
									type="generic"
									message={
										currentTeamMMRMinusCapDiff > 0 ?
											`Available MMR: ${currentTeamMMRMinusCapDiff}`
										:	""
									}
								>
									<div>
										<b>
											{currentTeamTotalMmr} / {currentTier?.tier.mmrCap}{" "}
											<span
												className={`text-sm ${currentTeamMMRMinusCapDiff < 0 ? "text-red-400" : "hidden"}`}
											>
												({currentTeamMMRMinusCapDiff})
											</span>
										</b>
									</div>
									<div className="text-sm">{currentTeamTotalMmrPercent}% MMR Cap</div>
								</ToolTip>
							</div>
						</div>
						<div className="p-4 rounded">
							<hr className="h-px my-4 border-0" />
							<div>
								<CompareLink players={playersWithStats} />
								<div className="flex flex-row justify-center gap-2 flex-wrap pt-4">
									{currentTeam?.players?.map(player => (
										<TeamPlayerCards
											key={player.name}
											franchisePlayer={player}
											team={currentTeam}
										/>
									))}
								</div>
							</div>
							{isLoadingMatches && <Loading />}
							{playoffMatches.length > 0 && (
								<div className="pt-8 relative">
									<div className="-rotate-90 absolute bottom-[5em] text-2xl pb-16 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
										<b>PLAY-OFFS</b>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ml-16">
										{playoffMatches.map(match => (
											<MatchCards key={match.id} match={match} team={currentTeam} />
										))}
									</div>
								</div>
							)}
							{regularSeasonMatches.length > 0 && (
								<div className="pt-8">
									<h2 className="text-2xl font-bold text-white grow text-center">
										Regular Season
										{teamRecord.record && (
											<span>
												{" "}
												( {teamRecord.record.wins} - {teamRecord.record?.losses} )
											</span>
										)}
									</h2>
									<MapRecord matches={regularSeasonMatches} team={currentTeam} />
									{matches.length > 0 && <MapAnalysis matches={matches} team={currentTeam} />}
									<div className="mt-4">
										{matches.length > 0 &&
											regularSeasonMatches.some(match =>
												match.stats.some(stat => stat.awayScore > 0 || stat.homeScore > 0),
											) && (
												<div>
													<input
														className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-green-400 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-green-400 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-green-400 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
														type="checkbox"
														role="switch"
														id="flexSwitchChecked"
														onChange={() => setIsRefreshing(!isRefreshing)}
														checked={isRefreshing}
													/>
													<label
														className="inline-block pl-[0.15rem] hover:cursor-pointer"
														htmlFor="flexSwitchChecked"
													>
														Auto Refresh (1 min)
													</label>
												</div>
											)}
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
										{regularSeasonMatches.map(match => (
											<MatchCards key={match.id} match={match} team={currentTeam} />
										))}
									</div>
								</div>
							)}
							{matchIds?.length && (
								<TeamMatchHistory teamName={currentTeam?.name ?? ""} matchIds={matchIds} />
							)}
						</div>
					</div>
				</Container>
			</div>
		</div>
	);
}
