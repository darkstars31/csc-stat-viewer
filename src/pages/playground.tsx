import * as React from "react";
import { PieChart } from "../common/components/charts/pie";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { useDataContext } from "../DataContext";

export function Playground() {
    const { season10CombinePlayers, isLoading } = useDataContext();

    if( isLoading ){
        return <Container><Loading /></Container>
    }

    return (
        <Container>
            <RoleRadar player={season10CombinePlayers.at(1)!} />
            <hr />
            <PieChart options={{}} />
        </Container>
    );
}