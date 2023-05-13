import * as React from "react";
import { PlayerStats } from "../../models";
import { useDataContext } from "../../DataContext";
import { TotalPlayerAverages } from "../../common/utils/player-utils";
import {
    Ripple,
    initTE,
    Tooltip,
} from "tw-elements";
import {uparrow, updownarrow, downarrow, questionmark} from "../../svgs";

initTE({ Ripple });

type Props = {
    player: PlayerStats
}
function ToolTipRatings({message, pos}: {message: string, pos:string}): JSX.Element { //Tooltips for the player profile stat bars
    return(
        <span className="top-5 h-3 absolute border-l-2 border-neutral-300 rounded-lg" data-te-toggle="tooltip" title={message} style={{left: pos}}>
            <button type="button" className="bg-midnight1 text-sm pointer-events-none transition duration-150 ease-in-out inline-block" disabled/>
        </span>
    )
}
function ToolTipIcons({message, stat1, stat2, range}: {message: string, stat1: number, stat2: number, range: number}): JSX.Element { //Tooltips for the svg icons
    return(
        <div className="float-right text-sm">
            <img className="h-3 w-3 transition inline-block ease-in-out select-none" // shows an svg based on inRange()
                 src={
                     inRange(
                         stat1, stat2, range)?
                         `data:image/svg+xml;utf-8,${updownarrow}`:
                         (stat1>(stat2))?
                             `data:image/svg+xml;utf-8,${uparrow}`:
                             `data:image/svg+xml;utf-8,${downarrow}`
                 }
                 data-te-toggle="tooltip" title={message}
                 alt={""} />
            {stat2}
        </div>
    /* For troubleshooting set alt to: "stat1/stat2: " + stat1 + ' ' + stat2 + inRange(stat1, stat2, range) */
)
}
function inRange(base: number, compare: number, range: number){ //Checks if one number is with a certain range of another, returns bool
    return(((base - (compare * (1 - range))) * (base - (compare * (1 + range)))) <= 0)
}
export function PlayerRatings({ player }: Props) {
    const { players = [] } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const tierPlayerAverages = TotalPlayerAverages( playerStats, { tier: player?.Tier} );
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-te-toggle="tooltip"]'));
    const peakWidth = ((player.Peak/2)*100).toFixed(0).toString().concat("%");
    const pitWidth = ((player.Pit/2)*100).toFixed(0).toString().concat("%");
    const avgWidth = ((player.Rating/2)*100).toFixed(0).toString().concat("%");
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

                {/* Rating bar*/}
                <div className="relative">
                    Rating
                    <ToolTipIcons message={"Recent Form: " + player.Form} stat1={player.Form} stat2={player.Rating} range={0.05}/>
                    <div className="h-1 bg-midnight2 rounded-lg">
                        <div className="h-1 bg-gradient-to-l from-violet-500 to-violet-900 via-violet-600 rounded-lg" style={{width: avgWidth}}/>
                    </div>
                    <ToolTipRatings message={"Tier Average: " + String(tierPlayerAverages.average.rating)} pos={((tierPlayerAverages.average.rating/2)*100).toString().concat("%")}/>
                </div>
                {/* Peak bar*/}
                <div className="relative">
                    Peak
                    <div className="float-right text-sm">
                        {player.Peak}
                    </div>
                    <div className="h-1 bg-midnight2 rounded-lg">
                        <div className="h-1 bg-gradient-to-l from-green-500 to-green-900 via-green-600 rounded-lg" style={{width: peakWidth}} />
                    </div>
                    <ToolTipRatings message={"Tier Average: " + String(tierPlayerAverages.average.peak)} pos={((tierPlayerAverages.average.peak/2)*100).toString().concat("%")}/>
                </div>
                {/* Pit Bar */}
                <div className="relative">
                    Pit
                    <div className="float-right text-sm">
                        {player.Pit}
                    </div>
                    <div className="h-1 bg-midnight2 rounded-lg">
                        <div className="h-1 bg-gradient-to-l from-yellow-500 to-yellow-900 via-yellow-600 rounded-lg" style={{width: pitWidth}}/>
                    </div>
                    <ToolTipRatings message={"Tier Average: " + String(tierPlayerAverages.average.pit)} pos={((tierPlayerAverages.average.pit/2)*100).toString().concat("%")}/>
                </div>
                {/* Consistency Bar */}
                <div className="relative">
                    Consistency
                    <img className="h-3 w-3 transition inline-block ease-in-out select-none" // Displays the question mark icon for a help tooltip
                         src={`data:image/svg+xml;utf-8,${questionmark}`}
                         data-te-toggle={"tooltip"} title={"Are you consistent compared to your rating? This measures Standard Deviation by Percent of Rating Average as a scale from 0 - 100, the higher the better"}
                         alt={""} />
                    <div className="float-right text-sm">
                        {concyWidth}
                    </div>
                    {/* This shows StdDev as a percentage of their rating, so a 1.16 average player with a StdDev of 0.15 looks better than a 0.8 average player with the same StdDev. It's inverted to show in a progress bar format */}
                    <div className="h-1 bg-midnight2 rounded-lg">
                        <div className="h-1 bg-gradient-to-l from-blue-500 to-blue-900 via-blue-600 rounded-lg" style={{width: concyWidth.toString().concat("%")}}/>
                    </div>
                    <ToolTipRatings message={"Tier Average: " + tierAvgConcy} pos={String((1 - (tierPlayerAverages.average.ratingConsistency/tierPlayerAverages.average.rating))*100).concat("%")}/>
                </div>
                {/* Warning Not Enough Data */}
                {player.GP<3?
                        <div className="relative">
                            <div className="text-yellow-500 text-[0.8rem] text-center w-[90%] italic">
                                Less than 3 matches played. Stats shown may not provide an accurate picture of player skill or consistency
                            </div>
                        </div>
                    :''
                }
            </div>
        </div>
    );
}