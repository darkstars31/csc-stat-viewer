import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Player } from "../../models/player";
import { CscStats } from "../../models";
import {PercentileBar} from "./percentile-bar";
import {calculateClutchPercentile, calculateTradePercentile, calculateUtilityPercentile} from "./percentiles";

type Props = {
    player: Player;
    stats: CscStats;
};
export function PlayerPercentilesTwo({ player, stats }: Props) {
    const { players = [] } = useDataContext();

    let { playerTradePercentile, averageTradePercentile } = calculateTradePercentile(player, stats, players);
    let { playerClutchPercentile, averageClutchPercentile } = calculateClutchPercentile(player, stats, players);
    let { playerUtilityPercentile, averageUtilityPercentile } = calculateUtilityPercentile(player, stats, players);

    if (playerTradePercentile > 100) {
        playerTradePercentile = 100;
    }

    if (playerClutchPercentile > 100) {
        playerClutchPercentile= 100;
    }

    if (playerUtilityPercentile > 100) {
        playerUtilityPercentile = 100;
    }

    return (
        /* Games Played*/
        <>
            <div className="px-[5%] space-y-4 w-full">
                <PercentileBar
                    label="Trading"
                    stat1={playerTradePercentile}
                    stat2={100.0}
                    average={averageTradePercentile}
                    color={"default"}
                    type="default"
                />

                <PercentileBar
                    label="Clutching"
                    stat1={playerClutchPercentile}
                    stat2={100.0}
                    average={averageClutchPercentile}
                    color={"default"}
                    type="default"
                />

                <PercentileBar
                    label="Utility"
                    stat1={playerUtilityPercentile}
                    stat2={100}
                    average={averageUtilityPercentile}
                    color={"default"}
                    type="default"
                />
            </div>
        </>
    );
}
