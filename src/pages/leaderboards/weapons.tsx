import * as React from "react";
import { Player } from "../../models";
import { LeaderBoard } from "../../common/components/leaderboard";
import { WeaponKills } from "../../models/extended-stats";


export function WeaponLeaderboards( { players, limit }: { players: Player[], limit: number } ) {

    const weaponStrings = [ 
        "Zeus x27",
        "Knife",
        "AK-47", 
        "M4A1",
        "M4A4", 
        "Galil AR", 
        "FAMAS",
        "AUG",
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
        "R8 Revolver",
        "MP5-SD",
        "MP7",
        "MP9",
        "XM1014",
        "Nova",
        "MAC-10",
        "Negev",
        "Incendiary Grenade",
        "Molotov",
        "HE Grenade",
        ];

    const weaponLeaderBoards = weaponStrings.map( (weapon) => {
        const board = players.filter((p) => p.extendedStats).sort( (a, b) => (b?.extendedStats.weaponKills[weapon as keyof WeaponKills] ?? 0) - (a.extendedStats?.weaponKills[weapon as keyof WeaponKills] ?? 0) ).slice(0, limit);
        return { title: weapon, rows: board.map( (player) => { return { player, value: player.extendedStats?.weaponKills[weapon as keyof WeaponKills] ?? 0 } }) };
    })

    return (
        <>
            { weaponLeaderBoards.map( (board) => <LeaderBoard key={board.title} title={board.title} rows={board.rows} /> ) }
        </>
    );
}