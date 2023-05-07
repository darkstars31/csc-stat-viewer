import * as React from "react";
import { type PlayerStats } from "../models";
import { rifler, awper, lurker, support, entry, fragger } from "../svgs"
import { Container } from "../common/components/container";
import { Input } from "../common/components/input";
import { Pill } from "../common/components/pill";
import { Link } from "wouter";
import { teamNameTranslator, tierColorClassNames } from "../common/utils/player-utils";
import { Select } from "../common/components/select";
import { useDataContext } from "../DataContext";
import { Player } from "../models/player";


export function Players() {
    const { players } = useDataContext();
    const playersWithStats = players.filter( p => p.stats );
    const [ searchValue, setSearchValue ] = React.useState("");
    const [ filters, setFilters ] = React.useState<string[]>([]);
    const [ orderBy, setOrderBy ] = React.useState<string>("Name");

    React.useEffect(() => {
    }, [orderBy])

    let sortedPlayerData = playersWithStats.sort( (a,b) => {
        const itemA = a.stats![orderBy as keyof PlayerStats];
        const itemB = b.stats![orderBy as keyof PlayerStats];
        return itemA! < itemB! ? 1 : -1
    } );

    // eslint-disable-next-line
    sortedPlayerData = orderBy.includes("Name") ? sortedPlayerData.reverse() : sortedPlayerData;

    const filteredPlayers = filters.length > 0 ? playersWithStats.filter( player => {
        return filters.some( f => player.name.toLowerCase().includes( f.toLowerCase() ) );
    } ) : playersWithStats;

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
        </div>
        <div className="flex flex-box h-12 mx-auto justify-end">
            <div className="basis-1/6">
                <Select
                    label="Order By"
                    options={[
                                { id: "Name", value: "Name"}, 
                                { id: "Rating", value: "Rating"}
                            ]}
                    onChange={ ( e ) => setOrderBy( e.currentTarget.value )}
                    value={orderBy}
                />
            </div>
        </div>
        <hr className="h-px my-4 border-0 bg-gray-800" />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        { filteredPlayers?.map( (player: Player, index: number) => 
        <Link
            key={`player-${index}`}
            to={`/players/${player.tier?.name ?? "loading..."}/${encodeURIComponent(player.name)}`}
            className="block rounded-xl border border-gray-800 p-6 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
        >
            <h2 className="mt-2 text-xl font-bold text-white text-center">{player.name}</h2>
            { player.stats && <div className="mt-1 text-sm text-gray-300 grid grid-cols-2 gap-1">
                <div>
                    {/* <div>SteamID: {player.Steam}</div> */}
                    <div className={`text-${(tierColorClassNames as any)[player.tier?.name ?? ""]}-400`}>{player.tier?.name ?? 'loading...'}</div>
                    <div>{teamNameTranslator(player)}</div>
                    {/* <div>Role: {player.ppR} <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${rifler}`} alt="rifler"/></div> */}
                    <div className={`text-${ player.stats.Rating > 1 ? "green" : "orange" }-400`}>Rating: {player.stats.Rating}</div>
                </div>
                <div>
                    <div className="text-center">{player.stats!.ppR}</div>
                    <div className="flex justify-center">
                        {player.stats.ppR === "RIFLER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${rifler}`} alt="Rifler"/>}
                        {player.stats.ppR === "AWPER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${awper}`} alt="Awper"/>}
                        {player.stats.ppR === "LURKER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${lurker}`} alt="Lurker"/>}
                        {player.stats.ppR === "SUPPORT" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${support}`} alt="Support"/>}
                        {player.stats.ppR === "ENTRY" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${entry}`} alt="Entry"/>}
                        {player.stats.ppR === "FRAGGER" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${fragger}`} alt="Fragger"/>}
                    </div>
                </div>
            </div> }
            { !player.stats &&
                <div>loading...</div>
            }
        </Link>
        )}
        </div>
    </Container>
    );
}