import * as React from "react";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { useDataContext } from "../DataContext";
import Select, { SingleValue } from "react-select";
import * as Containers from "../common/components/containers";
import * as aslb from "./charts/allStatsLeaderBoards";
//import _sort from "lodash/sortBy";

export function LeaderBoards() {
    const qs = new URLSearchParams(window.location.search);
    const q = qs.get("q");
    const [, setLocation ] = useLocation();
    const { players = [], loading } = useDataContext();
    const [ selectedPage, setSelectedPage ] = React.useState<string>(q ?? "general");
    const [ filterBy, setFilterBy ] = React.useState<SingleValue<{label: string;value: string;}>>({ label: `All`, value: "All"});
    const [ limit, setLimit ] = React.useState<number>(5);
    
    const player = players.filter( p => (p.stats?.gameCount ?? 0) >= 3);
    
    const playerData = filterBy?.value.includes("All") ? player : player.filter( f => f.tier.name.toLowerCase() === filterBy?.value.toLowerCase());


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
            <Containers.StandardBackgroundPage>
                <Containers.ChartButtonBoundingBox>
                    <div className="basis-1/2">
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
                </Containers.ChartButtonBoundingBox>
                { playerData.length !== 0 &&
                <>
                <aslb.AllStatsLeaderboards playerData={playerData}/>
                </>
                }
            </Containers.StandardBackgroundPage>
        </Container>
    );
}