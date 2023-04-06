import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Table } from "../common/components/table";
import { useDataContext } from "../DataContext";
import { tiers, _sort } from "../common/utils/player-utils";
import { Player } from "../models";
import { Select } from "../common/components/select";
//import { tiers } from "./player-utils";

function buildTableRow( player: Player, columnName: string, property: keyof Player ){
    return { "Player": player.Name, "Tier": player.Tier, [columnName]: player[property]};
}

export function LeaderBoards() {
    const { playerStats, isLoading } = useDataContext();
    const [ filterBy, setFilterBy ] = React.useState<string>("All");

    const playerData = filterBy.includes("All") ? playerStats.filter( f => f.GP >= 3) : playerStats.filter( f => f.GP >= 3 && f.Tier === filterBy);
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
    const kastPercentage = _sort(playerData, "KAST", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "KAST%": p.KAST}));
    const utilThrownPerMatchX = _sort(playerData, "Util");
    const utilThrownPerMatch = utilThrownPerMatchX.map( p => ({ "Player": p.Name, "Tier": p.Tier, "Util/Match": p.Util})).splice(0,5);
    const leastUtilThrownPerMatch = utilThrownPerMatchX.reverse().map( p => ({ "Player": p.Name, "Tier": p.Tier, "Least Util/Match": p.Util })).splice(0,15);
    const headshotPercentage = _sort(playerData, "HS", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "HeadShot %": p.HS}));
    const clutchAbility = _sort(playerData, "clutch/R", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Clutch Points per Match": p['clutch/R']}));
    const mostConsistent = _sort(playerData, "CONCY", 5).reverse().map( p => ({ "Player": p.Name, "Tier": p.Tier, "Most Consistent Rating": p['CONCY']}));



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
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <div className="flex flex-box h-12 mx-auto justify-end">
                    <div className="basis-1/6">
                        <Select
                            label="Tier"
                            options={["All", ...tiers].map( tier => ({ id: tier, value: tier}))}
                            onChange={ ( e ) => setFilterBy( e.currentTarget.value )}
                            value={filterBy}
                        />
                </div>
            </div>
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

            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Kill/Asset/Survived/Traded
                    <Table rows={kastPercentage}/>
                </div>
                <div className="m-4">
                    Utility Thrown Per Match
                    <Table rows={utilThrownPerMatch}/>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Least Utility Thrown Per Match
                    <Table rows={leastUtilThrownPerMatch}/>
                </div>
                <div className="m-4">
                    Highest Headshot Percentage
                    <Table rows={headshotPercentage}/>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="m-4">
                    Clutch Points Average per Match
                    <Table rows={clutchAbility}/>
                </div>
                <div className="m-4">
                    Most Consistent Rating
                    <Table rows={mostConsistent}/>
                </div>
            </div>
          
        </Container>
    );
}