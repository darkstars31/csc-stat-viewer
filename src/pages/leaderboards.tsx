import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Table } from "../common/components/table";
import { useDataContext } from "../DataContext";
import { _sort } from "../common/utils/player-utils";
import { PlayerStats } from "../models";
import Select, { SingleValue } from "react-select";

function buildTableRow( player: PlayerStats, columnName: string, property: keyof PlayerStats ){
    return { "Player": player.Name, "Tier": player.Tier, [columnName]: player[property]};
}

export function LeaderBoards() {
    const { players = [], loading } = useDataContext();
    const [ filterBy, setFilterBy ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: `All`, value: "All"});
    
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats ).filter( s => s!.GP >= 3) as PlayerStats[];
    
    const playerData = filterBy?.value.includes("All") ? playerStats : playerStats.filter( f => f.Tier.toLowerCase() === filterBy?.value.toLowerCase());
      
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
    const leastUtilThrownPerMatch = utilThrownPerMatchX.reverse().map( p => ({ "Player": p.Name, "Tier": p.Tier, "Least Util/Match": p.Util })).splice(0,5);
    const headshotPercentage = _sort(playerData, "HS", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "HeadShot %": p.HS}));
    const clutchAbility = _sort(playerData, "clutch/R", 5).map( p => ({ "Player": p.Name, "Tier": p.Tier, "Clutch Points per Match": p['clutch/R']}));
    const mostConsistent = _sort(playerData, "CONCY", 5).reverse().map( p => ({ "Player": p.Name, "Tier": p.Tier, "Most Consistent Rating": p['CONCY']}));

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
        premier: playerStats.filter(f => f.Tier.toLowerCase() === "premier").length,
        elite: playerStats.filter(f => f.Tier.toLowerCase() === "elite").length,
        challenger: playerStats.filter(f => f.Tier.toLowerCase() === "challenger").length,
        contender: playerStats.filter(f => f.Tier.toLowerCase() === "contender").length,
        prospect: playerStats.filter(f => f.Tier.toLowerCase() === "prospect").length,
        newTier: playerStats.filter(f => f.Tier.toLowerCase() === "newtier").length
    };
    const sumTierCount = Object.values(tierCounts).reduce( (sum, num) => sum + num, 0);
    const tierOptionsList = [
        { label: `All (${sumTierCount})`, value: "All"}, 
        { label: `Premier (${tierCounts.premier})`, value: "Premier", isDisabled: !tierCounts.premier },
        { label: `Elite (${tierCounts.elite})`, value: "Elite", isDisabled: !tierCounts.elite },
        { label: `Challenger (${tierCounts.challenger})`, value: "Challenger", isDisabled: !tierCounts.challenger },
        { label: `Contender (${tierCounts.contender})`, value: "Contender", isDisabled: !tierCounts.contender },
        { label: `Prospect (${tierCounts.prospect})`, value: "Prospect", isDisabled: !tierCounts.prospect },
        { label: `New Tier (${tierCounts.newTier})`, value: "NewTier", isDisabled: !tierCounts.newTier },
    ];


    if( loading.isLoadingCscPlayers && loading.isLoadingPlayerStats ) {
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
            </div> }
            { !playerData.length && 
                <div>
                    No Players in this Tier for this stats sheet.
                </div>
            }
        </Container>
    );
}