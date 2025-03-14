import * as React from "react";
import { Player } from "../../models";
import { Loading } from "../../common/components/loading";
import { mapImages } from "../../common/images/maps";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { useCscPlayerMatchHistoryGraph, useCscTeamMatchHistoryGraph } from "../../dao/cscPlayerMatchHistoryGraph";
import { Match } from "../../models/csc-player-match-history-types";
import { GoStarFill } from "react-icons/go";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { getCssColorGradientBasedOnPercentage } from "../../common/utils/string-utils";
import * as Containers from "../../common/components/containers";
import { Exandable } from "../../common/components/containers/Expandable";
import { Scoreboard } from "../team/matches";
import { calculateClutchPoints } from "../../common/utils/match-utils";
import { useAnalytikillExtendedMatchStats } from "../../dao/analytikill";
import { cs2icons, cs2killfeedIcons } from "../../common/images/cs2icons";
import { ExtendedMatchHistoryClutches } from "./extendedMatchHistoryClutches";
import { ExtendedMatchHistoryTeamEcon } from "./extendedMatchHistoryTeamEcon";
import { ExtendedMatchHistoryKillFeed } from "./extendedMatchHistoryKillFeed";
import { ExtendedMatchHistoryTrades } from "./extendedMatchHistoryTrades";
import { ExtendedMatchHistoryMatchup } from "./extendedMatchHistoryMatchup";
import { useDataContext } from "../../DataContext";

type Props = {
	player: Player;
	season: number;
};

function PlayerMatchStatLine({ playerStat }: { playerStat: any }) {
	return (
		<>
			<tr className="sm:hidden">
				<td className="truncate max-w-[7em]">{playerStat.name}</td>
				<td className="text-center">
					{playerStat.rating.toFixed(2)}<br />
					{playerStat.kills} / {playerStat.deaths} / {playerStat.assists}
				</td>
				<td className="text-center">{playerStat.damage}<br />
					<span className={`${getCssColorGradientBasedOnPercentage(playerStat.adr)}`}>{playerStat.adr.toFixed(1)}</span>
				</td>
				<div className="basis-1/12">
					<ToolTip
						type="generic"
						message={
							<span className="bg-gray-800 p-1 rounded text-xs">
								{((playerStat.ok / (playerStat.ok + playerStat.ol)) * 100).toFixed(2)}%
							</span>
						}
					>
						<span className={`${playerStat.ok > playerStat.ol ? "text-green-500" : ""}`}>{playerStat.ok}</span>{" "}
						: <span className={`${playerStat.ok < playerStat.ol ? "text-red-500" : ""}`}>{playerStat.ol}</span>
					</ToolTip>
				</div>
				<td
					className={`${getCssColorGradientBasedOnPercentage(Math.round((playerStat.hs / playerStat.kills) * 100) || 0)}`}
				>
					{Math.round((playerStat.hs / playerStat.kills) * 100) || 0}
				</td>
				<td>{playerStat.utilDmg}</td>
			</tr>
			<tr className="hidden sm:table-row">
				<td>{playerStat.name}</td>
				<td>{playerStat.rating.toFixed(2)}</td>
				<td>
					{playerStat.kills} / {playerStat.deaths} / {playerStat.assists}
				</td>
				<td>{playerStat.damage}</td>
				<td className={`${getCssColorGradientBasedOnPercentage(playerStat.adr)}`}>{playerStat.adr.toFixed(1)}</td>
				<td className="basis-1/12">
					<ToolTip
						type="generic"
						message={
							<span className="bg-gray-800 p-1 rounded text-xs">
								{((playerStat.ok / (playerStat.ok + playerStat.ol)) * 100).toFixed(2)}%
							</span>
						}
					>
						<span className={`${playerStat.ok > playerStat.ol ? "text-green-500" : ""}`}>{playerStat.ok}</span>{" "}
						: <span className={`${playerStat.ok < playerStat.ol ? "text-red-500" : ""}`}>{playerStat.ol}</span>
					</ToolTip>
				</td>
				<td
					className={`${getCssColorGradientBasedOnPercentage(Math.round((playerStat.hs / playerStat.kills) * 100) || 0)}`}
				>
					{Math.round((playerStat.hs / playerStat.kills) * 100) || 0}
				</td>
				<td>{playerStat.FAss}</td>
				<td>{playerStat.utilDmg}</td>
				<td className="basis-1/12">			
					<ToolTip
						type="generic"
						message={
							<div className="bg-gray-700 p-2 rounded">
								<div className="flex flex-row">
									<div>
										<div>1v1</div>
										{playerStat.cl_1}
									</div>
									<div>
										<div>1v2</div>
										{playerStat.cl_2}
									</div>
									<div>
										<div>1v3</div>
										{playerStat.cl_3}
									</div>
									<div>
										<div>1v4</div>
										{playerStat.cl_4}
									</div>
									<div>
										<div>Ace</div>
										{playerStat.cl_5}
									</div>
								</div>
							</div>
						}
					>
						{calculateClutchPoints(playerStat)}
					</ToolTip>
				</td>
			</tr>
		</>
	);
}

