import * as React from "react";
import { Container } from "../common/components/container";
import { Input } from "../common/components/input";
import { useDataContext } from "../DataContext";
import { PlayerMappings } from "./player-utils";
import { Player } from "../models";
import { Loading } from "../common/components/loading";

export function TeamBuilder() {
    const [ searchValue, setSearchValue ] = React.useState<string>("");
    const [ squad, setSquad ] = React.useState<Player[]>([]);
    const { season10CombinePlayers = [], isLoading } = useDataContext();
    const players = season10CombinePlayers;
    const searchParams = new URLSearchParams(window.location.search);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = searchParams.get("players");

    // for (const [key, value] of searchParams.entries()) {
    //     console.log(`${key}, ${value}`);
    //     //players.find( p => )
    //  }

    if( isLoading ){
        return <Container><Loading /></Container>
    }

    return (
        <Container>
            <h2 className="text-3xl font-bold sm:text-4xl">Team Builder</h2>
            <p className="mt-4 text-gray-300">
            Find players, view stats, see how you stack up against your peers.
            </p>
            <div>

            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <div>
                <form className="flex flex-box h-12 mx-auto" onSubmit={(e)=>{e.preventDefault()}}>
                    <Input
                        className="basis-1/2 grow"
                        label="Filter"
                        placeHolder="Player Name"
                        type="text"
                        onChange={ ( e ) => setSearchValue(e.currentTarget.value)}
                        value={searchValue}
                    />
                </form>
            </div>
            <div>
                {
                    players.filter( p => p.Name.toLowerCase().includes(searchValue.toLowerCase()) && searchValue !== "").slice(0,8).map( p =>
                        <button key={`player-${p.Name}`} className="m-1 p-2" onClick={() => setSquad( (prev: Player[]) => [...prev!, p])}>
                            {p.Name}
                        </button>
                        )
                }
            </div>
            <hr />
                <div>
                    Picked: 
                    {
                        squad?.map( p => 
                            <span> {p.Name} </span>
                            )
                    }
                </div>
                <div>
                   <div className={`grid grid-cols-${squad.length+1} gap-4`}>
                        <div>Stat</div>
                        { squad.map( (p, squadIndex) => 
                            <>
                                <div>{p.Name}</div>
                                {Object.keys(p).map( (key, playerIndex) => 
                                     <div>{PlayerMappings[key]}</div>               
                                )}

{/* { new Array<number>().fill(squad.length).map( index => 
                                        <div>{squad[index][key]}</div>} */}
                                        )  
                                
                                {/* {Object.keys(p).map( key => <div>{squad[squadIndex][key as keyof Player]}</div>)} */}
                            </>
                        )}
                    </div>
                </div>
        </Container>
    );
}