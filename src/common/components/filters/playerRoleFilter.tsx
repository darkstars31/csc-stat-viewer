import * as React from "react";
import Select, { MultiValue } from "react-select";

type Props = {
    onChange: typeof React.useState<MultiValue<{label: string;value: string;}>>;
}

export function PlayerRolesFilter( { onChange }: Props) {

    const viewRolesList = [
        { label: "Awper", value: "AWPER"},
        { label: "Fragger", value: "FRAGGER"},
        { label: "Rifler", value: "RIFLER"},
        { label: "Support", value: "SUPPORT"},
        { label: "Entry", value: "ENTRY"},
        //{ label: "Lurker", value: "LURKER"},
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
        <div className="flex flex-row text-xs my-2 mx-1">
            <label title="Tiers" className="p-1 leading-9">
                Roles
            </label>
                <Select
                    placeholder="All"
                    isClearable={false}
                    isMulti
                    className="grow"
                    unstyled
                    isSearchable={false}
                    classNames={selectClassNames}
                    options={viewRolesList}
                    onChange={onChange}
                />
        </div>
    );}