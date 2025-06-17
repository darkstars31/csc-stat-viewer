import * as React from "react";
import { Player } from "../../models";
import { StatsLeaderBoard } from "./stats";
import { WeaponKills } from "../../models/extended-stats";
import { cs2icons } from "../../common/images/cs2icons";
import { Container } from "../../common/components/container";

export function WeaponLeaderboards({ players, limit }: { players: Player[]; limit: number, filterExtendedStatsByGamesPlayed?: boolean }) {
	const weaponStrings = [
		"Zeus x27",
		"Knife",
		"AK-47",
		"M4A1",
		"M4A4",
		"Galil AR",
		"FAMAS",
		"AUG",
		"SG 553",
		"AWP",
		"SSG 08",
		"Desert Eagle",
		"USP-S",
		"Glock-18",
		"P2000",
		"P250",
		"Five-SeveN",
		"Tec-9",
		"Dual Berettas",
		"CZ75 Auto",
		"R8 Revolver",
		"MP5-SD",
		"MP7",
		"MP9",
		"UMP-45",
		"P90",
		"PP-Bizon",
		"XM1014",
		"Nova",
		"Sawed-Off",
		"MAG-7",
		"MAC-10",
		"M249",
		"Negev",
		"G3SG1",
		"Incendiary Grenade",
		"Molotov",
		"HE Grenade",
		"Flashbang",
	];

	const weaponLeaderBoards = weaponStrings.map(weapon => {
		const board = players
			.filter(p => p.extendedStats)
			.sort(
				(a, b) =>
					(b?.extendedStats.weaponKills[weapon as keyof WeaponKills] ?? 0) -
					(a.extendedStats?.weaponKills[weapon as keyof WeaponKills] ?? 0),
			)
			.slice(0, limit);
		return {
			title: weapon,
			rows: board.map(player => {
				return {
					player,
					value: player.extendedStats?.weaponKills[weapon as keyof WeaponKills] ?? 0,
				};
			}),
		};
	});

	return (
		<Container>
			<div className="flex flex-row flex-wrap m-auto gap-4">
			{ players.length ? 
				weaponLeaderBoards.map(board => (
					<StatsLeaderBoard
						key={board.title}
						title={board.title}
						headerImage={cs2icons[board.title]}
						rows={board.rows.filter(row => row.value > 0)}
					/>
				))
			:		
			<div className="w-full m-4 text-center text-2xl text-gray-500 font-extrabold uppercase">
				No Players seem to meet the criteria.
			</div>
			}
		</div>
		</Container>
	);
}
