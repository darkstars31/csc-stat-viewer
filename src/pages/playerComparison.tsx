import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { shortTeamNameTranslator } from "../common/utils/player-utils";
import { Loading } from "../common/components/loading";
import Select, { MultiValue } from "react-select";
import { selectClassNames } from "../common/utils/select-utils";
import { PlayerCompareRadar } from "./charts/playerCompareRadar";
import { Player } from "../models/player";
import { useEnableFeature } from "../common/hooks/enableFeature";
import { getCssColorGradientBasedOnPercentage } from "../common/utils/string-utils";
import { Card } from "../common/components/card";


export function PlayerComparison() {
    const qs = new URLSearchParams(window.location.search);
    const playersFromUrl = qs.get("players") ?? "";
    const [ selectedPlayers, setSelectedPlayers ] = React.useState<MultiValue<{label: string; value: Player;}>>([]);
    const { players = [], isLoading } = useDataContext();
    const enabled = useEnableFeature("canUsePlayerComparison");
    
    React.useEffect(() => {
        if( playersFromUrl ) {
            const playerNames = playersFromUrl.split(",");
            setSelectedPlayers(playerNames.map( name => {
                const player = players.find( p => p.name.toLowerCase() === name.toLowerCase());
                return player 
                ? { label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`, value: player, isDisabled: !player.stats }
                : false
            }).filter(Boolean) as MultiValue<{label: string; value: Player;}>)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if( selectedPlayers.length > 0) {
            const url = new URL(window.location.href);
            url.searchParams.set("players", decodeURIComponent(selectedPlayers.map( p => p.value.name ).join(",")));
            window.history.pushState(null, "", url);
        }
    }, [ selectedPlayers ]);


    if( isLoading ){
        return <Container><Loading /></Container>
    }

    const playerOptions = players.map( player => ({ label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`, value: player, isDisabled: !player.stats }))
    playerOptions.sort((a,_)=> a.isDisabled ? 1 : -1 );
    
    if( !enabled ){
        return (
            <Container>
                <h2 className="text-3xl font-bold sm:text-4xl">Player Comparison Tool</h2>
                <p>
                    This feature currently under development.
                </p>
            </Container>
        )
    }

    return (
        <Container>
            <h2 className="text-3xl font-bold sm:text-4xl">Player Comparison Tool</h2>
            <p>
                Values are percentile 0-100% when compared to all players within the same tier for a given stat property. (i.e. A value of 100 is top player) 
            </p>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <p>
                Search for players by name. Tier Average is based on first player selected.
            </p>
            <div>
                <div className="flex flex-row text-xs my-2 mx-1">
                    <label title="Player Type" className="p-1 leading-9">
                        Player(s)
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
                            options={playerOptions}
                            onChange={setSelectedPlayers as typeof React.useState<MultiValue<{label: string;value: string;}>>}
                        />
                    </div>
                </div>
            </div>
            <div className="flex">
                <PlayerCompareRadar 
                    selectedPlayers={Array.from(selectedPlayers.values()).map( p => p.value)} 
                    tier={Array.from(selectedPlayers.values()).map( p => p.value)[0]?.tier.name ?? "Contender"} 
                    statOptions={["rating","pit","kast","adr","kr","hs"]} 
                    startAngle={90}
                />
                <PlayerCompareRadar 
                    selectedPlayers={Array.from(selectedPlayers.values()).map( p => p.value)} 
                    tier={Array.from(selectedPlayers.values()).map( p => p.value)[0]?.tier.name ?? "Contender"} 
                    statOptions={["utilDmg","ef", "fAssists","suppXR","util"]}
                    startAngle={180}
                />
            </div>
            <Card>
            <div className="w-full flex flex-row">
                    <table className="table-auto w-full font-light">
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Games Played</td>
                                <td>Rating</td>
                                <td>Pit</td>
                                <td>KAST</td>
                                <td>ADR</td>
                                <td>K/R</td>
                                <td>HS%</td>
                                <td>UtilDmg</td>
                                <td>EF</td> 
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.from(selectedPlayers.values()).map( p => p.value).map( player => 
                                    <tr key={player.name}>
                                        <td>{player.name}</td>
                                        <td>{player.stats.gameCount}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.rating*51)}`}>{player.stats.rating.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.pit*70)}`}>{player.stats.pit.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.kast*100)}`}>{player.stats.kast.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.adr*.6)}`}>{player.stats.adr.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.kr*70)}`}>{player.stats.kr.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.hs)}`}>{player.stats.hs.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.utilDmg*.3)}`}>{player.stats.utilDmg.toFixed(2)}</td>
                                        <td className={`${getCssColorGradientBasedOnPercentage(player.stats.ef*3)}`}>{player.stats.ef.toFixed(2)}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </Card>
        </Container>
    );
}