import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Table } from "../common/components/table";
import { useDataContext } from "../DataContext";
//import { _sort } from "../common/utils/player-utils";
import Select, { SingleValue } from "react-select";
import { Player } from "../models/player";
import { CscStats } from "../models/csc-stats-types";
import _sort from "lodash/sortBy";

function buildTableRow( player: Player, columnName: string, property: keyof CscStats ){
    return { "Player": player.name, "Tier": player.tier.name, [columnName]: player.stats[property]};
}

export function LeaderBoards() {
    const { players = [], loading } = useDataContext();
    const [ filterBy, setFilterBy ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: `All`, value: "All"});
    
    // OLD const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats ).filter( s => s!.GP >= 3) as PlayerStats[];
    const player = players.filter( p => Boolean(p.stats) ).filter( p => p.stats.GP >= 3);
    
    const playerData = filterBy?.value.includes("All") ? player : player.filter( f => f.tier.name.toLowerCase() === filterBy?.value.toLowerCase());
      
    const gamesPlayed = _sort(playerData, "GP", 5).map( p => buildTableRow(p, "Games Played", "GP"));
    const kills = _sort(playerData, "stats.kills", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Kills": p.stats.kills}));
    const killDeathRatio = playerData.sort( (a,b) => (a.stats.kills/a.stats.deaths) < (b.stats.kills/b.stats.deaths) ? 1 : -1).slice(0,5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "K/D Ratio": (p.stats.kills/p.stats.deaths).toFixed(2)}));
    const aces = playerData.sort( (a,b) => (a.stats["fiveK"]) < (b.stats["fiveK"]) ? 1 : -1).slice(0,5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Aces": p.stats["fiveK"] }));
    const damagePerRound = _sort(playerData, "stats.adr", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Average Damage Per Round": p.stats.adr}));
    const awpKillsPerRound = _sort(playerData, "stats.awpR", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Awp Kills per Round": p.stats["awpR"]}));
    const utilDamagePerMatch = _sort(playerData, "stats.utilDmg", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Utility Damage": p.stats.utilDmg}));
    // const timeToDeath = _sort(playerData, "stats.ATD", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Time til Death (seconds)": p.ATD}));
    // const ctRating = _sort(playerData, "ctADP", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Rating": p.ctADP}));
    // const tRating = _sort(playerData, "tADP", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Rating": p.tADP}));
    const kastPercentage = _sort(playerData, "stats.kast", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "KAST%": p.stats.kast}));
    const utilThrownPerMatchX = _sort(playerData, "stats.util");
    const utilThrownPerMatch = utilThrownPerMatchX.map( p => ({ "Player": p.name, "Tier": p.tier.name, "Util/Match": p.stats.util})).splice(0,5);
    const leastUtilThrownPerMatch = utilThrownPerMatchX.reverse().map( p => ({ "Player": p.name, "Tier": p.tier.name, "Least Util/Match": p.stats.util })).splice(0,5);
    const headshotPercentage = _sort(playerData, "stats.hs", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "HeadShot %": p.stats.hs}));
    const clutchAbility = _sort(playerData, "stats.clutchR", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Clutch Points per Match": p.stats['clutchR']}));
    // const grenadeDamagePerRound = _sort(playerData, "X/nade", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Grenade Damage Per Round": p["Xnade"]}));
    // const flashesPerFlash = _sort(playerData, "EF/F", 5).map( p => ({ "Player": p.name, "Tier": p.tier.name, "Flashes per Flash Thrown": p["EF/F"]}));
    const openDuels = _sort(playerData, "stats.odr", 5).map( p => ({ "Player": p.stats.name, "Tier": p.tier.name, "Open Duels": p.stats.odr}));


    const selectClassNames = {
        placeholder: () => "text-gray-400 bg-inherit",
        container: () => "m-1 rounded bg-inherit",
        control: () => "p-2 rounded-l bg-slate-700",
        option: (state : { isDisabled: boolean }) => `${state.isDisabled ? 'text-gray-500' : ''} p-2 hover:bg-slate-900`,
        input: () => "text-slate-200",
        menu: () => "bg-slate-900",
        menuList: () => "bg-slate-700",
        multiValue: () => "bg-sky-700 p-1 mr-1 rounded",
        multiValueLabel: () => "text-slate-200",
        multiValueRemove: () => "text-slate-800 pl-1",
        singleValue: () => "text-slate-200",
        //valueContainer: () => "bg-slate-700",
    };

    const tierCounts = {
        premier: player.filter(f => f.tier.name.toLowerCase() === "premier").length,
        elite: player.filter(f => f.tier.name.toLowerCase() === "elite").length,
        challenger: player.filter(f => f.tier.name.toLowerCase() === "challenger").length,
        contender: player.filter(f => f.tier.name.toLowerCase() === "contender").length,
        prospect: player.filter(f => f.tier.name.toLowerCase() === "prospect").length,
        recruit: player.filter(f => f.tier.name.toLowerCase() === "recruit").length
    };
    const sumTierCount = Object.values(tierCounts).reduce( (sum, num) => sum + num, 0);
    const tierOptionsList = [
        { label: `All (${sumTierCount})`, value: "All"}, 
        { label: `Premier (${tierCounts.premier})`, value: "Premier", isDisabled: !tierCounts.premier },
        { label: `Elite (${tierCounts.elite})`, value: "Elite", isDisabled: !tierCounts.elite },
        { label: `Challenger (${tierCounts.challenger})`, value: "Challenger", isDisabled: !tierCounts.challenger },
        { label: `Contender (${tierCounts.contender})`, value: "Contender", isDisabled: !tierCounts.contender },
        { label: `Prospect (${tierCounts.prospect})`, value: "Prospect", isDisabled: !tierCounts.prospect },
        { label: `Recruit (${tierCounts.recruit})`, value: "Recruit", isDisabled: !tierCounts.recruit },
    ];


    if( loading.isLoadingCscPlayers ) {
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
                <div className="basis-1/4">
                        <div className="flex flex-row text-sm m-2">
                            <label title="Order By" className="p-1 leading-9">
                                Tier
                            </label>
                            <Select
                                className="grow"
                                unstyled              
                                defaultValue={tierOptionsList[0]}
                                isSearchable={false}
                                classNames={selectClassNames}
                                options={tierOptionsList}
                                onChange={setFilterBy}
                            />
                    </div>
                </div>
            </div>
            { playerData.length > 0 && 
            <div>
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
                    {/* <div className="m-4">
                        Survival Time (Seconds)
                        <Table rows={timeToDeath}/>
                    </div> */}
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
                {/* <div className="grid md:grid-cols-2 sm:grid-cols-1">
                    <div className="m-4">
                        CT-Side Rating
                        <Table rows={ctRating}/>
                    </div>
                    <div className="m-4">
                        T-Side Rating
                        <Table rows={tRating}/>
                    </div>
                </div> */}

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
                    {/* <div className="m-4">
                        Grenade Damage per Round
                        <Table rows={grenadeDamagePerRound}/>
                    </div> */}
                </div>   
                <div className="grid md:grid-cols-2 sm:grid-cols-1">
                    {/* <div className="m-4">
                        Enemies Flashed per Flash
                        <Table rows={flashesPerFlash}/>
                    </div> */}
                    <div className="m-4">
                        Grenade Damage per Round
                        <Table rows={openDuels}/>
                    </div>
                </div>   
            </div> }
            { !playerData.length && 
                <div>
                    No Players in this Tier for this stats sheet.
                </div>
            }
        </Container>
    );
}