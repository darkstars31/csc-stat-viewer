import * as React from "react";
import { Container } from "../common/container";
import { Table } from "../common/table";
import { Player } from "../models";

type Props = {
    request: {
        data: Player[],
        isLoading: boolean,
    }
}

function _sort<T, K extends keyof T>( items: T[], property: K, n: number  ) {
    return items.sort( (a,b) => a[property] < b[property] ? 1 : -1).slice(0,n);
}

function buildTableRow( player: Player, columnName: string, property: keyof Player ){
    return { "Player": player.Name, "Tier": player.Tier, [columnName]: player[property]};
}

export function LeaderBoards( { request }: Props ) {
    const playerData = request.data.filter( f => f.GP >= 3);
    const gamesPlayed = _sort(playerData, "GP", 5).map( p => buildTableRow(p, "Games Played", "GP"));
    const kills = _sort(playerData, "Kills", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Kills": p.Kills}));
    const killDeathRatio = playerData.sort( (a,b) => (a.Kills/a.Deaths) < (b.Kills/b.Deaths) ? 1 : -1).slice(0,5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "K/D Ratio": (p.Kills/p.Deaths).toFixed(2)}));
    const aces = playerData.sort( (a,b) => (a["5k"]) < (b["5k"]) ? 1 : -1).slice(0,5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Aces": p["5k"] }));
    const damagePerRound = _sort(playerData, "ADR", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Average Damage Per Round": p.ADR}));
    const awpKillsPerRound = _sort(playerData, "awp/R", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Awp Kills per Round": p["awp/R"]}));
    const utilDamagePerMatch = _sort(playerData, "UD", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Utility Damage": p.UD}));
    const timeToDeath = _sort(playerData, "ATD", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Time til Death (seconds)": p.ATD}));
    const ctRating = _sort(playerData, "ctADP", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Rating": p.ctADP}));
    const tRating = _sort(playerData, "tADP", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Rating": p.tADP}));

    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Leaderboards</h2>
                <p className="mt-4 text-gray-300">
                See who's at the top (or bottom, we won't judge). Requirement of 3 games played before stats are included on the leaderboards.
                </p>
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />

            <div className="grid grid-cols-2">
                <div className="m-4">
                    Games Played
                    <Table rows={gamesPlayed}/>
                </div>
                <div className="m-4">
                    Most Kills
                    <Table rows={kills}/>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="m-4">
                    Highest Kill / Death Ratio
                    <Table rows={killDeathRatio}/>
                </div>
                <div className="m-4">
                    Most Aces
                    <Table rows={aces}/>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="m-4">
                    Damager Per Round
                    <Table rows={damagePerRound}/>
                </div>
                <div className="m-4">
                    Survival Time (Seconds)
                    <Table rows={timeToDeath}/>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="m-4">
                    Awp Kills per Round
                    <Table rows={awpKillsPerRound}/>
                </div>
                <div className="m-4">
                    Utility Damage per Match
                    <Table rows={utilDamagePerMatch}/>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="m-4">
                    CT-Side Rating
                    <Table rows={ctRating}/>
                </div>
                <div className="m-4">
                    T-Side Rating
                    <Table rows={tRating}/>
                </div>
            </div>
        </Container>
    );
}