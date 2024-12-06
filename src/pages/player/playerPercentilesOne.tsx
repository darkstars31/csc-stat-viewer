import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Player } from "../../models/player";
import { CscStats } from "../../models";
import {PercentileBar} from "./percentile-bar";
import {
    calculateEntryingPercentile,
    calculateFirepowerPercentile,
    calculateOpeningPercentile,
    calculateSnipingPercentile
} from "./percentiles";

type Props = {
    player: Player;
    stats: CscStats;
};
export function PlayerPercentilesOne({ player, stats }: Props) {
    const { players = [] } = useDataContext();

    let playerFirepowerPercentile = calculateFirepowerPercentile(player, stats, players);
    let playerEntryingPercentile = calculateEntryingPercentile(player, stats, players);
    let playerOpeningPercentile = calculateOpeningPercentile(player, stats, players);
    let playerSnipingPercentile = calculateSnipingPercentile(player, stats, players);

    if (playerFirepowerPercentile > 100.0) {
        playerFirepowerPercentile = 100.0;
    }

    if (playerEntryingPercentile > 100.0) {
        playerEntryingPercentile = 100.0;
    }

    if (playerOpeningPercentile > 100.0) {
        playerOpeningPercentile = 100.0;
    }

    if (playerSnipingPercentile > 100.0) {
        playerSnipingPercentile = 100.0;
    }

    return (
        /* Games Played*/
        <>
            <div className="px-[5%] space-y-4 w-full">
                <PercentileBar
                    label="Firepower"
                    stat1={playerFirepowerPercentile}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Entrying"
                    stat1={playerEntryingPercentile}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Opening"
                    stat1={playerOpeningPercentile}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Sniping"
                    stat1={playerSnipingPercentile}
                    stat2={100}
                    color="default"
                    type="default"
                />
            </div>
        </>
    );
}
