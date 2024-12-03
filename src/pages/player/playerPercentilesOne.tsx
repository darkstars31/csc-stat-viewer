import * as React from "react";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import { RatingBar } from "./rating-bar";
import { Player } from "../../models/player";
import { CscStats } from "../../models";
import {PercentileBar} from "./percentile-bar";

type Props = {
    player: Player;
    stats: CscStats;
};
export function PlayerPercentilesOne({ player, stats }: Props) {
    const { players = [] } = useDataContext();
    //const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    })
    const concyWidth = ((1 - stats.consistency / stats.rating) * 100).toFixed(0);
    const tierAvgConcy = String(
        ((1 - tierPlayerAverages.average["consistency"] / tierPlayerAverages.average["rating"]) * 100).toFixed(0),
    );

    const killsPerRound = stats.kr.toFixed(2);
    const adr = stats.adr.toFixed(2);
    const multiKillPerRound = stats.multiR.toFixed(2);

    // const gamesPlayedCaption = String("Data from last " + stats.gameCount).concat(
    //     stats.gameCount > 1 ? " matches" : " match",
    // );
    return (
        /* Games Played*/
        <>
            <div className="px-[5%] space-y-4 w-full">
                <PercentileBar
                    label="Firepower"
                    stat1={70}
                    stat2={100}
                    average={65}
                    color="yellow"
                    type="default"
                />

                <PercentileBar
                    label="Entrying"
                    stat1={48}
                    stat2={100}
                    average={55}
                    color="red"
                    type="default"
                />

                <PercentileBar
                    label="Opening"
                    stat1={37}
                    stat2={100}
                    average={30}
                    color="red"
                    type="default"
                />

                <PercentileBar
                    label="Sniping"
                    stat1={87}
                    stat2={100}
                    average={22}
                    color="green"
                    type="default"
                />
            </div>
        </>
    );
}
