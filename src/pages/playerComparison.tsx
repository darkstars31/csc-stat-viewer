import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { PlayerMappings } from "../common/utils/player-utils";
import { Loading } from "../common/components/loading";
import Select, { MultiValue, SingleValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { CscStats } from "../models/csc-stats-types";
import { PlayerCompareRadar } from "./charts/playerCompareRadar";
import { Player } from "../models/player";
//import { VscWarning } from "react-icons/vsc";

export function PlayerComparison() {
    const [ selectedPlayers, setSelectedPlayers ] = React.useState<MultiValue<{label: string; value: Player;}>>([]);
    const { players = [], isLoading } = useDataContext();
    

    // const gridData: { prop: string, data: (string | number | null)[]}[] = React.useMemo( () => {
    //     const gridData = [];
    //     const playerProps = Object.keys(PlayerMappings);
    //     for( let i = 0; i < Object.keys(PlayerMappings).length; i++){
    //         const prop = playerProps[i];
    //         const stat = playerStats.map( member => member[prop as keyof CscStats]);  
    //         gridData.push( {prop: prop, data: [...stat]})
    //     }
    //     return gridData;
    // }, [ playerStats ]);

    // const gridClassName = `grid grid-cols-${playerStats.length+1} gap-2`;
    // const statExclusionList = ["","Name","Steam","GP","ADP","ctADP","tADP","Xdiff","1v1","1v2","1v3","1v4","1v5","Rounds","Tier"];

    if( isLoading ){
        return <Container><Loading /></Container>
    }

    return (
        <Container>
            {/* <div className="mx-auto max-w-7xl px-2 sm:p-4 bg-orange-700 rounded">
                <VscWarning className="pr-4" /> This feature is in need of repair.
            </div> */}
            <h2 className="text-3xl font-bold sm:text-4xl">Player Comparison Tool</h2>
            <p>
                Search for players by name.
            </p>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <div>
                <div className="flex flex-row text-xs my-2 mx-1">
                    <label title="Player Type" className="p-1 leading-9">
                        Player
                    </label>
                    <div className="flex flex-row w-full">
                        <Select
                            placeholder="Search for player by name..."
                            isClearable={true}
                            className="grow"
                            unstyled
                            isMulti
                            value={selectedPlayers}
                            isSearchable={true}
                            classNames={selectClassNames}
                            options={players.map( player => ({ label: `${player.name} (${player.tier.name})`, value: player}))}
                            onChange={setSelectedPlayers as typeof React.useState<MultiValue<{label: string;value: string;}>>}
                        />
                    </div>
                </div>
            </div>
            <PlayerCompareRadar selectedPlayers={Array.from(selectedPlayers.values()).map( p => p.value)} tier={"Contender"} />
        </Container>
    );
}