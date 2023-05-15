import * as React from "react";
import { PlayerStats } from "../../models";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import {
    Ripple,
    initTE,
    Tooltip,
} from "tw-elements";
import { ToolTip } from "../../common/utils/tooltip-utils";
import {RatingBar} from "./rating-bar";
initTE({ Ripple });

type Props = {
    player: PlayerStats
}
export function PlayerRatings({ player }: Props) {
    const { players = [] } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const tierPlayerAverages = getTotalPlayerAverages( playerStats, { tier: player?.Tier} );
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-te-toggle="tooltip"]'));
    const concyWidth = ((1 - (player.CONCY/player.Rating))*100).toFixed(0);
    const tierAvgConcy = String(((1 - (tierPlayerAverages.average.ratingConsistency/tierPlayerAverages.average.rating))*100).toFixed(0));
    const gamesPlayedCaption = String('Data from last ' + player.GP).concat((player.GP>1)?' matches':' match');
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    return (
        /* Games Played*/
        <div className="m-4 w-full m-auto relative flex flex-col bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
            <div className="p-[5%] space-y-4">
                <div className="relative text-neutral-700 text-sm text-left italic font-bold">
                    {gamesPlayedCaption}
                </div>
            <RatingBar
                label="Rating"
                message={`Recent Form: ${player.Form}`}
                stat1={player.Form}
                stat2={player.Rating}
                range={0.05}
                average={tierPlayerAverages.average.rating}
                color="violet"
            />

            <RatingBar
                label="Peak"
                stat1={player.Peak}
                stat2={player.Peak}
                average={tierPlayerAverages.average.peak}
                color="green"
            />

            <RatingBar
                label="Pit"
                stat1={player.Pit}
                stat2={player.Pit}
                average={tierPlayerAverages.average.pit}
                color="yellow"
            />

            <div className="relative">
                Consistency
                <ToolTip
                    message="Are you consistent compared to your rating? This measures Standard Deviation by Percent of Rating Average as a scale from 0 - 100, the higher the better"
                    type="explain"
                />
                <div className="float-right text-sm">{concyWidth}</div>
                <div className="h-1 bg-midnight2 rounded-lg">
                    <div
                        className="h-1 bg-gradient-to-l from-blue-500 to-blue-900 via-blue-600 rounded-lg"
                        style={{ width: concyWidth.toString().concat("%") }}
                    />
                </div>
                <ToolTip
                    message={`Tier Average: ${tierAvgConcy}`}
                    pos={String(
                        (1 - tierPlayerAverages.average.ratingConsistency / tierPlayerAverages.average.rating) * 100
                    ).concat("%")}
                    type="rating"
                />
                {/* Warning Not Enough Data */}
                {player.GP<3 &&
                    <div className="relative pt-[5%] text-center">
                        <div className="text-yellow-500 inline-block text-[0.8rem] w-[90%] italic">
                            Less than 3 matches played. Stats shown may not provide an accurate picture of player skill or consistency
                        </div>
                    </div>
                }
            </div>
            </div>
        </div>
    );
}