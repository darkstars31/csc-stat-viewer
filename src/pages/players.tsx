import * as React from "react";
import { type Player } from "../models";
import { rifler, awper, lurker, support, entry, fragger } from "../svgs"
import { Container } from "../common/components/container";
import { Input } from "../common/components/input";
import { Pill } from "../common/components/pill";
import { Link } from "wouter";
import { PlayerMappings, teamNameTranslator, tierColorClassNames } from "./player-utils";
import { Select } from "../common/components/select";
import { Loading } from "../common/components/loading";
import { useDataContext } from "../DataContext";

// const playerRatingGradient = ( rating: number ) => {
//     const color = rating > 1 ? "green" : "red";
//     const intensity = ((rating * 100) - 100)
// }

export function Players() {
    const { playerStats, isLoading } = useDataContext();

    const playerData = playerStats;
    const [ searchValue, setSearchValue ] = React.useState("");
    const [ filters, setFilters ] = React.useState<string[]>([]);
    const [ orderBy, setOrderBy ] = React.useState<string>("Name");

    React.useEffect(() => {
    }, [orderBy])

    let sortedPlayerData = playerData.sort( (a,b) => {
        return a[orderBy as keyof Player]! < b[orderBy as keyof Player]!? 1 : -1
    } );

    sortedPlayerData = orderBy.includes("Name") ? sortedPlayerData.reverse() : sortedPlayerData;

    const filteredPlayerData = filters.length > 0
        ? sortedPlayerData.filter( player => { 
            return filters.some( f => {
                return player.Name.toLowerCase().includes(f.toLowerCase());
            })
        }
    ) : playerData;

    filteredPlayerData.push(
        ...playerData.filter( player =>
            filters.some( f => {
                let metaFilter = Object.entries(player ?? []).map( ( [key,value] ) => `${key}:${value} ${PlayerMappings[key]}:${value}`).join(" ");
                metaFilter = metaFilter.concat(" "+teamNameTranslator(player.Team));
                return metaFilter.toLowerCase().includes(f.toLowerCase()) // Adds a Meta String Filter for advanced search
                    && filteredPlayerData.every( fp => fp.Name !== player.Name && fp.Tier !== player.Tier); // Removes items matching Name & Tier
            }
        ) 
        ),
    );

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
        Showing {filteredPlayerData.length} of {playerData.length} Players
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
    <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />

    { isLoading && <Loading /> }

    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    { filteredPlayerData?.map( (player: Player, index: number) => 
      <Link
        key={`player-${index}`}
        to={`/players/${player.Tier}/${encodeURIComponent(player.Name)}`}
        className="block rounded-xl border border-gray-800 p-6 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
      >
        <h2 className="mt-2 text-xl font-bold text-white text-center">{player.Name}</h2>
        <div className="mt-1 text-sm text-gray-300 grid grid-cols-2 gap-1">
            <div>
                {/* <div>SteamID: {player.Steam}</div> */}
                <div className={`text-${(tierColorClassNames as any)[player.Tier]}-400`}>{player.Tier}</div>
                <div>{teamNameTranslator(player.Team)}</div>
                {/* <div>Role: {player.ppR} <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${rifler}`} alt="rifler"/></div> */}
                <div className={`text-${ player.Rating > 1 ? "green" : "orange" }-400`}>Rating: {player.Rating}</div>
            </div>
            <div>
                <div className="text-center">{player.ppR}</div>
                <div className="flex justify-center">
                    {player.ppR.toLowerCase() === "rifler" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${rifler}`} alt="Rifler"/>}
                    {player.ppR.toLowerCase() === "awper" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${awper}`} alt="Awper"/>}
                    {player.ppR.toLowerCase() === "lurker" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${lurker}`} alt="Lurker"/>}
                    {player.ppR.toLowerCase() === "support" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${support}`} alt="Support"/>}
                    {player.ppR.toLowerCase() === "entry" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${entry}`} alt="Entry"/>}
                    {player.ppR.toLowerCase() === "fragger" && <img className="h-12 w-12" src={`data:image/svg+xml;utf-8,${fragger}`} alt="Fragger"/>}
                </div>
            </div>
        </div>
      </Link>
      )}
    </div>
</Container>

    );
}