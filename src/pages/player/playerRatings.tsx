import * as React from "react";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import {RatingBar} from "./rating-bar";
import { Player } from "../../models/player";
import { CscStats } from "../../models";

type Props = {
    player: Player,
    stats: CscStats
}
export function PlayerRatings({ player, stats }: Props) {
    const { players = [] } = useDataContext();
    //const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const tierPlayerAverages = getTotalPlayerAverages( players, { tier: player?.tier.name} );
    const concyWidth = ((1 - (stats.consistency/stats.rating))*100).toFixed(0);
    const tierAvgConcy = String(((1 - (tierPlayerAverages.average["consistency"]/tierPlayerAverages.average["rating"]))*100).toFixed(0));
    const gamesPlayedCaption = String('Data from last ' + stats.gameCount).concat((stats.gameCount>1)?' matches':' match');
    return (
        /* Games Played*/
        <>
            <div className="px-[5%] space-y-4 w-full">
                <div className="relative text-neutral-700 text-sm text-left italic font-bold">
                    {gamesPlayedCaption}
                </div>

            <RatingBar
                label="Peak"
                stat1={stats.peak}
                stat2={stats.peak}
                average={tierPlayerAverages.average["peak"]}
                color="green"
                type="default"
            />

            <RatingBar
                label="Rating"
                message={`Recent Form: ${stats.form.toFixed(2)}`}
                stat1={Number(stats.rating.toFixed(2))}
                stat2={Number(stats.form.toFixed(2))}
                range={0.05}
                average={tierPlayerAverages.average["rating"]}
                color="violet"
                type="default"
            />

            <RatingBar
                label="Pit"
                stat1={stats.pit}
                stat2={stats.pit}
                average={tierPlayerAverages.average["pit"]}
                color="yellow"
                type="default"
            />
            <RatingBar
                label="Consistency"
                stat1={Number(concyWidth)}
                stat2={Number(concyWidth)}
                average={Number(tierAvgConcy)}
                color="blue"
                type="concy"
                tooltipMessage="Are you consistent compared to your rating? This measures Standard Deviation by Percent of Rating Average as a scale from 0 - 100, the higher the better."
            />

            {/* <RatingBar
                label="Impact on Rounds Won"
                stat1={Number((player.IWR*100).toFixed(0))}
                stat2={player.IWR*100}
                average={tierPlayerAverages.average["IWR"]*100}
                color="red"
                type="concy"
            /> */}
            {/* Warning Not Enough Data */}
            {stats.gameCount < 3 &&
                <div className="relative text-center">
                    <div className="text-yellow-500 inline-block text-[0.8rem] w-[90%] italic">
                        Less than 3 matches played. Stats shown may not provide an accurate picture of player skill or consistency
                    </div>
                </div>
            }
            </div>
        </>
    );
}