import * as React from "react";
import { Container } from "../../common/components/container";
import chicken from "../../assets/images/chicken.png";
import { Player } from "../../models";
import { StatsLeaderBoard } from "./stats";
import { _sort, _sortByGameCount } from "../../common/utils/player-utils";
import { cs2killfeedIcons } from "../../common/images/cs2icons";

export function ExtendedLeaderboards({ players, limit, filterExtendedStatsByGamesPlayed }: { players: Player[]; limit?: number, filterExtendedStatsByGamesPlayed?: boolean }) {
	const playersWithExtendedStats = players.filter(p => p.extendedStats);
	const sortingFunction = filterExtendedStatsByGamesPlayed ? _sortByGameCount : _sort;
	const toFixedAmount = filterExtendedStatsByGamesPlayed ? 2 : 0;

	const totalChickenKills = playersWithExtendedStats.reduce(
		(total, player) => total + player.extendedStats.chickens.killed,
		0,
	);
	const chickenDeathTotals = {
		Knifed: playersWithExtendedStats.reduce((total, player) => total + player.extendedStats.chickens.stabbed, 0),
		Roasted: playersWithExtendedStats.reduce((total, player) => total + player.extendedStats.chickens.roasted, 0),
		Exploded: playersWithExtendedStats.reduce((total, player) => total + player.extendedStats.chickens.exploded, 0),
		Shot: playersWithExtendedStats.reduce((total, player) => total + player.extendedStats.chickens.shot, 0),
	};

	const chickenLeaderBoard = sortingFunction(playersWithExtendedStats, "extendedStats.chickens.killed", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.chickens.killed.toFixed(toFixedAmount),
		}),
	);
	const ninjaLeaderBoard = sortingFunction(
		playersWithExtendedStats,
		"extendedStats.trackedObj.ninjaDefuses",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.ninjaDefuses.toFixed(toFixedAmount),
	}));
	const noScopesLeaderBoard = sortingFunction(
		playersWithExtendedStats,
		"extendedStats.trackedObj.noScopesKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.noScopesKills.toFixed(toFixedAmount),
	}));
	const wallBangLeaderBoard = sortingFunction(
		playersWithExtendedStats,
		"extendedStats.trackedObj.wallBangKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.wallBangKills.toFixed(toFixedAmount),
	}));
	const smokeKillLeaderBoard = sortingFunction(
		playersWithExtendedStats,
		"extendedStats.trackedObj.smokeKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.smokeKills.toFixed(toFixedAmount),
	}));
	const airborneKills = sortingFunction(playersWithExtendedStats, "extendedStats.trackedObj.airborneKills", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.airborneKills.toFixed(toFixedAmount),
		}),
	);

	const bombPlants = sortingFunction(playersWithExtendedStats, "extendedStats.trackedObj.bombsPlanted", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.bombsPlanted.toFixed(toFixedAmount),
		}),
	);
	const defuses = sortingFunction(playersWithExtendedStats, "extendedStats.trackedObj.bombsDefused", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.bombsDefused.toFixed(toFixedAmount),
		}),
	);
	const diedToBomb = sortingFunction(playersWithExtendedStats, "extendedStats.trackedObj.diedToBomb", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.diedToBomb.toFixed(toFixedAmount),
		}),
	);
	const mvpStars = sortingFunction(playersWithExtendedStats, "extendedStats.trackedObj.mvpCount", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.mvpCount.toFixed(toFixedAmount),
		}),
	);

	const TeamKillLeaderBoard = sortingFunction(
		playersWithExtendedStats,
		"extendedStats.trackedObj.teamKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.teamKills.toFixed(toFixedAmount),
	}));
	const selfKillLeaderBoard = sortingFunction(
		playersWithExtendedStats,
		"extendedStats.trackedObj.selfKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.selfKills.toFixed(toFixedAmount),
	}));

	const subtitle = filterExtendedStatsByGamesPlayed ? `Per Match` : ``;

	return (
		<Container>
		{ players.length ?
			<>
				<div className="flex">
					<div className="flex flex-row flex-wrap w-full">
						<div className="flex flex-col">
							<div>
								<div className="text-3xl text-center m-4">
									<img className="m-auto h-16 w-16" src={chicken} alt="Chickens" />
									killed
								</div>
								<div className="text-6xl text-center m-4 pt-4">{totalChickenKills}</div>
							</div>
							<div className="flex flex-row flex-wrap">
								{Object.entries(chickenDeathTotals).map(([key, value]) => (
									<div className="text-l text-center m-auto w-32">
										<div>{key}</div>
										<div className="text-center">{value}</div>
									</div>
								))}
							</div>
						</div>
						<StatsLeaderBoard title="Chickens Killed" rows={chickenLeaderBoard} />
					</div>
				</div>
				<div className="flex flex-row flex-wrap m-auto gap-4">
					<StatsLeaderBoard
						title="Ninja Defuses"
						subtitle={subtitle}
						rows={ninjaLeaderBoard} 
					/>
					<StatsLeaderBoard
						title="No Scopes"
						subtitle={subtitle}
						rows={noScopesLeaderBoard}
						headerImage={cs2killfeedIcons["noScope"]}
					/>
					<StatsLeaderBoard
						title="Wall Bangs"
						subtitle={subtitle}
						rows={wallBangLeaderBoard}
						headerImage={cs2killfeedIcons["wallBang"]}
					/>
					<StatsLeaderBoard
						title="Smoke Kills"
						subtitle={subtitle}
						rows={smokeKillLeaderBoard}
						headerImage={cs2killfeedIcons["smokeKill"]}
					/>
					<StatsLeaderBoard 
						title="Airborne Kills" 
						subtitle={subtitle} 
						rows={airborneKills}
						headerImage={cs2killfeedIcons["airborne"]}
					/>

					<StatsLeaderBoard title="Bombs Planted" subtitle={subtitle} rows={bombPlants} />
					<StatsLeaderBoard title="Bombs Defused" subtitle={subtitle} rows={defuses} />
					<StatsLeaderBoard title="Died To Bomb" subtitle={subtitle} rows={diedToBomb} />

					<StatsLeaderBoard title="MVPs" subtitle={subtitle} rows={mvpStars} />

					<StatsLeaderBoard title="Team Kills" subtitle={subtitle} rows={TeamKillLeaderBoard} />
					<StatsLeaderBoard
						title="Self Kills"
						subtitle={subtitle}
						rows={selfKillLeaderBoard}
						headerImage={cs2killfeedIcons["suicide"]}
					/>
				</div>
			</>
			:			
			<div className="w-full m-4 text-center text-2xl text-gray-500 font-extrabold uppercase">
				No Players seem to meet the criteria.
			</div>
		 }
		</Container>
	);
}
