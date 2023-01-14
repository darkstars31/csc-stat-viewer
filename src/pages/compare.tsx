import * as React from "react";
import { Container } from "../common/components/container";
//import { useDataContext } from "../DataContext";
//import { Player } from "../models";

export function PlayerCompare() {
    //const { season10CombinePlayers = [], isLoading } = useDataContext();
    //const players = season10CombinePlayers;
    const searchParams = new URLSearchParams(window.location.search);
    //const playersToCompare: Player[] = []
    const result = searchParams.get("players");
    console.info( result?.split(",") );

    // for (const [key, value] of searchParams.entries()) {
    //     console.log(`${key}, ${value}`);
    //     //players.find( p => )
    //  }

    return (
        <Container>
            This is where I would put my comparison tool if I had one!
        </Container>
    );
}