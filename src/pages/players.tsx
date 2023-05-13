import * as React from "react";
import { type PlayerStats } from "../models";
import { Container } from "../common/components/container";
import { Input } from "../common/components/input";
import { Pill } from "../common/components/pill";
import Select, { MultiValue, SingleValue } from "react-select";
import { useDataContext } from "../DataContext";
import { Player } from "../models/player";
import { PlayerCard } from "./players/player-cards";

export function Players() {
    const { players } = useDataContext();
    const playersWithStats = players.filter( p => p.stats );
    const [ searchValue, setSearchValue ] = React.useState("");
    const [ filters, setFilters ] = React.useState<string[]>([]);
    const [ orderBy, setOrderBy ] = React.useState<SingleValue<{label: string;value: string;}>>();
    const [ viewTierOptions, setViewTierOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();
    const [ viewPlayerTypeOptions, setViewPlayerTypeOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();

    console.info("Re-rendered");

    let sortedPlayerData = playersWithStats.sort( (a,b) => {
        const itemA = a.stats![orderBy?.value as keyof PlayerStats];
        const itemB = b.stats![orderBy?.value as keyof PlayerStats];
        return itemA! < itemB! ? 1 : -1
    } );

    // eslint-disable-next-line
    sortedPlayerData = orderBy?.value.includes("Name") ? sortedPlayerData.reverse() : sortedPlayerData;

    const filteredByPlayerType = viewPlayerTypeOptions?.length ? sortedPlayerData.filter( player => viewPlayerTypeOptions?.some( type => type.value === player.type)) : playersWithStats;
    console.info( 'type', filteredByPlayerType.length );

    const filteredByTier = viewTierOptions?.length ? filteredByPlayerType.filter( player => viewTierOptions?.some( tier => tier.value === player.stats?.Tier)) : filteredByPlayerType;
    console.info( 'tier', filteredByTier.length );

    const filteredPlayers = filters.length > 0 ? filteredByTier.filter( player => {
        return filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ) );
    } ) : filteredByTier;

    const playerCards = filteredPlayers?.map( (player: Player, index: number) => <PlayerCard key={`${player.stats?.Tier}-${player.name}`} player={player} index={index} />);

    // TODO: Re-implement or Delete this
    // const filteredPlayers = playersWithStats.filter( player =>
    //     filters.every( f => {
    //         let metaFilter = Object.entries(player.stats ?? []).map( ( [key,value] ) => `${key}:${value} ${PlayerMappings[key]}:${value}`).join(" ");
    //             metaFilter = metaFilter.concat(" "+teamNameTranslator(player));
    //         return metaFilter.toLowerCase().includes(f.toLowerCase());
    //         }
    //     ) 
    // );

    const removeFilter = ( label: string ) => {
        const newFilters = filters;
        delete newFilters[filters.indexOf(label)];
        setFilters( newFilters.filter(Boolean) );
    }

    const sortOptionsList = [
        { label: "Name", value: "Name"}, 
        { label: "Rating", value: "Rating"},
    ];

    const viewTiersList = [
        { label: "Premier", value: "Premier"},
        { label: "Elite", value: "Elite"},
        { label: "Challenger", value: "Challenger"},
        { label: "Contender", value: "Contender"},
        { label: "Prospect", value: "Prospect"},
        { label: "New Tier", value: "New Tier"},
    ];

    const viewPlayerTypeList = [
        //{ label: `Signed`, value: "Signed"},
        { label: `Free Agents`, value: "FREE_AGENT"},
        { label: `Draft Eligible`, value: "DRAFT_ELIGIBLE"},
        { label: `Perma FA`, value: "PERMANENT_FREE_AGENT"},
    ];

    return (
    <Container>
        <div className="mx-auto max-w-lg text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Players</h2>

        <p className="mt-4 text-gray-300">
        Find players, view stats, see how you stack up against your peers.
        </p>
        <p className="mt-4 text-gray-300">
            Showing {filteredPlayers.length} of {playersWithStats.length} Players
        </p>
            <form className="flex flex-box h-12 mx-auto" onSubmit={(e)=>{e.preventDefault()}}>
                <Input
                    className="basis-1/2 grow"
                    label="Filter"
                    placeHolder="Player Name"
                    type="text"
                    onChange={ ( e ) => setSearchValue(e.currentTarget.value)}
                    value={searchValue}
                />
                <button
                    type="submit"
                    className="basis-1/6 ml-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                    onClick={() => { setSearchValue(""); setFilters( [ ...filters, searchValue ].filter(Boolean) ) } }
                    >
                    +Filter
                </button>
            </form>
            <div className="pt-4">
                {filters.map( filter => 
                    <Pill key={filter} label={filter} onClick={() => removeFilter(filter)}/>
                    )
                }
            </div>
            <div className="grid grid-cols-3 mid:grid-cols-5 text-sm">
            
            </div>
        </div>
        <div className="flex flex-box h-12 mx-auto justify-end">
        <div className="basis-1/3">
                <div className="flex flex-row text-xs m-2">
                    <label title="Order By" className="p-1 leading-9">
                        Player Type
                    </label>
                        <Select
                            isMulti
                            placeholder="All"
                            isClearable={false}
                            className="grow"
                            unstyled
                            isSearchable={false}
                            classNames={{
                                placeholder: () => "text-gray-400 bg-inherit",
                                container: (state) => "m-1 rounded bg-inherit",
                                control: () => "p-2 rounded-l bg-slate-700",
                                option: (state) => "p-2 hover:bg-slate-900",
                                input: () => "text-slate-200",
                                menu: () => "bg-slate-900",
                                menuList: () => "bg-slate-700",
                                singleValue: () => "text-slate-200",
                                //valueContainer: () => "bg-slate-700",
                            }}
                            options={viewPlayerTypeList}
                            onChange={setViewPlayerTypeOptions}
                        />
                </div>
            </div>
            <div className="basis-1/3">
                <div className="flex flex-row text-xs m-2">
                    <label title="Order By" className="p-1 leading-9">
                        Tiers
                    </label>
                        <Select
                            placeholder="All"
                            isClearable={false}
                            isMulti
                            className="grow"
                            unstyled
                            isSearchable={false}
                            classNames={{
                                placeholder: () => "text-gray-400 bg-inherit",
                                container: (state) => "m-1 rounded bg-inherit",
                                control: () => "p-2 rounded-l bg-slate-700",
                                option: (state) => "p-2 hover:bg-slate-900",
                                input: () => "text-slate-200",
                                menu: () => "bg-slate-900",
                                menuList: () => "bg-slate-700",
                                singleValue: () => "text-slate-200",
                                //valueContainer: () => "bg-slate-700",
                            }}
                            options={viewTiersList}
                            onChange={setViewTierOptions}
                        />
                </div>
            </div>
            <div className="basis-1/5">
                <div className="flex flex-row text-sm m-2">
                    <label title="Order By" className="p-1 leading-9">
                        Order By
                    </label>
                        <Select
                            className="grow"
                            unstyled
                            defaultValue={sortOptionsList[0]}
                            isSearchable={false}
                            classNames={{
                                //placeholder: () => "text-yellow-400 bg-inherit",
                                container: (state) => "m-1 rounded bg-inherit",
                                control: () => "p-2 rounded-l bg-slate-700",
                                option: (state) => "p-2 hover:bg-slate-900",
                                input: () => "text-slate-200",
                                menu: () => "bg-slate-900",
                                menuList: () => "bg-slate-700",
                                singleValue: () => "text-slate-200",
                                //valueContainer: () => "bg-slate-700",
                            }}
                            options={sortOptionsList}
                            onChange={setOrderBy}
                        />
                </div>
            </div>
        </div>
        <hr className="h-px my-4 border-0 bg-gray-800" />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            { playerCards }
        </div>
    </Container>
    );
}