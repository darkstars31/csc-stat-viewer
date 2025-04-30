import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { useFetchMatchesGraph } from "../dao/cscMatchesGraphQLDao";
import { Field, Label, Radio, RadioGroup } from '@headlessui/react';

const radioOptions = () => {

}

export const Pickems = () => {

    const { seasonAndMatchType } = useDataContext();
    const { data: matches, isLoading } = useFetchMatchesGraph( 16 ); //seasonAndMatchType.season);
    console.info( matches );
    const teams = ['SAV', 'FRG']
    const [selected, setSelected] = React.useState(teams[0])

    return (
        <Container>
            <div>
                test
            </div>
            <div>
                <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
                    {teams.map((team) => (
                        <Field key={team} className="flex items-center gap-2">
                        <Radio
                            value={team}
                            className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-blue-400"
                        >
                            <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                        </Radio>
                        <Label>{team}</Label>
                        </Field>
                    ))}
                </RadioGroup>
            </div>
        </Container>
    )
}