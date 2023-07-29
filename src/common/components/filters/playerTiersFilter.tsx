import * as React from "react";
import Select, { MultiValue } from "react-select";
import { selectClassNames } from "../../utils/select-utils";

type Props = {
    onChange: typeof React.useState<MultiValue<{label: string;value: string;}>>;
}

export function PlayerTiersFilter( { onChange }: Props) {

    const viewTiersList = [
        { label: "Premier", value: "Premier"},
        { label: "Elite", value: "Elite"},
        { label: "Challenger", value: "Challenger"},
        { label: "Contender", value: "Contender"},
        { label: "Prospect", value: "Prospect"},
        { label: "Recruit", value: "Recruit"},
    ];

    return (
            <div className="flex flex-row text-xs my-2 mx-1">
                <label title="Tiers" className="p-1 leading-9">
                    Tiers
                </label>
                    <Select
                        placeholder="All"
                        isClearable={false}
                        isMulti
                        className="grow"
                        unstyled
                        isSearchable={false}
                        classNames={selectClassNames}
                        options={viewTiersList}
                        onChange={onChange}
                    />
            </div>
    );
}