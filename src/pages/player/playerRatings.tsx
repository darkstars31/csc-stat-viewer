import * as React from "react";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import {
    Ripple,
    initTE,
    Tooltip,
} from "tw-elements";
import {RatingBar} from "./rating-bar";
import { Player } from "../../models/player";
initTE({ Ripple });

type Props = {
    player: Player
}
export function PlayerRatings({ player }: Props) {
    const { players = [] } = useDataContext();
    //const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const tierPlayerAverages = getTotalPlayerAverages( players, { tier: player?.tier.name} );
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-te-toggle="tooltip"]'));
    const concyWidth = ((1 - (player.stats.consistency/player.stats.Rating))*100).toFixed(0);
    const tierAvgConcy = String(((1 - (tierPlayerAverages.average["consistency"]/tierPlayerAverages.average["Rating"]))*100).toFixed(0));
    const gamesPlayedCaption = String('Data from last ' + player.stats.GP).concat((player.stats.GP>1)?' matches':' match');
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    return (
        /* Games Played*/
        <div className="w-full m-auto relative flex flex-col bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
            <div className="p-[5%] space-y-4">
                <div className="relative text-neutral-700 text-sm text-left italic font-bold">
                    {gamesPlayedCaption}
                </div>

            <RatingBar
                label="Peak"
                stat1={player.stats.peak}
                stat2={player.stats.peak}
                average={tierPlayerAverages.average["peak"]}
                color="green"
                type="default"
            />

            <RatingBar
                label="Rating"
                message={`Recent Form: ${player.stats.form.toFixed(2)}`}
                stat1={player.stats.form}
                stat2={Number(player.stats.Rating.toFixed(2))}
                range={0.05}
                average={tierPlayerAverages.average["Rating"]}
                color="violet"
                type="default"
            />

            <RatingBar
                label="Pit"
                stat1={player.stats.pit}
                stat2={player.stats.pit}
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
            {player.stats.GP<3 &&
                <div className="relative pt-[5%] text-center">
                    <div className="text-yellow-500 inline-block text-[0.8rem] w-[90%] italic">
                        Less than 3 matches played. Stats shown may not provide an accurate picture of player skill or consistency
                    </div>
                </div>
            }
            </div>
        </div>
    );
}