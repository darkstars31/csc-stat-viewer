import * as React from "react";
import Select, {MultiValue} from "react-select";
import {Player} from "../../models";
import {useDataContext} from "../../DataContext";
import {shortTeamNameTranslator} from "../../common/utils/player-utils";
import {Container} from "../../common/components/container";
import {Loading} from "../../common/components/loading";
import {selectClassNames} from "../../common/utils/select-utils";
import {TeamPercentiles} from "./teamPercentiles";

// const PlayerCompareRadar = React.lazy(() =>import('../charts/playerCompareRadar').then(module => ({default: module.PlayerCompareRadar})));
// const ComparisonTable = React.lazy(() =>import('../playerComparison/comparisonTable').then(module => ({default: module.ComparisonTable})));



export function TeamBuilder() {
    const qs = new URLSearchParams(window.location.search);
    const playersFromUrl = qs.get("players") ?? "";
    const [selectedPlayers, setSelectedPlayers] = React.useState<MultiValue<{ label: string; value: Player }>>([]);
    const { players = [], tiers, isLoading } = useDataContext();

    React.useEffect(() => {
        if (playersFromUrl) {
            const playerNames = playersFromUrl.split(",");
            setSelectedPlayers(
                playerNames
                    .flatMap(name => {
                        const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());

                        if ( player ) {
                            const playerOptions = [
                                {
                                    label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`,
                                    value: player,
                                    isDisabled: !player.stats,
                                }
                            ];
                            // Object.values(player?.statsOutOfTier ?? {}).forEach((item) => {
                            // 	console.info( 'statsOutOfTier', player.name, item.tier)
                            // 	playerOptions.push({
                            // 		label: `${player.name} (${item.tier}* ${shortTeamNameTranslator(player)})}`,
                            // 		value: { ...player, stats: player.statsOutOfTier!.find( s => s.tier === item.tier)!.stats! },
                            // 		isDisabled: false,
                            // 	})
                            // })

                            return playerOptions;
                        }
                    })
                    .filter(Boolean) as MultiValue<{ label: string; value: Player }>,

            );
        }
    }, []);

    React.useEffect(() => {
        if (selectedPlayers.length > 0) {
            const url = new URL(window.location.href);
            url.searchParams.set("players", decodeURIComponent(selectedPlayers.map(p => `${p.value.name}`).join(",")));
            window.history.pushState(null, "", url);
        }
    }, [selectedPlayers]);

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    const playerOptions = players.filter(player => !player.tier.name.includes("Unrated")).map(player => ({
        label: `${player.name} (${player.tier.name} ${shortTeamNameTranslator(player)}) ${player.stats ? "" : " - No stats"}`,
        value: player,
        isDisabled: !player.stats,
    }));
    players.filter(player => !player.tier.name.includes("Unrated")).forEach(player => {
        Object.values(player?.statsOutOfTier ?? {}).forEach((item) => {
            //if ( player.name.includes('XIE') ) console.info( 'statsOutOfTier', player.name, player.tier.name, item.tier, player.stats, player.statsOutOfTier)
            playerOptions.push({
                label: `${player.name} (${item.tier}* ${shortTeamNameTranslator(player)})`,
                value: { ...player, name: `${player.name}|${item.tier}`, tier: { name: item.tier}, stats: player.statsOutOfTier!.find( s => s.tier === item.tier)!.stats! },
                isDisabled: false,
            })
        })

    })
    playerOptions.sort((a, _) => (a.isDisabled ? 1 : -1));

    selectedPlayers.forEach(p => {
        console.info( p )
    })

    let filteredPlayerOptions = playerOptions;
    if (selectedPlayers.length != 0) {
        let tier = selectedPlayers[0].value.tier.name;
        // filter players by tier
        filteredPlayerOptions = playerOptions.filter(player => player.value.tier.name === tier);
    }

    const currentTierMMRCap = tiers.find(
        t => t.tier.name === Array.from(selectedPlayers.values()).map(p => p.value)[0]?.tier.name,
    );
    const totalMMR = Array.from(selectedPlayers.values()).map(p => p.value).reduce((accumulator, player) =>
        accumulator + (player?.mmr ?? 0), 0);
    const overCap = totalMMR > (currentTierMMRCap?.tier.mmrCap ?? 0);

    return (
        <Container>
            <h2 className="text-3xl font-bold sm:text-4xl">Team Builder</h2>
            <p>
                The goal of this team builder is to (ideally) try to have as many stat groups in the yellow (or green)
                as possible which in theory would guarantee you have a well rounded team if intangibles didn't exist.
            </p>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <p>Search for players by name. Players are filtered by the tier of the first person selected.</p>
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
                            options={filteredPlayerOptions}
                            onChange={
                                setSelectedPlayers as typeof React.useState<
                                    MultiValue<{ label: string; value: string }>
                                >
                            }
                        />
                    </div>
                </div>
            </div>
            <React.Suspense fallback={<Loading/>}>
                {/*<div className="grid grid-cols-1 sm:grid-cols-2">*/}
                {/*    <PlayerCompareRadar*/}
                {/*        selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}*/}
                {/*        tier={Array.from(selectedPlayers.values()).map(p => p.value)[0]?.tier.name ?? "Contender"}*/}
                {/*        statOptions={["rating", "pit", "kast", "adr", "kr", "hs"]}*/}
                {/*        startAngle={90}*/}
                {/*    />*/}
                {/*    <PlayerCompareRadar*/}
                {/*        selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}*/}
                {/*        tier={Array.from(selectedPlayers.values()).map(p => p.value)[0]?.tier.name ?? "Contender"}*/}
                {/*        statOptions={["utilDmg", "ef", "fAssists", "suppXR", "util"]}*/}
                {/*        startAngle={180}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<ComparisonTable selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)} />*/}
                <div className="flex flex-row m-1 mt-2 mb-2 text-sm">
                     <span className={`${overCap ? "text-red-500" : ""}`}>
                    ({((totalMMR / (currentTierMMRCap?.tier.mmrCap || 1)) * 100).toFixed(1)}% Cap)
                     </span>
                </div>

                <TeamPercentiles selectedPlayers={Array.from(selectedPlayers.values()).map(p => p.value)}/>
            </React.Suspense>
        </Container>
    );
}
