import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { LeaderBoard } from "../common/components/leaderboard";
import { useDataContext } from "../DataContext";
import { _sort } from "../common/utils/player-utils";
import Select, { SingleValue } from "react-select";
import { Player } from "../models/player";
import { CscStats } from "../models/csc-stats-types";
import { WeaponLeaderboards } from "./leaderboards/weapons";
import { useLocation } from "wouter";

function buildTableRow( player: Player, columnName: string, property: keyof CscStats ){
    return { player, value: player.stats[property]};
}

export function LeaderBoards() {
    const qs = new URLSearchParams(window.location.search);
    const q = qs.get("q");
    const [, setLocation ] = useLocation();
    const { players = [], loading } = useDataContext();
    const [ selectedPage, setSelectedPage ] = React.useState<string>(q ?? "stats");
    const [ filterBy, setFilterBy ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: `All`, value: "All"});
    const [ limit, setLimit ] = React.useState<number>(5);
    
    const player = players.filter( p => (p.stats?.gameCount ?? 0) >= 3);
    
    const playerData = filterBy?.value.includes("All") ? player : player.filter( f => f.tier.name.toLowerCase() === filterBy?.value.toLowerCase());
      
    const gamesPlayed = _sort(playerData, "stats.gameCount", limit, "desc").map( p => buildTableRow(p, "Games Played", "gameCount"));
    const kills = _sort(playerData, "stats.kills", limit, "desc").map( p => ({ player: p, value: p.stats.kills}));
    const killDeathRatio = playerData.sort( (a,b) => (a.stats.kills/a.stats.deaths) < (b.stats.kills/b.stats.deaths) ? 1 : -1).slice(0,limit).map( p => ({ player: p, value: (p.stats.kills/p.stats.deaths).toFixed(2)}));
    const aces = playerData.sort( (a,b) => (a.stats["fiveK"]) < (b.stats["fiveK"]) ? 1 : -1).slice(0,limit).map( p => ({ player: p, value: p.stats["fiveK"] }));
    const damagePerRound = _sort(playerData, "stats.adr", limit, "desc").map( p => ({ player: p, value: p.stats.adr.toFixed(2)}));
    const awpKillsPerRound = _sort(playerData, "stats.awpR", limit, "desc").map( p => ({ player: p, value: p.stats["awpR"].toFixed(2)}));
    const utilDamagePerMatch = _sort(playerData, "stats.utilDmg", limit, "desc").map( p => ({ player: p, value: p.stats.utilDmg.toFixed(2)}));
    // const timeToDeath = _sort(playerData, "stats.atd", 5).map( p => ({ "Player": p.name,   "Time til Death (seconds)": p.ATD}));
    const ctRating = _sort(playerData, "stats.ctRating", limit, "desc").map( p => ({ player: p, value: p.stats.ctRating.toFixed(2)}));
    const tRating = _sort(playerData, "stats.TRating", limit, "desc").map( p => ({ player: p, value: p.stats.TRating.toFixed(2)}));
    const kastPercentage = _sort(playerData, "stats.kast", limit, "desc").map( p => ({ player: p, value: p.stats.kast.toFixed(2)}));
    const utilThrownPerMatchX = _sort(playerData, "stats.util",);
    const utilThrownPerMatch = utilThrownPerMatchX.map( p => ({ player: p, value: p.stats.util})).reverse().splice(0,limit);
    const leastUtilThrownPerMatch = utilThrownPerMatchX.map( p => ({ player: p, value: p.stats.util })).splice(0,limit);
    const headshotPercentage = _sort(playerData, "stats.hs", limit, "desc").map( p => ({ player: p, value: p.stats.hs}));
    const clutchAbility = _sort(playerData, "stats.clutchR", limit, "desc").map( p => ({ player: p, value: p.stats['clutchR'].toFixed(2)}));
    // const grenadeDamagePerRound = _sort(playerData, "X/nade", 5).map( p => ({ "Player": p.name,   "Grenade Damage Per Round": p["Xnade"]}));
    // const flashesPerFlash = _sort(playerData, "EF/F", 5).map( p => ({ "Player": p.name,   "Flashes per Flash Thrown": p["EF/F"]}));
    const openDuels = _sort(playerData, "stats.odr", limit, "desc").map( p => ({ player: p, value: p.stats.odr.toFixed(2)}));
    const fAssists = _sort(playerData, "stats.fAssists", limit, "desc").map( p => ({ player: p, value: p.stats.fAssists.toFixed(2)}));
    const ef = _sort(playerData, "stats.ef", limit, "desc").map( p => ({ player: p, value: p.stats.ef.toFixed(2)}));

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

    const tierButtonClass = "px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring-0 active:bg-blue-300";

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

    const showLimitOptionsList = [
        { label: `5`, value: "5"},
        { label: `10`, value: "10"},
        { label: `20`, value: "20"},
    ];

    const pages = [
        { name: "Stats", color: 'yellow'},
        { name: "Weapons", color: 'green'},
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
            <div
                className="justify-center flex flex-wrap rounded-md"
                role="group">
                {
                    pages.map( page => 
                        <button key={page.name} 
                            type="button" 
                            onClick={() => { 
                                setLocation( window.location.pathname + '?q=' + page.name.toLowerCase()); 
                                setSelectedPage(page.name.toLowerCase())
                            }}
                            className={`rounded-md ${page.name.toLowerCase() === selectedPage.toLowerCase() ? 'bg-blue-500' : 'bg-slate-700'} text-${page.color}-400 ${tierButtonClass} shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
                        >
                            {page.name}
                        </button>                     
                    )
                }                    
            </div>
            <div className="flex flex-box h-12 mx-auto justify-end">
                <div className="basis-1/4">
                            <div className="flex flex-row text-sm m-2">
                                <label title="Order By" className="p-1 leading-9">
                                    Show
                                </label>
                                <Select
                                    className="grow"
                                    unstyled              
                                    defaultValue={showLimitOptionsList[0]}
                                    isSearchable={false}
                                    classNames={selectClassNames}
                                    options={showLimitOptionsList}
                                    onChange={( item ) => setLimit( parseInt(item!.value) )}
                                />
                        </div>
                    </div>
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
            <div className="pt-6">
                <div className="flex flex-row flex-wrap gap-6">
                    { selectedPage === "stats" &&
                    <>
                        <LeaderBoard title="Games Played" rows={gamesPlayed}/>
                        <LeaderBoard title="Most Kills" rows={kills}/>
                        <LeaderBoard title="Highest K/D Ratio" rows={killDeathRatio}/>
                        <LeaderBoard title="Most Aces" rows={aces}/>
                        <LeaderBoard title=" Damager Per Round" rows={damagePerRound}/>
                        <LeaderBoard title="Flash Assists per Match" rows={fAssists}/>
                        <LeaderBoard title="Awp Kills per Round" rows={awpKillsPerRound}/>
                        <LeaderBoard title="Utility Damage per Match" rows={utilDamagePerMatch}/>
                        <LeaderBoard title="CT-Side Rating" rows={ctRating}/>
                        <LeaderBoard title="T-Side Rating" rows={tRating}/>
                        <LeaderBoard title="Kill/Asset/Survived/Traded" rows={kastPercentage}/>
                        <LeaderBoard title="Utility Thrown Per Match" rows={utilThrownPerMatch}/>
                        <LeaderBoard title="Least Utility Thrown Per Match" rows={leastUtilThrownPerMatch}/>
                        <LeaderBoard title="Highest Headshot Percentage" rows={headshotPercentage}/>
                        <LeaderBoard title="Clutch Points Average per Match" rows={clutchAbility}/>                                     
                        <LeaderBoard title="Open Duels Per Round" rows={openDuels}/>                   
                        <LeaderBoard title="Enemies Flashed per Match" rows={ef}/>
                    </>
                    }
                    { selectedPage === "weapons" &&
                        <WeaponLeaderboards players={playerData} limit={limit} />
                    }
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