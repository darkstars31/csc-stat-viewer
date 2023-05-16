import * as React from "react";
import { PlayerStats } from "../../models";
import { useDataContext } from "../../DataContext";
import { getTotalPlayerAverages } from "../../common/utils/player-utils";
import {
    Ripple,
    initTE,
    Tooltip,
} from "tw-elements";
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
    const tierAvgConcy = String(((1 - (tierPlayerAverages.average["CONCY"]/tierPlayerAverages.average["Rating"]))*100).toFixed(0));
    const gamesPlayedCaption = String('Data from last ' + player.GP).concat((player.GP>1)?' matches':' match');
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    return (
        /* Games Played*/
        <div className="w-full m-auto relative flex flex-col bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40">
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
                average={tierPlayerAverages.average["Rating"]}
                color="violet"
                type="default"
            />

            <RatingBar
                label="Peak"
                stat1={player.Peak}
                stat2={player.Peak}
                average={tierPlayerAverages.average["Peak"]}
                color="green"
                type="default"
            />

            <RatingBar
                label="Pit"
                stat1={player.Pit}
                stat2={player.Pit}
                average={tierPlayerAverages.average["Pit"]}
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
    );
}