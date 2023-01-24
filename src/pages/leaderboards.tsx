import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Table } from "../common/components/table";
import { useDataContext } from "../DataContext";
import { _sort } from "./player-utils";
import { Player } from "../models";
//import { tiers } from "./player-utils";

function buildTableRow( player: Player, columnName: string, property: keyof Player ){
    return { "Player": player.Name, "Tier": player.Tier, [columnName]: player[property]};
}

export function LeaderBoards() {
    //const [ selectedTier, setSelectedTier ] = React.useState("");
    const { season10CombinePlayers, isLoading } = useDataContext();

    const playerData = season10CombinePlayers.filter( f => f.GP >= 3);
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

    if( isLoading ) {
        return <Container><Loading /></Container>;
    }

    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Leaderboards</h2>
                <p className="mt-4 text-gray-300">
                    See who's at the top (or bottom, we won't judge). Requirement of 3 games played before stats are included on the leaderboards.
                </p>
                {/* <ul className="grid md:grid-cols-5">
                    {tiers.map( tier => 
                        <li key={`tier-${tier}`}>
                        <input type="radio" id="tier-picker" name="tier-picker" value={tier} className="hidden peer" required onChange={ ( e ) => setSelectedTier( e.currentTarget.value ) }/>
                        <label htmlFor="tier-picker" className="inline-flex w-full items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-500 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-blue-800">
                            <div className="text-xs font-semibold text-center">{tier}</div>
                        </label>
                    </li>
                    )}
                </ul> */}
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Games Played
                    <Table rows={gamesPlayed}/>
                </div>
                <div className="m-4">
                    Most Kills
                    <Table rows={kills}/>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Highest Kill / Death Ratio
                    <Table rows={killDeathRatio}/>
                </div>
                <div className="m-4">
                    Most Aces
                    <Table rows={aces}/>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Damager Per Round
                    <Table rows={damagePerRound}/>
                </div>
                <div className="m-4">
                    Survival Time (Seconds)
                    <Table rows={timeToDeath}/>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Awp Kills per Round
                    <Table rows={awpKillsPerRound}/>
                </div>
                <div className="m-4">
                    Utility Damage per Match
                    <Table rows={utilDamagePerMatch}/>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
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