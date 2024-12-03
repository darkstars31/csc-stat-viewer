import * as React from "react";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import { RatingBar } from "./rating-bar";
import { Player } from "../../models/player";
import { CscStats } from "../../models";

type Props = {
    player: Player;
    stats: CscStats;
};
export function PlayerPercentilesTwo({ player, stats }: Props) {
    const { players = [] } = useDataContext();
    //const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const tierPlayerAverages = getTotalPlayerAverages(players, {
        tier: player?.tier.name,
    });
    const concyWidth = ((1 - stats.consistency / stats.rating) * 100).toFixed(0);
    const tierAvgConcy = String(
        ((1 - tierPlayerAverages.average["consistency"] / tierPlayerAverages.average["rating"]) * 100).toFixed(0),
    );
    // const gamesPlayedCaption = String("Data from last " + stats.gameCount).concat(
    //     stats.gameCount > 1 ? " matches" : " match",
    // );
    return (
        /* Games Played*/
        <>
            <div className="px-[5%] space-y-4 w-full">
                <RatingBar
                    label="Trading"
                    stat1={stats.peak}
                    stat2={stats.peak}
                    average={tierPlayerAverages.average["peak"]}
                    color="green"
                    type="default"
                />

                <RatingBar
                    label="Clutching"
                    message={`Recent Form: ${stats.form.toFixed(2)}`}
                    stat1={Number(stats.rating.toFixed(2))}
                    stat2={Number(stats.form.toFixed(2))}
                    range={0.05}
                    average={tierPlayerAverages.average["rating"]}
                    color="violet"
                    type="default"
                />

                <RatingBar
                    label="Utility"
                    stat1={stats.pit}
                    stat2={stats.pit}
                    average={tierPlayerAverages.average["pit"]}
                    color="yellow"
                    type="default"
                />
                {/*<RatingBar*/}
                {/*    label="Consistency"*/}
                {/*    stat1={Number(concyWidth)}*/}
                {/*    stat2={Number(concyWidth)}*/}
                {/*    average={Number(tierAvgConcy)}*/}
                {/*    color="blue"*/}
                {/*    type="concy"*/}
                {/*    tooltipMessage="Are you consistent compared to your rating? This measures Standard Deviation by Percent of Rating Average as a scale from 0 - 100, the higher the better."*/}
                {/*/>*/}
            </div>
        </>
    );
}
