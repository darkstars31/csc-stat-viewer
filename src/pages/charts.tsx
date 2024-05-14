import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import { Pill } from '../common/components/pill';
import { CartesianCompare } from './charts/cartesianCompare';
import { CorrelationByTier } from './charts/correlationByTier';
import { StatBarByTiers } from './charts/statBarByTiers';
import { Loading } from '../common/components/loading';
import { RolePieChart } from './charts/rolePie';
import { RoleByTierBarChart } from './charts/rolesByTier';
import Select, { MultiValue, SingleValue } from "react-select";
import { PlayerTypes } from '../common/utils/player-utils';
import { PlayerTypeFilter } from '../common/components/filters/playerTypeFilter';
import { PlayerTiersFilter } from '../common/components/filters/playerTiersFilter';
import { PlayerRolesFilter } from '../common/components/filters/playerRoleFilter';
import * as Containers from "../common/components/containers";
import { DistributionCurves } from './charts/distributionCurve';
import { Overlay } from '../common/components/overlay';
import { selectClassNames } from '../common/utils/select-utils';
  

export function Charts() {

    const tabs = [
        { label: "MMR and Rating by Tier"},
        { label: "Distribution Curves"},
        { label: "Stat Bars by Tier"},
        { label: "Role Distribution"},
        { label: "Role Distribution By Tier"},
        { label: "Correlations by Tier"}
    ]

    const q = new URLSearchParams(window.location.search).get("q");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { players, seasonAndTierConfig, isLoading } = useDataContext();
    const playersWithStats = players.filter( p => p.stats );
    const [ currentTab, setCurrentTab ] = React.useState<number>( tabs.findIndex( t => t.label === q ) || 0 );

    const [ filters, setFilters ] = React.useState<string[]>([]);
    const [ viewTierOptions, setViewTierOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();
    const [ viewPlayerTypeOptions, setViewPlayerTypeOptions ] = React.useState<MultiValue<{label: string;value: PlayerTypes[];}>>();
    const [ viewPlayerRoleOptions, setViewPlayerRoleOptions ] = React.useState<MultiValue<{label: string;value: string;}>>();

    const viewPlayerTypeOptionsCumulative = viewPlayerTypeOptions?.flatMap( option => option.value);
    const filteredByPlayerType = viewPlayerTypeOptions?.length ? playersWithStats.filter( player => viewPlayerTypeOptionsCumulative?.some( type => type === player.type )) : playersWithStats;
    const filteredByTier = viewTierOptions?.length ? filteredByPlayerType.filter( player => viewTierOptions?.some( tier => tier.value === player.tier.name)) : filteredByPlayerType;
    const filteredByRole = viewPlayerRoleOptions?.length ? filteredByTier.filter( player => viewPlayerRoleOptions?.some( role => role.value === player.role)) : filteredByTier;
    const filteredBySearchPlayers = filters.length > 0 ? filteredByRole.filter( player => filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ))) : filteredByRole;

    const statPropertyOptions = [
        { label: "Rating", value: "rating"},
        { label: "Avg Damage/Round", value: "adr"},
        { label: "Kill Assists", value: "assists"},
        { label: "Kill/Assists/Surivived/Traded (KAST)", value: "kast"},
        { label: "Multi Kill Rounds", value: "multiR"},
        { label: "Headshot %", value: "hs"},
        { label: "Util Thrown per Match", value: "util"},
        { label: "Util Damage per Match", value: "utilDmg"},
        { label: "Average Damage per Round", value: "adr"},
        { label: "Flash Assists", value: "fAssists"},
        { label: "Trade Kill Ratio", value: "tRatio"},
    ];

    const [ statPropertySelected, setStatPropertySelected ] = React.useState<SingleValue<{ label: string; value: string;}>>(statPropertyOptions[0]);

    const addFilter = () => {
        const searchValue = inputRef.current!.value; 
        inputRef.current!.value = "";
        const newFilters = [ ...filters, searchValue ].filter(Boolean);
        setFilters( newFilters );
    }

    const removeFilter = ( label: string ) => {
        const newFilters = filters;
        delete newFilters[filters.indexOf(label)];
        setFilters( newFilters.filter(Boolean) );
    }

    // const filteredPlayers = filters.length > 0 ? playersWithStats.filter( player => {
    //     return filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ) );
    // } ) : playersWithStats;
    React.useEffect(() => {
        if (currentTab === 4) {
            setViewPlayerTypeOptions([{ label: "Signed", value: [PlayerTypes.SIGNED,PlayerTypes.INACTIVE_RESERVE,PlayerTypes.SIGNED_PROMOTED,PlayerTypes.SIGNED_SUBBED] }]);
        } else {
            setViewPlayerTypeOptions([]); 
        }
    }, [currentTab]);
      
    if( isLoading ) {
        return <Container><Loading /></Container>;
    }

    if( playersWithStats.length === 0) {
        return <Container><i>No Players with stats for season {seasonAndTierConfig?.number} yet.. Check back later</i></Container>;
    }

    return (
        <Container>
            <div>        
            <ul className="mb-5 flex justify-center list-none flex-row flex-wrap border-b-0 pl-0" role="tablist" data-te-nav-ref>
                { tabs.map( (tab, index) => (
                     <li role="presentation" key={index}>
                     <button
                     id={tab.label}
                     className={`my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight hover:isolate hover:border-transparent hover:bg-neutral-700 focus:isolate ${index === currentTab ? "border-primary text-primary dark:border-primary-400 dark:text-primary-400": "text-neutral-500"}`}
                     data-te-toggle="pill"
                     role="tab"
                     aria-selected={currentTab === index}
                     onClick={() => setCurrentTab(index)}
                     >{tab.label}</button
                     >
                 </li>
                ))}
            </ul>
                <div className='text-center mx-auto max-w-lg mt-4'>
                    <form className="flex flex-box h-12 mx-auto" onSubmit={(e)=>{e.preventDefault()}}>
                        <label
                            htmlFor="textInput"
                            className={"relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 "}
                            >
                            <input
                                id="textInput"
                                type="text"                                     
                                ref={inputRef}
                                placeholder='Filter players by Name'
                                className={"peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"}
                            />
                            <span className={"absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"}>
                                Filter players by Name
                            </span>
                        </label>
                        <button
                            type="submit"
                            className="basis-1/6 ml-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                            onClick={addFilter}
                            >
                            +Filter
                        </button>
                    </form>
                </div>
                <div className="pt-4 text-center">
                    { filters.map( filter => <Pill key={filter} label={filter} onClick={() => removeFilter(filter)}/>) }
                </div>
            </div>
            <Containers.StandardBackgroundPage>
                <Containers.StandardContentThinBox>
                    <div className="basis-1/3">
                        <PlayerTypeFilter 
                            onChange={setViewPlayerTypeOptions as typeof React.useState<MultiValue<{label: string;value: PlayerTypes[];}>>} 
                            selectedOptions={viewPlayerTypeOptions}
                        />
                    </div>
                    <div className="basis-1/3">
                        <PlayerTiersFilter onChange={setViewTierOptions as typeof React.useState<MultiValue<{label: string;value: string;}>>} />
                    </div>
                    <div className="basis-1/3">
                        <PlayerRolesFilter onChange={setViewPlayerRoleOptions as typeof React.useState<MultiValue<{label: string;value: string;}>>} />
                    </div>     
                </Containers.StandardContentThinBox>
            
                <div> 
                    { currentTab === 0 && 
                    <div
                        className="relative transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                        id="tabs-home"
                        role="tabpanel"
                        aria-labelledby="tabs-home-tab"
                        data-te-tab-active>
                        <Overlay condition={(filteredBySearchPlayers[0].mmr || 0) < 1} message={<><div>This chart is not very useful without MMR. </div><div>Please check back closer to the draft when MMR is released publicly.</div></>}/>
                        <CartesianCompare playerData={filteredBySearchPlayers} />
                    </div>
                    }
                     { currentTab === 1 && <div
                            className="relative transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-home"
                            role="tabpanel"
                            aria-labelledby="tabs-home-tab"
                            data-te-tab-active>
                            <Overlay condition={(filteredBySearchPlayers[0].mmr || 0) < 1} message={<><div>This chart is not very useful without MMR. </div><div>Please check back closer to the draft when MMR is released publicly.</div></>}/>
                            <DistributionCurves playerData={filteredBySearchPlayers} />
                        </div>
                    }
                    { currentTab === 2 && <div
                        className="transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                        id="tabs-profile"
                        role="tabpanel"
                        aria-labelledby="tabs-profile-tab">
                        <StatBarByTiers statProperty={statPropertySelected!.value} playerData={filteredBySearchPlayers} />
                        <Containers.ChartButtonBoundingBox>
                            <Select
                                className="flex-grow-0 w-1/2"
                                unstyled
                                defaultValue={statPropertyOptions[0]}
                                isSearchable={false}
                                classNames={selectClassNames}
                                options={statPropertyOptions}
                                onChange={setStatPropertySelected}
                            />  
                        </Containers.ChartButtonBoundingBox>
                    </div>
                    }
                    { currentTab === 3 && 
                        <div
                            className="transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-messages"
                            role="tabpanel"
                            aria-labelledby="tabs-profile-tab">
                            <RolePieChart playerData={filteredBySearchPlayers} />
                        </div>
                    }
                    { currentTab === 4 && 
                        <div
                            className="transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-contact"
                            role="tabpanel"
                            aria-labelledby="tabs-contact-tab">
                            <RoleByTierBarChart playerData={filteredBySearchPlayers} />
                        </div>
                    }
                    {currentTab === 5 && 
                        <div
                            className="transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                            id="tabs-correlation"
                            role="tabpanel"
                            aria-labelledby="tabs-correlation-tab">
                            <CorrelationByTier playerData={filteredBySearchPlayers} />
                        </div>
                    }
                </div>
            </Containers.StandardBackgroundPage>
        </Container>
    );
}