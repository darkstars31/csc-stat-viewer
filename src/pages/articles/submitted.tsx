import * as React from "react";
import { Container } from "../../common/components/container";
import { Card } from "../../common/components/card";



export function Submitted() {
    return (
        <Container>
            <Card className="m-4 p-4 text-center w-full">
                Your post was submitted.
            </Card>
        </Container>
    )
}