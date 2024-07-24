import * as React from "react";
import { MapBan, Match } from "../../models/matches-types";
import { Team } from "../../models/franchise-types";
import { GrDocumentVideo } from "react-icons/gr";
import { Link } from "wouter";

import { mapImages } from "../../common/images/maps";
import { franchiseImages } from "../../common/images/franchise";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { useFetchMultipleMatchInfoGraph } from "../../dao/cscMatchesGraphQLDao";
import { Round } from "../../models/match-scoreboard-types";
import { IoMdTimer } from "react-icons/io";
import { IoCut, IoSkullSharp } from "react-icons/io5";
import { GiTimeDynamite } from "react-icons/gi";
import _ from "lodash";

type Props = {
	match: Match;
	team?: Team;
};

const mapBanPopover = (matchMapBans: MapBan[]) => {
	const sortedMapBans = matchMapBans.sort((a, b) => a.number - b.number);

	return (
		<div className="z-48 w-56 bg-midnight2 m-1 p-1 rounded-lg text-xs">
			{matchMapBans.length > 0 ?
				<div>
					<div className="grid grid-cols-3">
						<div></div>
						<div className="p-1">{matchMapBans[0].team.name}</div>
						<div className="p-1">{matchMapBans[1].team.name}</div>
						{sortedMapBans.map((mapBan, index) => (
							<>
								{index % 2 === 0 ?
									<div style={{ lineHeight: "2.5rem" }}>Round {index / 2 + 1}</div>
								:	<></>}
								<div className="text-sm">
									<img className="w-14 h-14 mx-auto" src={mapImages[mapBan.map]} alt="" />
								</div>
							</>
						))}
					</div>
				</div>
			:	<div>Map ban information unavailable.</div>}
		</div>
	);
};

const roundWinner = (side: string, round: Round) => {
	let winType = <IoMdTimer size="2em" />;
	if (round.endDueToBombEvent) {
		winType = <GiTimeDynamite size="2em" className="rotate-45" />;
	}
	if (round.winTeamDmg === 500) {
		winType = <IoSkullSharp size="2em" />;
	}
	if (round.defuser !== "0") {
		winType = <IoCut size="2em" className="-rotate-45" />;
	}

	return <div className={`rounded-full w-8 h-8 p-1 ${side === "CT" ? "bg-sky-500" : "bg-rose-500"}`}>{winType}</div>;
};

export const Scoreboard = ({ matchId }: { matchId: string }) => {
	const winnerEnum: Record<number, string> = {
		3: "CT",
		2: "T",
	};
	const fullMatchRounds = 24;
	const roundsPerOvertime = 6;
	const matches = useFetchMultipleMatchInfoGraph([matchId]);
	const match = matches.find(m => m.data?.at(0)?.matchId === matchId)?.data?.at(0);
	const rounds = match?.rounds.slice(0);
	const firstHalf = rounds?.slice(0, fullMatchRounds / 2);
	const secondHalf = rounds?.slice(fullMatchRounds / 2, fullMatchRounds);
	const overtime = rounds?.slice(fullMatchRounds) ?? [];
	const overtimeX = _.chunk(overtime, roundsPerOvertime);

	const ctTeam = match?.rounds.find(r => r.winnerENUM === 3)?.winnerClanName;
	const tTeam = match?.rounds.find(r => r.winnerENUM === 2)?.winnerClanName;

	return (
		<>
			<div className="flex flex-row justify-between px-4">
				<div className="text-sky-500 font-bold">{ctTeam}</div>
				<div>Start Side</div>
				<div className="text-rose-500 font-bold">{tTeam}</div>
			</div>
			<div className="flex flex-row flex-wrap">
				<div className="flex flex-row basis-5/12 justify-end">
					{firstHalf?.map((round, index) => (
						<div>
							{roundWinner(winnerEnum[round.winnerENUM as keyof typeof winnerEnum], round)} {index + 1}
						</div>
					))}
				</div>
				<div className="text-gray-600 text-xs w-full p-1 basis-1/12 grow italic text-center">
					Half
					<div className="-mt-[.5em] border-dotted border-b border-gray-500" />
				</div>
				<div className="flex flex-row basis-5/12">
					{secondHalf?.map((round, index) => (
						<div>
							{index + 1 + fullMatchRounds / 2}{" "}
							{roundWinner(winnerEnum[round.winnerENUM as keyof typeof winnerEnum], round)}
						</div>
					))}
				</div>
				<div className="flex flex-row justify-between px-4 w-full">
					<div className="text-rose-500 font-bold">{tTeam}</div>
					<div className="text-sky-500 font-bold">{ctTeam}</div>
				</div>
			</div>

			{overtimeX?.map((overtime, overtimeIndex) => (
				<div className="flex flex-row justify-center">
					{overtime?.map((round, roundIndex) => (
						<div>
							{overtimeIndex * roundIndex + 25}{" "}
							{roundWinner(winnerEnum[round.winnerENUM as keyof typeof winnerEnum], round)}
						</div>
					))}
				</div>
			))}

			{!rounds && <div>Round information unavailable.</div>}
		</>
	);
};

