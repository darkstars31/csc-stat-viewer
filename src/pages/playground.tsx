import * as React from "react";
import { PieChart } from "../common/components/charts/pie";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { useDataContext } from "../DataContext";
import { PlayerStats } from "../models";

export function Playground() {
    const { players, isLoading } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];

    if( isLoading ){
        return <Container><Loading /></Container>
    }

    return (
        <Container>
            <RoleRadar player={playerStats.at(1)!} />
            <hr />
            <PieChart options={{}} />
        </Container>
    );
}