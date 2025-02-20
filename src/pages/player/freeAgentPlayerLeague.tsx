import React from "react";
import { Container } from "../../common/components/container";
import { useFetchFaceItHubStats } from "../../dao/faceitApiDao";



export const FreeAgentPlayerLeague = () => {
    const { data } = useFetchFaceItHubStats();

    return  (
        <Container>
            <div>FreeAgentPlayerLeague</div>
        </Container>
    )
}