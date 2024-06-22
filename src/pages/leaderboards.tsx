import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { useDataContext } from "../DataContext";
import Select, { MultiValue, SingleValue } from "react-select";
import { WeaponLeaderboards } from "./leaderboards/weapons";
import { useLocation } from "wouter";
import { Chickens } from "./leaderboards/chickens";
import { GeneralLeaderBoards } from "./leaderboards/general";
import { selectClassNames } from "../common/utils/select-utils";
import { Toggle } from "../common/components/toggle";


export function LeaderBoards() {
    const qs = new URLSearchParams(window.location.search);
    const q = qs.get("q");
    const [, setLocation ] = useLocation();
    const { players = [], loading } = useDataContext();
    const [ selectedPage, setSelectedPage ] = React.useState<string>(q ?? "general");
    const [ filterThreeGameMinumum, setFilterThreeGameMinumum ] = React.useState<boolean>(true);
    const [ filterByFranchise, setFilterByFranchise ] = React.useState<MultiValue<{label: string;value: string;}>>([]);
    const [ filterByTier, setFilterByTier ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: `All`, value: "All"});
    const [ limit, setLimit ] = React.useState<number>(5);
    
    const player = players.filter( p => (p.stats?.gameCount ?? 0) >= (filterThreeGameMinumum ? 3 : 1));
    
    const franchiseFilter = filterByFranchise.length === 0 ? player : player?.filter( p => filterByFranchise.some( f => f.value === p.team?.franchise?.name ?? ""));
    const playerData = filterByTier?.value.includes("All") ? franchiseFilter : franchiseFilter.filter( f => f.tier.name.toLowerCase() === filterByTier?.value.toLowerCase());

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

    const franchiseOptionList = [...new Set(player.map( p => p.team?.franchise))].map( t => ({ label: `${t?.prefix}`, value: t?.name }));

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
        { label: `50`, value: "50"},
    ];

    const pages = [
        { name: "General", color: 'yellow'},
        { name: "Extended", color: 'cyan'},
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
            <div className="flex flex-box  h-12 mx-auto justify-end text-xs">
                <div className="basis-1/3">
                    <div className="flex flex-row text-sm m-2">
                        <label title="Order By" className="p-1 leading-9">
                            Franchises
                        </label>
                        <Select
                            className="grow"
                            unstyled
                            isMulti                          
                            isSearchable={true}
                            classNames={selectClassNames}
                            options={franchiseOptionList}
                            onChange={setFilterByFranchise as typeof React.useState<MultiValue<{label: string;value: string;}>>}
                        />
                    </div>
                </div>
                <div className="basis-1/7">
                    <div className="flex flex-row text-sm m-2 items-center">
                        <label title="Order By" className="p-1 leading-9">
                            Min 3 Games
                        </label>
                       <div className=""><Toggle checked={filterThreeGameMinumum} onChange={setFilterThreeGameMinumum} /></div>
                    </div>
                </div>
                <div className="basis-1/5">
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
                                onChange={setFilterByTier}
                            />
                    </div>
                </div>
                <div className="basis-1/7">
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
            </div>
            { playerData.length > 0 && 
            <div className="pt-6">
                <div className="flex flex-row flex-wrap gap-6">
                    { selectedPage === "general" &&
                        <GeneralLeaderBoards players={playerData} limit={limit} />
                    }
                    { selectedPage === "extended" && 
                        <Chickens players={playerData} limit={limit} />
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