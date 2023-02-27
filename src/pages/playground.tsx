import * as React from "react";
import { PieChart } from "../common/components/charts/pie";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { useFetchContractGraph, useSchemaIntrospection } from "../dao/contracts";
import { useDataContext } from "../DataContext";

export function Playground() {
    const { data: contracts, isLoading: isLoadingContracts } = useFetchContractGraph();
    const { data: graphIntrospection, isLoading: isLoadingGraphIntrospec } = useSchemaIntrospection();
    const { playerStats, isLoading } = useDataContext();

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