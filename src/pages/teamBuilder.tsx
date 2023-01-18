import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { Player } from "../models";
import Select from "react-select";

export function TeamBuilder() {
    const { season10CombinePlayers = [], isLoading } = useDataContext();
    const players = season10CombinePlayers;
    const searchParams = new URLSearchParams(window.location.search);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const playersToCompare: Player[] = []
    const result = searchParams.get("players");
    console.info( result?.split(",") );

    // for (const [key, value] of searchParams.entries()) {
    //     console.log(`${key}, ${value}`);
    //     //players.find( p => )
    //  }

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
                <Select
                    isMulti
                    name="pick"
                    isLoading={isLoading}
                    isSearchable={true}
                    options={ players.map( p => ({ label: p.Name, value: p.Steam}) ) }
                    onChange={ () => {} }
                    value={{ label: "", value: ""}}
                />
            </div>
        </Container>
    );
}