export const ScoreboardPopover = ({ matchId }: { matchId: string }) => {
	return (
		<div className="z-40 w-[25rem] bg-midnight2 m-2 p-2 rounded-lg text-xs">
			<Scoreboard matchId={matchId} />
		</div>
	);
};

export function MatchCards({ match, team }: Props) {
	const matchDate = {
		month: new Date(match.scheduledDate).getMonth() + 1,
		day: new Date(match.scheduledDate).getDate(),
		hour: new Date(match.scheduledDate).getHours() % 12,
	};
	const isPlayoffMatch = match.stats.length > 1;
	const isMatchInProgress = !match.completedAt && match.stats.length > 0;
	const isMatchNotYetPlayed = !match.completedAt && !match.stats.length;
	const isHomeTeam = match.home.name === team?.name;
	const matchDayWins = match.stats
		.map(stats =>
			(
				(isHomeTeam && stats?.homeScore > stats?.awayScore) ||
				(!isHomeTeam && stats?.homeScore < stats?.awayScore)
			) ?
				true
			:	undefined,
		)
		.filter(Boolean).length;
	const didCurrentTeamWin = matchDayWins / match.stats.length > 0.5;
	const backgroundColor =
		match.stats.length > 0 || isMatchInProgress ?
			didCurrentTeamWin ? "bg-emerald-800"
			:	"bg-red-950"
		:	"bg-midnight1";

	return (
		<div
			className={`m-2 p-2 ${backgroundColor} ${isMatchInProgress ? "border-yellow-500 border-2" : ""} rounded-lg`}
		>
			<div className="w-full flex text-sm pb-2">
				<div className="basis-3/4">
					{match.matchDay.number} | {matchDate.month}/{matchDate.day} {matchDate.hour}PM
				</div>
				<span className="basis-1/4 text-gray-700 text-xs text-right">id:{match.id}</span>
			</div>
			<div className="cursor-pointer">
				<div className="grid grid-cols-2 overflow-hidden">
					<Link to={`/franchises/${match.home.franchise.name}/${match.home.name}`}>
						<div className="h-14 w-14 mx-auto">
							<img src={franchiseImages[match.home.franchise.prefix]} alt="" />
						</div>
					</Link>
					<Link to={`/franchises/${match.away.franchise.name}/${match.away.name}`}>
						<div className="h-14 w-14 mx-auto">
							<img src={franchiseImages[match.away.franchise.prefix]} alt="" />
						</div>
					</Link>
				</div>
				<div className="grid grid-cols-2 text-center text-sm">
					<Link to={`/franchises/${match.home.franchise.name}/${match.home.name}`}>
						<div className="text-sky-500">{match.home.name}</div>
					</Link>
					<Link to={`/franchises/${match.away.franchise.name}/${match.away.name}`}>
						<div className="text-amber-500">{match.away.name}</div>
					</Link>
				</div>
			</div>
			{match.stats.length > 0 && (
				<div className="relative pt-2">
					{match.stats
						.filter(matchStats => matchStats.homeScore + matchStats.awayScore > 0)
						.map(matchStats => (
							<>
								<div className="grid grid-cols-1 text-3xl text-center z-10">
									<div className="flex flex-row justify-center">
										<div
											className={`basis-1/3 ${matchStats.homeScore > matchStats.awayScore ? "text-green-400" : "text-red-400"}`}
										>
											{matchStats.homeScore}
										</div>
										<img
											className="object-cover object-center w-12 h-12"
											src={mapImages[matchStats.mapName as keyof typeof mapImages]}
											alt={matchStats.mapName}
										/>
										<div
											className={`basis-1/3 ${matchStats.homeScore < matchStats.awayScore ? "text-green-400" : "text-red-400"}`}
										>
											{matchStats.awayScore}
										</div>
									</div>
								</div>
							</>
						))}
					<div className="flex flex-row justify-end text-xs gap-2">
						{!isPlayoffMatch && (
							<ToolTip
								type="generic"
								classNames={["-translate-x-48", "right-4"]}
								message={<ScoreboardPopover matchId={match.id} />}
							>
								<span className="text-gray-900">Scoreline</span>
							</ToolTip>
						)}
						{!isPlayoffMatch && (
							<ToolTip
								type="generic"
								classNames={["-translate-x-48"]}
								message={mapBanPopover(match.lobby.mapBans)}
							>
								<span className="text-gray-900">Bans</span>
							</ToolTip>
						)}
						{match.demoUrl && (
							<div>
								<a href={match.demoUrl} title="Download Demo" rel="noreferrer" target="_blank">
									<GrDocumentVideo size="1.2em" className="text-white" />
								</a>
							</div>
						)}
					</div>
				</div>
			)}
			{isMatchInProgress && (
				<div className="text-center py-4 text-sm text-yellow-500 animate-pulse">Match in progress.</div>
			)}
			{isMatchNotYetPlayed && (
				<div className="text-center py-4 text-sm text-gray-700">Match hasn't been played yet.</div>
			)}
		</div>
	);
}
