import * as React from "react";
import Select, { MultiValue } from "react-select";
import { selectClassNames } from "../../utils/select-utils";

type Props = {
    onChange: typeof React.useState<MultiValue<{label: string;value: string;}>>;
    hideLabel?: boolean;
    placeHolder?: string;
}

export const viewRolesList = [
    { label: "Awper", value: "AWPER"},
    { label: "Fragger", value: "FRAGGER"},
    { label: "Rifler", value: "RIFLER"},
    { label: "Support", value: "SUPPORT"},
    { label: "Entry", value: "ENTRY"},
    //{ label: "Lurker", value: "LURKER"},
];

export function PlayerRolesFilter( { onChange, hideLabel, placeHolder }: Props) {

    return (
        <div className="flex flex-row text-xs my-2 mx-1">
            <label title="Tiers" className={`p-1 leading-9 ${ hideLabel ? "hidden" : ""}`}>
                Roles
            </label>
                <Select
                    placeholder={ placeHolder ? placeHolder : "All" }
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