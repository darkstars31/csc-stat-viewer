import * as React from "react";
import { Container } from "../common/components/container";
import { Input } from "../common/components/input";
import { Pill } from "../common/components/pill";
import Select, { MultiValue, SingleValue } from "react-select";
import { useDataContext } from "../DataContext";
import { Player } from "../models/player";
import { PlayerCard } from "./players/player-cards";
import _get from "lodash/get";

const sortOptionsList = [
    { label: "Name", value: "stats.Name"}, 
    { label: "Rating", value: "stats.Rating"},
    { label: "MMR", value: "mmr"},
];

export function Players() {
    const { players } = useDataContext();
    const playersWithStats = players.filter( p => p.stats );
    const [ searchValue, setSearchValue ] = React.useState("");
    const [ filters, setFilters ] = React.useState<string[]>([]);
    const [ orderBy, setOrderBy ] = React.useState<SingleValue<{label: string;value: string;}>>(sortOptionsList[0]);
    const [ viewTierOptions, setViewTierOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();
    const [ viewPlayerTypeOptions, setViewPlayerTypeOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();
    const [ viewPlayerRoleOptions, setViewPlayerRoleOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();


    let sortedPlayerData = playersWithStats.sort( (a,b) => {
        const itemA = _get(a, orderBy!.value, 0); 
        const itemB = _get(b, orderBy!.value, 0);
        return itemA < itemB ? 1 : -1
    } );

    // eslint-disable-next-line
    sortedPlayerData = orderBy?.value.includes("Name") ? sortedPlayerData.reverse() : sortedPlayerData;

    const filteredByPlayerType = viewPlayerTypeOptions?.length ? sortedPlayerData.filter( player => viewPlayerTypeOptions?.some( type => type.value === player.type)) : playersWithStats;
    const filteredByTier = viewTierOptions?.length ? filteredByPlayerType.filter( player => viewTierOptions?.some( tier => tier.value === player.tier.name)) : filteredByPlayerType;
    const filteredByRole = viewPlayerRoleOptions?.length ? filteredByTier.filter( player => viewPlayerRoleOptions?.some( role => role.value === player.role)) : filteredByTier;

    const filteredPlayers = filters.length > 0 ? filteredByRole.filter( player => {
        return filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ) );
    } ) : filteredByRole;

    const playerCards = filteredPlayers?.map( (player: Player, index: number) => <PlayerCard key={`${player.tier.name}-${player.name}`} player={player} index={index} />);

    const addFilter = () => {
        setSearchValue(""); 
        const newFilters = [ ...filters, searchValue ].filter(Boolean);
        setFilters( newFilters );
    }

    const removeFilter = ( label: string ) => {
        const newFilters = filters;
        delete newFilters[filters.indexOf(label)];
        setFilters( newFilters.filter(Boolean) );
    }

    const viewTiersList = [
        { label: "Premier", value: "Premier"},
        { label: "Elite", value: "Elite"},
        { label: "Challenger", value: "Challenger"},
        { label: "Contender", value: "Contender"},
        { label: "Prospect", value: "Prospect"},
        { label: "Recruit", value: "Recruit"},
    ];

    const viewRolesList = [
        { label: "Awper", value: "AWPER"},
        { label: "Fragger", value: "FRAGGER"},
        { label: "Rifler", value: "RIFLER"},
        { label: "Support", value: "SUPPORT"},
        { label: "Entry", value: "ENTRY"},
        { label: "Lurker", value: "LURKER"},
    ];

    const viewPlayerTypeList = [
        { label: `Signed`, value: "SIGNED"},
        { label: `Free Agents`, value: "FREE_AGENT"},
        { label: `Draft Eligible`, value: "DRAFT_ELIGIBLE"},
        { label: `Perma FA`, value: "PERMANENT_FREE_AGENT"},
    ];

    const selectClassNames = {
        placeholder: () => "text-gray-400 bg-inherit",
        container: () => "m-1 rounded bg-inherit",
        control: () => "p-2 rounded-l bg-slate-700",
        option: () => "p-2 hover:bg-slate-900",
        input: () => "text-slate-200",
        menu: () => "bg-slate-900",
        menuList: () => "bg-slate-700",
        multiValue: () => "bg-sky-700 p-1 mr-1 rounded",
        multiValueLabel: () => "text-slate-200",
        multiValueRemove: () => "text-slate-800 pl-1",
        singleValue: () => "text-slate-200",
    };

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
                    onClick={addFilter}
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
        </div>
        <div className="flex flex-col mt-48 md:flex-row md:mt-0 h-12 justify-end">
            <div className="basis-1/3">
                    <div className="flex flex-row text-xs m-2">
                        <label title="Player Type" className="p-1 leading-9">
                            Player Type
                        </label>
                            <Select
                                isMulti
                                placeholder="All"
                                isClearable={false}
                                className="grow"
                                unstyled
                                isSearchable={false}
                                classNames={selectClassNames}
                                options={viewPlayerTypeList}
                                onChange={setViewPlayerTypeOptions}
                            />
                    </div>
                </div>
                <div className="basis-1/3">
                    <div className="flex flex-row text-xs m-2">
                        <label title="Tiers" className="p-1 leading-9">
                            Tiers
                        </label>
                            <Select
                                placeholder="All"
                                isClearable={false}
                                isMulti
                                className="grow"
                                unstyled
                                isSearchable={false}
                                classNames={selectClassNames}
                                options={viewTiersList}
                                onChange={setViewTierOptions}
                            />
                    </div>
                </div>
                <div className="basis-1/5">
                    <div className="flex flex-row text-xs m-2">
                        <label title="Tiers" className="p-1 leading-9">
                            Roles
                        </label>
                            <Select
                                placeholder="All"
                                isClearable={false}
                                isMulti
                                className="grow"
                                unstyled
                                isSearchable={false}
                                classNames={selectClassNames}
                                options={viewRolesList}
                                onChange={setViewPlayerRoleOptions}
                            />
                    </div>
                </div>
                <div className="basis-1/5">
                    <div className="flex flex-row text-xs m-2">
                        <label title="Sort" className="p-1 leading-9">
                            Sort
                        </label>
                            <Select
                                className="grow"
                                unstyled
                                defaultValue={sortOptionsList[0]}
                                isSearchable={false}
                                classNames={selectClassNames}
                                options={sortOptionsList}
                                onChange={setOrderBy}
                            />
                    </div>
                </div>
            </div>
        <div>
            <hr className="h-px my-4 border-0 bg-gray-800" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                { playerCards }
            </div>
        </div>
    </Container>
    );
}