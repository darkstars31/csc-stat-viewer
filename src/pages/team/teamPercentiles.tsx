import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Player } from "../../models/player";
import { CscStats } from "../../models";
import {PercentileBar} from "../player/percentile-bar";
import {
    calculateClutchPercentile,
    calculateEntryingPercentile,
    calculateFirepowerPercentile,
    calculateOpeningPercentile,
    calculateSnipingPercentile, calculateTradePercentile, calculateUtilityPercentile
} from "../player/percentiles";

type Props = {
    selectedPlayers: Player[];
};
export function TeamPercentiles({ selectedPlayers }: Props) {
    const { players = [] } = useDataContext();

    // const stats = viewStatSelection === currentPlayer?.tier.name ? currentPlayer?.stats : currentPlayer?.statsOutOfTier?.find(s => s.tier === viewStatSelection)?.stats;

    let averageFirepowerPercentile = 0;
    let averageEntryingPercentile = 0;
    let averageOpeningPercentile = 0;
    let averageSnipingPercentile = 0;
    let averageTradePercentile = 0;
    let averageClutchPercentile = 0;
    let averageUtilityPercentile = 0;

    let awpers = 0;
    selectedPlayers.forEach(player => {
        let playerFirepowerPercentile = calculateFirepowerPercentile(player, player.stats, players);
        let playerEntryingPercentile = calculateEntryingPercentile(player, player.stats, players);
        let playerOpeningPercentile = calculateOpeningPercentile(player, player.stats, players);
        let playerSnipingPercentile = calculateSnipingPercentile(player, player.stats, players);
        let playerTradePercentile = calculateTradePercentile(player, player.stats, players);
        let playerClutchPercentile = calculateClutchPercentile(player, player.stats, players);
        let playerUtilityPercentile = calculateUtilityPercentile(player, player.stats, players);

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

        if (playerTradePercentile > 100) {
            playerTradePercentile = 100;
        }

        if (playerClutchPercentile > 100) {
            playerClutchPercentile= 100;
        }

        if (playerUtilityPercentile > 100) {
            playerUtilityPercentile = 100;
        }

        averageFirepowerPercentile += playerFirepowerPercentile;
        averageEntryingPercentile += playerEntryingPercentile;
        averageOpeningPercentile += playerOpeningPercentile;
        if (playerSnipingPercentile > 0) {
            averageSnipingPercentile += playerSnipingPercentile;
            awpers++;
        }
        averageTradePercentile += playerTradePercentile;
        averageClutchPercentile += playerClutchPercentile;
        averageUtilityPercentile += playerUtilityPercentile;
    });

    averageSnipingPercentile = averageSnipingPercentile / awpers;

    return (
        /* Games Played*/
        <>
            <div className="px-[5%] space-y-4 w-full">
                <PercentileBar
                    label="Firepower"
                    stat1={averageFirepowerPercentile == 0 ? 0 : averageFirepowerPercentile / selectedPlayers.length}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Entrying"
                    stat1={averageEntryingPercentile  == 0 ? 0 : averageEntryingPercentile / selectedPlayers.length}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Opening"
                    stat1={averageOpeningPercentile  == 0 ? 0 : averageOpeningPercentile / selectedPlayers.length}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Sniping"
                    stat1={averageSnipingPercentile}
                    stat2={100}
                    color="default"
                    type="default"
                />

                <PercentileBar
                    label="Trading"
                    stat1={averageTradePercentile  == 0 ? 0 : averageTradePercentile / selectedPlayers.length}
                    stat2={100.0}
                    color={"default"}
                    type="default"
                />

                <PercentileBar
                    label="Clutching"
                    stat1={averageClutchPercentile  == 0 ? 0 : averageClutchPercentile / selectedPlayers.length}
                    stat2={100.0}
                    color={"default"}
                    type="default"
                />

                <PercentileBar
                    label="Utility"
                    stat1={averageUtilityPercentile  == 0 ? 0 : averageUtilityPercentile / selectedPlayers.length}
                    stat2={100}
                    color={"default"}
                    type="default"
                />
            </div>
        </>
    );
}