function MatchStatsTableHeader() {
	return (
		<>
			<thead className="text-left border-b border-gray-600 sm:hidden">
				<th>Name</th>
				<th className="text-center">Rating<br />K/D/A</th>
				<th className="text-center">Damage<br />ADR</th>
				<th>FK/FD</th>
				<th>HS%</th>
				<th>Util Dmg</th>
			</thead>
			<thead className="text-left border-b border-gray-600 hidden sm:table-header-group">
				<th>Name</th>
				<th>Rating</th>
				<th>K/D/A</th>
				<th>Damage</th>
				<th>ADR</th>
				<th>FK/FD</th>
				<th>HS%</th>
				<th>F Asst</th>
				<th>Util Dmg</th>
				<th>Clutch Pts</th>
			</thead>
		</>
	);
}

function MatchStatsTeamScoreLine({ teamIndex, match }: { teamIndex: number; match: Match }) {
	const team = match.teamStats[teamIndex].name;
	const teamPlayers = match?.matchStats.filter(p => p.teamClanName === team).sort((a, b) => b.rating - a.rating);

	return (
		<>
			<div className="relative">
				<div
					className={`absolute -left-20 top-8 -rotate-90 w-28 mr-16 text-center bg-gradient-to-r ${teamIndex ? "from-indigo-500" : "from-orange-500"} font-bold capitalize`}
				>
					{team.replace("_", " ")}
				</div>
			</div>
			{teamPlayers?.map((playerStat, index) => <PlayerMatchStatLine key={index} playerStat={playerStat} />)}
		</>
	);
}

export function MatchHistory({ match }: { match: Match }) {
	return (
		<div className="relative text-xs pb-4">
			<Containers.StandardBackgroundPage>
				<table className="table-auto w-full border-spacing-0.5">
					<MatchStatsTableHeader />
					<tbody>
						<MatchStatsTeamScoreLine teamIndex={0} match={match} />
						<tr>
							<td colSpan={8} className="text-center h-6"></td>
						</tr>
						<MatchStatsTeamScoreLine teamIndex={1} match={match} />
					</tbody>
				</table>
			</Containers.StandardBackgroundPage>
		</div>
	);
}

