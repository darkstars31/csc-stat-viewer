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
        <span tabIndex={0} data-te-toggle={"tooltip"} title={message} style={{left: pos, position: "absolute", top: "20px", bottom: "-4px", borderLeft: "2px solid #fff"}}>
            <button type={"button"} className={"bg-midnight1 text-sm pointer-events-none transition duration-150 ease-in-out inline-block"} disabled/>
        </span>
    )
}
function ToolTipIcons({message, stat1, stat2, range}: {message: string, stat1: number, stat2: number, range: number}): JSX.Element { //Tooltips for the svg icons
    return(
        <div className={"float-right text-sm"}>
            <img className="h-3 w-3 transition inline-block ease-in-out select-none" // shows an svg based on inRange()
                 src={
                     inRange(
                         stat1, stat2, range)?
                         `data:image/svg+xml;utf-8,${updownarrow}`:
                         (stat1>(stat2))?
                             `data:image/svg+xml;utf-8,${uparrow}`:
                             `data:image/svg+xml;utf-8,${downarrow}`
                 }
                 tabIndex={0} data-te-toggle={"tooltip"} title={message}
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
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    return (
        /* Games Played*/
        <div className="m-4 mb-6 flex flex-col bg-midnight1 rounded-lg shadow-md shadow-black/20 dark:shadow-black/40" style={{width: "100%", margin: "auto", position: "relative"}}>
            <div className="h-5 mb-6 w-full bg-midnight1 rounded-lg text-neutral-700 text-sm text-left pb-8 pt-6" style={{width: "90%", margin: "auto", position: "relative"}}>
                <i>
                    <b>
                        {String('Data from last ' + player.GP).concat((player.GP>1)?' matches':' match')}
                    </b>
                </i>
            </div>

            {/* Rating bar*/}
            <div className="h-5 mb-6 w-full rounded-lg">
                <div className="bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="bg-midnight1">
                        Rating
                        <ToolTipIcons message={"Recent Form: " + player.Form} stat1={player.Form} stat2={player.Rating} range={0.05}/>
                    </div>
                    <div className="h-1 bg-gradient-to-l from-violet-500 to-violet-900 via-violet-600 rounded-lg" style={{width: ((player.Rating/2)*100).toString().concat("%"), top: "0", bottom: "0"}}/>
                    <ToolTipRatings message={"Tier Average: " + String(tierPlayerAverages.average.rating)} pos={((tierPlayerAverages.average.rating/2)*100).toString().concat("%")}/>
                </div>
            </div>
            {/* Peak bar*/}
            <div className="h-5 mb-6 w-full rounded-lg">
                <div className="bg-midnight2 rounded-lg block" style={{width: "90%", margin: "auto", position: "relative", zIndex: "0"}}>
                    <div className="bg-midnight1">
                        Peak
                        <div className="float-right text-sm">
                            {player.Peak}
                        </div>
                    </div>
                    <div className="h-1 bg-gradient-to-l from-green-500 to-green-900 via-green-600 rounded-lg" style={{width: ((player.Peak/2)*100).toString().concat("%")}}/>
                    <ToolTipRatings message={"Tier Average: " + String(tierPlayerAverages.average.peak)} pos={((tierPlayerAverages.average.peak/2)*100).toString().concat("%")}/>
                </div>
            </div>
            {/* Pit Bar */}
            <div className="h-5 mb-6 w-full rounded-lg">
                <div className="bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="bg-midnight1">
                        Pit
                        <div className="float-right text-sm">
                            {player.Pit}
                        </div>
                    </div>
                    <div className="h-1 bg-gradient-to-l from-yellow-500 to-yellow-900 via-yellow-600 rounded-lg" style={{width: ((player.Pit/2)*100).toString().concat("%")}}/>
                    <ToolTipRatings message={"Tier Average: " + String(tierPlayerAverages.average.pit)} pos={((tierPlayerAverages.average.pit/2)*100).toString().concat("%")}/>
                </div>
            </div>
            {/* Consistency Bar */}
            <div className="h-5 mb-6 w-full rounded-lg pb-8">
                <div className="bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="bg-midnight1">
                        Consistency
                        <img className="h-3 w-3 transition inline-block ease-in-out select-none" // Displays the question mark icon for a help tooltip
                             src={`data:image/svg+xml;utf-8,${questionmark}`}
                             tabIndex={0} data-te-toggle={"tooltip"} title={"Are you consistent compared to your rating? This measures Standard Deviation by Percent of Rating Average as a scale from 0 - 100, the higher the better"}
                             alt={""} />
                        <div className="float-right text-sm">
                            {((1 - (player.CONCY/player.Rating))*100).toFixed(0)}
                        </div>
                    </div>
                    {/* This shows StdDev as a percentage of their rating, so a 1.16 average player with a StdDev of 0.15 looks better than a 0.8 average player with the same StdDev. It's inverted to show in a progress bar format */}
                    <div className="h-1 bg-gradient-to-l from-blue-500 to-blue-900 via-blue-600 rounded-lg" style={{width: String((1 - (player.CONCY/player.Rating))*100).concat("%"), top: "0", bottom: "0"}}/>
                    <ToolTipRatings message={"Tier Average: " + String(((1 - (tierPlayerAverages.average.ratingConsistency/tierPlayerAverages.average.rating))*100).toFixed(0))} pos={String((1 - (tierPlayerAverages.average.ratingConsistency/tierPlayerAverages.average.rating))*100).concat("%")}/>
                </div>
            </div>
            {/* Warning Not Enough Data */}
            {player.GP<3?
                    <div className="h-5 mb-6 w-full rounded-lg  pb-12 pt-2">
                        <div className="bg-midnight1 rounded-lg text-yellow-500 text-[0.8rem] text-center" style={{width: "90%", margin: "auto", position: "relative"}}>
                            <i>
                                Less than 3 matches played. Stats shown may not provide an accurate picture of player skill or consistency
                            </i>
                        </div>
                    </div>
                :''
            }
        </div>
    );
}