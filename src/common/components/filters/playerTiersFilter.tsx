import * as React from "react";
import Select, { MultiValue } from "react-select";

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

    const selectClassNames = {
        placeholder: () => "text-gray-400 bg-inherit",
        container: () => "m-1 rounded bg-inherit",
        control: () => "p-2 rounded-l bg-slate-700",
        option: () => "p-2 hover:bg-slate-900",
        input: () => "text-slate-200",
        menu: () => "bg-slate-900",
        menuList: () => "bg-slate-700",
        multiValue: () => "bg-sky-700 p-1 mr-1 rounded",
        multiValueLabel: () => "text-slate-200",
        multiValueRemove: () => "text-slate-800 pl-1",
        singleValue: () => "text-slate-200",
    };

    return (
            <div className="flex flex-row text-xs m-2">
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