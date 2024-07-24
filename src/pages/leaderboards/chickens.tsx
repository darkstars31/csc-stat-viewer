import * as React from "react";
import { Container } from "../../common/components/container";
import chicken from "../../assets/images/chicken.png";
import { Player } from "../../models";
import { StatsLeaderBoard } from "./stats";
import { _sort } from "../../common/utils/player-utils";
import { cs2killfeedIcons } from "../../common/images/cs2icons";

export function Chickens({ players, limit }: { players: Player[]; limit?: number }) {
	const playersWithExtendedStats = players.filter(p => p.extendedStats);

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

	const chickenLeaderBoard = _sort(playersWithExtendedStats, "extendedStats.chickens.killed", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.chickens.killed,
		}),
	);
	const ninjaLeaderBoard = _sort(
		playersWithExtendedStats,
		"extendedStats.trackedObj.ninjaDefuses",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.ninjaDefuses,
	}));
	const noScopesLeaderBoard = _sort(
		playersWithExtendedStats,
		"extendedStats.trackedObj.noScopesKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.noScopesKills,
	}));
	const wallBangLeaderBoard = _sort(
		playersWithExtendedStats,
		"extendedStats.trackedObj.wallBangKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.wallBangKills,
	}));
	const smokeKillLeaderBoard = _sort(
		playersWithExtendedStats,
		"extendedStats.trackedObj.smokeKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.smokeKills,
	}));
	const airborneKills = _sort(playersWithExtendedStats, "extendedStats.trackedObj.airborneKills", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.airborneKills,
		}),
	);

	const bombPlants = _sort(playersWithExtendedStats, "extendedStats.trackedObj.bombsPlanted", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.bombsPlanted,
		}),
	);
	const defuses = _sort(playersWithExtendedStats, "extendedStats.trackedObj.bombsDefused", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.bombsDefused,
		}),
	);
	const diedToBomb = _sort(playersWithExtendedStats, "extendedStats.trackedObj.diedToBomb", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.diedToBomb,
		}),
	);
	const mvpStars = _sort(playersWithExtendedStats, "extendedStats.trackedObj.mvpCount", limit, "desc").map(
		player => ({
			player: player,
			value: player.extendedStats.trackedObj.mvpCount,
		}),
	);

	const TeamKillLeaderBoard = _sort(
		playersWithExtendedStats,
		"extendedStats.trackedObj.teamKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.teamKills,
	}));
	const selfKillLeaderBoard = _sort(
		playersWithExtendedStats,
		"extendedStats.trackedObj.selfKills",
		limit,
		"desc",
	).map(player => ({
		player: player,
		value: player.extendedStats.trackedObj.selfKills,
	}));

	return (
		<Container>
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
				<StatsLeaderBoard title="Ninja Defuses" rows={ninjaLeaderBoard} />
				<StatsLeaderBoard
					title="No Scopes"
					rows={noScopesLeaderBoard}
					headerImage={cs2killfeedIcons["noScope"]}
				/>
				<StatsLeaderBoard
					title="Wall Bangs"
					rows={wallBangLeaderBoard}
					headerImage={cs2killfeedIcons["wallBang"]}
				/>
				<StatsLeaderBoard
					title="Smoke Kills"
					rows={smokeKillLeaderBoard}
					headerImage={cs2killfeedIcons["smokeKill"]}
				/>
				<StatsLeaderBoard title="Airborne Kills" rows={airborneKills} />

				<StatsLeaderBoard title="Bombs Planted" rows={bombPlants} />
				<StatsLeaderBoard title="Bombs Defused" rows={defuses} />
				<StatsLeaderBoard title="Died To Bomb" rows={diedToBomb} />

				<StatsLeaderBoard title="MVPs" rows={mvpStars} />

				<StatsLeaderBoard title="Team Kills" rows={TeamKillLeaderBoard} />
				<StatsLeaderBoard
					title="Self Kills"
					rows={selfKillLeaderBoard}
					headerImage={cs2killfeedIcons["suicide"]}
				/>
			</div>
		</Container>
	);
}
