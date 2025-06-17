import * as React from "react";
import { StatsLeaderBoard } from "./stats";
import { CscStats, Player } from "../../models";
import { _sort } from "../../common/utils/player-utils";
import { Container } from "../../common/components/container";

function buildTableRow(player: Player, columnName: string, property: keyof CscStats) {
	return { player, value: player.stats[property] };
}

export function GeneralLeaderBoards({ players, limit }: { players: Player[]; limit: number }) {
	
	const gamesPlayed = _sort(players, "stats.gameCount", limit, "desc").map(p =>
		buildTableRow(p, "Games Played", "gameCount"),
	);
	const kills = _sort(players, "stats.kills", limit, "desc").map(p => ({
		player: p,
		value: p.stats.kills,
	}));
	const killDeathRatio = players
		.sort((a, b) => (a.stats.kills / a.stats.deaths < b.stats.kills / b.stats.deaths ? 1 : -1))
		.slice(0, limit)
		.map(p => ({
			player: p,
			value: (p.stats.kills / p.stats.deaths).toFixed(2),
		}));
	const aces = players
		.sort((a, b) => (a.stats["fiveK"] < b.stats["fiveK"] ? 1 : -1))
		.slice(0, limit)
		.map(p => ({ player: p, value: p.stats["fiveK"] }));
	const twoK = players
		.sort((a, b) => (a.stats["twoK"] < b.stats["twoK"] ? 1 : -1))
		.slice(0, limit)
		.map(p => ({ player: p, value: p.stats["twoK"] }));
	const threeK = players
		.sort((a, b) => (a.stats["threeK"] < b.stats["threeK"] ? 1 : -1))
		.slice(0, limit)
		.map(p => ({ player: p, value: p.stats["threeK"] }));
	const fourK = players
		.sort((a, b) => (a.stats["fourK"] < b.stats["fourK"] ? 1 : -1))
		.slice(0, limit)
		.map(p => ({ player: p, value: p.stats["fourK"] }));
	const damagePerRound = _sort(players, "stats.adr", limit, "desc").map(p => ({
		player: p,
		value: p.stats.adr.toFixed(2),
	}));
	const awpKillsPerRound = _sort(players, "stats.awpR", limit, "desc").map(p => ({
		player: p,
		value: p.stats["awpR"].toFixed(2),
	}));
	const utilDamagePerMatch = _sort(players, "stats.utilDmg", limit, "desc").map(p => ({
		player: p,
		value: p.stats.utilDmg.toFixed(2),
	}));
	// const timeToDeath = _sort(playerData, "stats.atd", 5).map( p => ({ "Player": p.name,   "Time til Death (seconds)": p.ATD}));
	const ctRating = _sort(players, "stats.ctRating", limit, "desc").map(p => ({
		player: p,
		value: p.stats.ctRating.toFixed(2),
	}));
	const tRating = _sort(players, "stats.TRating", limit, "desc").map(p => ({
		player: p,
		value: p.stats.TRating.toFixed(2),
	}));
	const kastPercentage = _sort(players, "stats.kast", limit, "desc").map(p => ({
		player: p,
		value: p.stats.kast.toFixed(2),
	}));
	const utilThrownPerMatchX = _sort(players, "stats.util");
	const utilThrownPerMatch = utilThrownPerMatchX
		.map(p => ({ player: p, value: p.stats.util }))
		.reverse()
		.splice(0, limit);
	const leastUtilThrownPerMatch = utilThrownPerMatchX.map(p => ({ player: p, value: p.stats.util })).splice(0, limit);
	const headshotPercentage = _sort(players, "stats.hs", limit, "desc").map(p => ({ player: p, value: p.stats.hs }));
	const clutchAbility = _sort(players, "stats.clutchR", limit, "desc").map(p => ({
		player: p,
		value: p.stats["clutchR"].toFixed(2),
	}));
	const clutchOneVsTwo = _sort(players, "stats.cl_2", limit, "desc").map(p => ({
		player: p,
		value: p.stats["cl_2"].toFixed(0),
	}));
	const clutchOneVsThree = _sort(players, "stats.cl_3", limit, "desc").map(p => ({
		player: p,
		value: p.stats["cl_3"].toFixed(0),
	}));
	const clutchOneVsFour = _sort(players, "stats.cl_4", limit, "desc").map(p => ({
		player: p,
		value: p.stats["cl_4"].toFixed(0),
	}));
	//const clutchOneVsFive = _sort(players, "stats.cl_5", limit, "desc").map( p => ({ player: p, value: p.stats['cl_5'].toFixed(0)}));
	// const grenadeDamagePerRound = _sort(playerData, "X/nade", 5).map( p => ({ "Player": p.name,   "Grenade Damage Per Round": p["Xnade"]}));
	const openDuels = _sort(players, "stats.odr", limit, "desc").map(p => ({
		player: p,
		value: p.stats.odr.toFixed(2),
	}));
	const fAssists = _sort(players, "stats.fAssists", limit, "desc").map(p => ({
		player: p,
		value: p.stats.fAssists.toFixed(2),
	}));
	const ef = _sort(players, "stats.ef", limit, "desc").map(p => ({
		player: p,
		value: p.stats.ef.toFixed(2),
	}));

	return (
		<Container>
		{ players.length ?
			<div className="flex">
				<div className="flex flex-row flex-wrap w-full gap-6">
					<StatsLeaderBoard title="Games Played" rows={gamesPlayed} />
					<StatsLeaderBoard title="Most Kills" rows={kills} />
					<StatsLeaderBoard title="Highest K/D Ratio" rows={killDeathRatio} />
					<StatsLeaderBoard title="Most Aces" rows={aces} />
					<StatsLeaderBoard title="Damager Per Round" rows={damagePerRound} />
					<StatsLeaderBoard title="Most 2K's" rows={twoK} />
					<StatsLeaderBoard title="Most 3K's" rows={threeK} />
					<StatsLeaderBoard title="Most 4K's" rows={fourK} />
					<StatsLeaderBoard title="Flash Assists per Match" rows={fAssists} />
					<StatsLeaderBoard title="Awp Kills per Round" rows={awpKillsPerRound} />
					<StatsLeaderBoard title="Utility Damage per Match" rows={utilDamagePerMatch} />
					<StatsLeaderBoard title="CT-Side Rating" rows={ctRating} />
					<StatsLeaderBoard title="T-Side Rating" rows={tRating} />
					<StatsLeaderBoard title="Kill/Assist/Survive/Traded" rows={kastPercentage} />
					<StatsLeaderBoard title="Utility Thrown Per Match" rows={utilThrownPerMatch} />
					<StatsLeaderBoard title="Least Utility Thrown Per Match" rows={leastUtilThrownPerMatch} />
					<StatsLeaderBoard title="Highest Headshot Percentage" rows={headshotPercentage} />
					<StatsLeaderBoard title="Clutch Points Average per Match" rows={clutchAbility} />
					<StatsLeaderBoard title="One vs Two Clutch" rows={clutchOneVsTwo} />
					<StatsLeaderBoard title="One vs Three Clutch" rows={clutchOneVsThree} />
					<StatsLeaderBoard title="One vs Four Clutch" rows={clutchOneVsFour} />
					<StatsLeaderBoard title="Open Duels Per Round" rows={openDuels} />
					<StatsLeaderBoard title="Enemies Flashed per Match" rows={ef} />
				</div>
			</div>
			:
			<div className="w-full m-4 text-center text-2xl text-gray-500 font-extrabold uppercase">
				No Players seem to meet the criteria.
			</div>
		}
		</Container>
	);
}