function MatchExtended({ extendedData } : { extendedData?: Record<string, any> }) {
	const [selectedPage, setSelectedPage] = React.useState("killfeed");
	const tierButtonClass =
	"px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring-0 active:bg-blue-300";

	const pages = [
		{ name: "KillFeed", color: "yellow" },
		{ name: "Trades", color: "white" },
		{ name: "Clutches", color: "green" },
		{ name: "Team Econ", color: "red" },
	]

	if( Object.keys(extendedData?.metadata ?? {}).length > 0 ){
		pages.unshift({ name: "Matchup", color: "purple" })
	}

	return (
		<div className="mb-4">
			<div className="justify-center flex flex-wrap rounded-md mb-4" role="group">
				{pages.filter(page => !!page).map(page => (
					<button
						key={page.name}
						type="button"
						onClick={() => {setSelectedPage(page.name.toLowerCase());}}
						className={`rounded-md ${page.name.toLowerCase() === selectedPage.toLowerCase() ? "bg-blue-500" : "bg-slate-700"} text-${page.color}-400 ${tierButtonClass} shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
					>
						{page.name}
					</button>
				))}
			</div>
			{ selectedPage === "matchup" && <ExtendedMatchHistoryMatchup extendedMatchData={extendedData as any} /> }
			{ selectedPage === "killfeed" && <ExtendedMatchHistoryKillFeed extendedMatchData={extendedData} /> }
			{ selectedPage === "trades" && <ExtendedMatchHistoryTrades extendedMatchData={extendedData} /> }
			{ selectedPage === "clutches" && <ExtendedMatchHistoryClutches extendedMatchData={extendedData} /> }
			{ selectedPage === "team econ" && <ExtendedMatchHistoryTeamEcon extendedMatchData={extendedData} /> }
		</div>
	);
}

const columnCSS = {
	"expandIndicator": "w-6",
	"type": "basis-1/12",
	"map": "basis-14",
	"score": "basis-14",
	"rating": "basis-20 text-center no-wrap",
	"kda": "basis-1/12",
	"dmg": "basis-1/12 text-center",
	"fk/fd": "basis-1/12",
	"hs": "basis-1/12",
	"extras": "basis-1/12 hidden sm:block",
}

function MatchRow({ player, match }: { player: Player; match: Match }) {
	const [isExpanded, setIsExpanded] = React.useState(false);
	const { data: extendedMatchData = {}, isLoading: isLoadingextendedMatchData } = useAnalytikillExtendedMatchStats(String(match.matchId).replace("combines-",""),match.matchType, isExpanded);
	const matchType = match.matchType ?? "broke";
	const p = match.matchStats.find(ms => ms.name === player.name)!;
	const matchDateShort = new Date(match.createdAt ?? 0).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	const matchDateFull = new Date(match.createdAt ?? 0).toLocaleDateString("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	if (p === undefined) {
		console.info(
			"Player is missing match because their name does not appear as a player, possible name change?",
			p,
			"match",
			match,
		);
		return null;
	}

	return (
		<div>
			<div
				className="flex flex-nowrap gap-4 my-1 py-2 hover:cursor-pointer hover:bg-midnight2 rounded text-sm"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className={columnCSS.expandIndicator}>
					{isExpanded ?
						<MdKeyboardArrowDown size="1.5em" className="leading-8 pl-1" />
					:	<MdKeyboardArrowRight size="1.5em" className="leading-8 pl-1" />}
				</div>
				<div className={columnCSS.type}>
					<ToolTip type="generic" message={`Match Id: ${match.matchId}`}>
						{matchType}
					</ToolTip>
					<ToolTip type="generic" message={matchDateFull}>
						<div className="text-xs text-gray-300">{matchDateShort}</div>
					</ToolTip>
					<div className="text-xs text-gray-400">{match?.tier}</div>
				</div>
				<div className={columnCSS.map}>				
					<img className="w-14 h-14 mx-auto" src={mapImages[match.mapName.toLowerCase()]} alt="" />
				</div>
				<div className={columnCSS.score}>
					<span className={`flex flex-nowrap ${p.RF > p.RA ? "text-green-400" : "text-rose-400"}`}>
						{p.RF} : {p.RA}
					</span>
				</div>
				<div className={columnCSS.rating}>
					{p.rating.toFixed(2)}
					<div className="flex flex-nowrap">
						{p.kills} / {p.deaths} / {p.assists}
					</div>
				</div>
				<div className={columnCSS.dmg}>
					<div className="">
						<div className="px-1">{p.damage}</div>
						<div className={`no-wrap inline ${p.adr > 100 ? "text-yellow-400" : ""}`}>
							{p.adr.toFixed(1)}
							{p.adr > 100 &&
								<GoStarFill className="text-yellow-400 inline" />
							}
						</div>
					</div>
				</div>
				<div className={columnCSS["fk/fd"]}>
					<div className="flex flex-nowrap gap-1">
						<span>{p.ok}</span>
						<span>:</span>
						<span>{p.ol}</span>
					</div>
				</div>
				<div
					className={`${columnCSS.hs} ${getCssColorGradientBasedOnPercentage(Math.round((p.hs / p.kills) * 100) || 0)}`}
				>
					{Math.round((p.hs / p.kills) * 100) || 0}
				</div>
				<div className={columnCSS.extras}>
					<div>
						<ToolTip
							type="generic"
							message={
								<div className="bg-gray-700 p-2 rounded">
									<div className="flex flex-col">
										<div>1v1: {p.cl_1}</div>
										<div>1v2: {p.cl_2}</div>
										<div>1v3: {p.cl_3}</div>
										<div>1v4: {p.cl_4}</div>
										<div>Aces: {p.cl_5}</div>
									</div>
								</div>
							}
						>
							{calculateClutchPoints(p)}
						</ToolTip>
					</div>
				</div>
				<div className={columnCSS.extras}>
					<div className="flex flex-row justify-evenly">
						<div>
							{p.FAss} 
							<img className="px-1 w-6 h-6 inline" src={cs2killfeedIcons["flashAssist"]} />
						</div>
						<div>
							{p?.utilDmg} 
							<img className="px-1 w-6 h-6 inline" src={cs2icons["HE Grenade"]} />
						</div>						
					</div>
				</div>
			</div>
			{isExpanded && <MatchHistory match={match} />}
			{isExpanded && Object.keys(extendedMatchData).length > 0 && !isLoadingextendedMatchData && <MatchExtended extendedData={extendedMatchData} />}
			{isExpanded && isLoadingextendedMatchData && <Loading /> }
			{isExpanded && !isLoadingextendedMatchData && Object.keys(extendedMatchData).length === 0 && <div className="text-center font-bold text-gray-500">Extended match data is not yet available for this match, check back later.</div> }
		</div>
	);
}

export function PlayerMatchHistory({ player, season }: Props) {
	const { data: playerMatchHistory, isLoading: isLoadingPlayerMatchHistory } = useCscPlayerMatchHistoryGraph(player, season);
	const [showAll, setShowAll] = React.useState(false);

	const sortedPlayerMatchHistory = playerMatchHistory?.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	if (playerMatchHistory?.length === 0 && !playerMatchHistory) {
		return null;
	}

	if (isLoadingPlayerMatchHistory) {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	return (
		<div className="px-4">
			<h2 className="text-2xl p-2">
				<div className="font-extrabold uppercase">Match History</div>
				<div className="text-sm text-gray-500">{playerMatchHistory?.length} matches</div>
			</h2>
			<div className="flex flex-row gap-4 h-16 items-center border-b border-gray-600">
				<div className={columnCSS.expandIndicator}/>
				<div className={columnCSS.type}>Type</div>
				<div className={columnCSS.map}>Map</div>
				<div className={columnCSS.score}>Score</div>
				<div className={columnCSS.rating}>Rating<br />K/D/A</div>
				<div className={`${columnCSS.dmg} text-center`}>Damage<br /> ADR</div>
				<div className={columnCSS["fk/fd"]}>
					<ToolTip type="generic" message="First Kill / First Death">
						FK/FD
					</ToolTip>
				</div>
				<div className={columnCSS.hs}>HS%</div>
				<div className={columnCSS.extras}>Clutch</div>
				<div className={columnCSS.extras}></div>
			</div>
			{(showAll ? sortedPlayerMatchHistory : sortedPlayerMatchHistory?.slice(0, 5))?.map(match => (
				<MatchRow key={match.matchId} player={player} match={match} />
			))}
			{!showAll && (playerMatchHistory ?? []).length > 5 && (
				<div
					className="text-center hover:cursor-pointer hover:bg-midnight2 rounded"
					onClick={() => setShowAll(!showAll)}
				>
					Show All
				</div>
			)}
		</div>
	);
}

export function TeamMatchHistory({ teamName, matchIds }: { teamName: string; matchIds: string[] }) {
	const { seasonAndMatchType } = useDataContext();
	const { data: teamMatchHistory, isLoading: isLoadingPlayerMatchHistory } = useCscTeamMatchHistoryGraph(
		teamName,
		matchIds,
		seasonAndMatchType.season,
	);
	const [showAll, setShowAll] = React.useState(false);

	const sortedPlayerMatchHistory = teamMatchHistory?.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	if (teamMatchHistory?.length === 0 && !teamMatchHistory) {
		return null;
	}

	if (isLoadingPlayerMatchHistory) {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	return (
		<div className="my-4 p-4">
			<h2 className="text-2xl p-2 text-center">
				<span className="font-bold">Match History</span> - {teamMatchHistory?.length} matches
			</h2>
			<h2 className="text-center text-sm text-gray-600">Feature in Progress</h2>
			{(showAll ? sortedPlayerMatchHistory : sortedPlayerMatchHistory?.slice(0, 5))?.map(match => (
				<div>
					<Exandable
						title={
							<div>
								<img
									src={mapImages[match.mapName]}
									className="w-8 inline mx-2"
									alt={match.mapName}
								/>
								Home <span className="text-indigo-400 mx-2">{match.teamStats[0].name}</span>
								vs.
								<span className="text-orange-400 mx-2">{match.teamStats[1].name}</span>
								Away
							</div>
						}
					>
						<div className="relative text-xs pb-4">
							<Containers.StandardBackgroundPage>
								<table className="table-auto w-full border-spacing-0.5">
									<MatchStatsTableHeader />
									<tbody>
										<MatchStatsTeamScoreLine teamIndex={0} match={match} />
										<tr>
											<td colSpan={10}>
												<Scoreboard matchId={String(match.matchId)} />
											</td>
										</tr>
										<MatchStatsTeamScoreLine teamIndex={1} match={match} />
									</tbody>
								</table>
							</Containers.StandardBackgroundPage>
						</div>
					</Exandable>
				</div>
			))}
			{!showAll && (teamMatchHistory ?? []).length > 5 && (
				<div
					className="text-center hover:cursor-pointer hover:bg-midnight2 rounded"
					onClick={() => setShowAll(!showAll)}
				>
					Show All
				</div>
			)}
		</div>
	);
}
