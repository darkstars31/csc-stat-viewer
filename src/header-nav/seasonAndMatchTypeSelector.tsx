import * as React from "react";
import Select from "react-select";
import { useDataContext } from "../DataContext";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ToolTip } from "../common/utils/tooltip-utils";

export function SeasonAndMatchTypeSelector() {
    const { enableExperimentalHistorialFeature} = useDataContext();

    if (!enableExperimentalHistorialFeature) return null;

    const { currentSeason, hasSeasonStarted, seasonAndMatchType, setSeasonAndMatchType } = useDataContext();
	const seasonOptions = [ ...Array.from({ length: currentSeason - 10 }, (_, i) => ({ label: `Season ${ i + 11 }`, value: i + 11 })).reverse() ];
    const matchTypeOptions = [ { label: "Regulation", value: "Regulation" }, { label: "Combines", value: "Combine" } ];

	const handleSelectSeason = ( value: any ) => {
		setSeasonAndMatchType({ ...seasonAndMatchType, season: value });
	}

    const handleSelectMatchType = ( value: any ) => {
		setSeasonAndMatchType({ ...seasonAndMatchType, matchType: value });
	}

    return (
    <>
        <div className="float-right basis-80 px-2 -pb-4 bg-midnight2 rounded-bl-md flex flex-row text-xs">
            <div className="h-4 align-top text-xs font-semibold bg-teal-600 px-1 py-0.5 m-2 rounded-md">
                <ToolTip type="generic" message="Old data can be sparce or completely missing. You may encounter errors.">
                    <span className="uppercase">BETA</span><IoMdInformationCircleOutline className="inline h-4 w-4" />
                </ToolTip>
            </div>
            <span className="py-1">Viewing</span>
            <Select
                isClearable={false}
                className="w-24"
                unstyled
                isSearchable={false}
                classNames={{
                    placeholder: () => "text-gray-400 bg-inherit",
                    container: () => "mx-1 px-1 rounded bg-inherit",
                    control: () => "rounded-md pb-3 bg-transparent",
                    option: (state: { isDisabled: boolean }) => `${state.isDisabled ? "text-gray-500" : ""} p-2 hover:bg-slate-900`,
                    input: () => "text-slate-200",
                    menu: () => "bg-inherit rounded-b-md",
                    menuList: () => "bg-inherit p-2 rounded-b-md",
                    multiValue: () => "bg-sky-700 p-1 mr-1 rounded",
                    multiValueLabel: () => "text-slate-200",
                    multiValueRemove: () => "text-slate-800 pl-1",
                    singleValue: () => "text-center text-slate-200",
                    clearIndicator: () => "",
                    dropdownIndicator: () => "",
                    group: () => "",
                    groupHeading: () => "",
                    indicatorsContainer: () => "",
                    indicatorSeparator: () => "",
                    loadingIndicator: () => "",
                    loadingMessage: () => "",
                    menuPortal: () => "",
                    noOptionsMessage: () => "",
                    valueContainer: () => "",
                }}
                options={seasonOptions}
                value={seasonOptions.find( ( option ) => option.value === seasonAndMatchType.season )}
                onChange={ e => handleSelectSeason(e?.value) }
            />
            <Select
                isClearable={false}
                className="w-24"
                unstyled
                isSearchable={false}
                classNames={{
                    placeholder: () => "text-gray-400 bg-inherit",
                    container: () => "mx-1 px-1 rounded bg-inherit",
                    control: () => "rounded-md pb-3 bg-transparent",
                    option: (state: { isDisabled: boolean }) => `${state.isDisabled ? "text-gray-500" : ""} p-2 hover:bg-slate-900`,
                    input: () => "text-slate-200",
                    menu: () => "bg-inherit",
                    menuList: () => "bg-inherit p-2",
                    multiValue: () => "bg-sky-700 p-1 mr-1 rounded",
                    multiValueLabel: () => "text-slate-200",
                    multiValueRemove: () => "text-slate-800 pl-1",
                    singleValue: () => "text-slate-200",
                    clearIndicator: () => "",
                    dropdownIndicator: () => "",
                    group: () => "",
                    groupHeading: () => "",
                    indicatorsContainer: () => "",
                    indicatorSeparator: () => "",
                    loadingIndicator: () => "",
                    loadingMessage: () => "",
                    menuPortal: () => "",
                    noOptionsMessage: () => "",
                    valueContainer: () => "",
                }}
                options={matchTypeOptions}
                defaultValue={matchTypeOptions.find(( option ) => option.value === (hasSeasonStarted ? "Regulation" : "Combine") )}
                onChange={ e => handleSelectMatchType(e?.value) }
            />
        </div>
        <div className="clear-both" />
    </>
    );
}