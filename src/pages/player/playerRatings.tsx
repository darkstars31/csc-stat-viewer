import * as React from "react";
import { PlayerStats } from "../../models";
import { useDataContext } from "../../DataContext";
import { TotalPlayerAverages } from "../../common/utils/player-utils";
import {
    Ripple,
    initTE,
    Tooltip,
} from "tw-elements";

initTE({ Ripple });

type Props = {
    player: PlayerStats
}
function ToolTipStandard({message, pos}: {message: string, pos:string}): JSX.Element {
    return(
        <span tabIndex={0} data-te-toggle={"tooltip"} title={message} style={{left: pos, position: "absolute", top: "20px", bottom: "-4px", borderLeft: "2px solid #fff"}}>
            <button type={"button"} className={"bg-midnight1 pointer-events-none transition duration-150 ease-in-out inline-block"} disabled/>
        </span>
    )
}
export function PlayerRatings({ player }: Props) {
    const { players = [] } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const {Pit, Peak, Rating, Form, "CONCY": ratingConsistency } = player;
    const tierPlayerAverages = TotalPlayerAverages( playerStats, { tier: player?.Tier} );
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-te-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    player
    return (
        <div className="m-4 mb-6 flex flex-col bg-midnight1 rounded-lg " style={{width: "100%", margin: "auto", position: "relative"}}>
            <div className="h-5 mb-6 w-full rounded-lg  pb-4 pt-6">
                <div className="h1 bg-midnight1 rounded-lg text-neutral-600 text-sm text-left" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <i>
                        <b>
                            {String('Data from last ' + player.GP).concat((player.GP>1)?' matches':' match')}
                        </b>
                    </i>
                </div>
            </div>
            <div className="h-5 mb-6 w-full rounded-lg">
                <div className="h1 bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="text bg-midnight1"><div className="label">Peak</div></div>
                    <div className="h-1 bg-green-500 rounded-lg" style={{width: ((Peak/2)*100).toString().concat("%")}}/>
                    <ToolTipStandard message={"Tier Average: " + String(tierPlayerAverages.average.peak)} pos={((tierPlayerAverages.average.peak/2)*100).toString().concat("%")}/>
                </div>
            </div>
            <div className="h-5 mb-6 w-full rounded-lg">
                <div className="h1 bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="text bg-midnight1"><div className="label">Rating</div></div>
                    <div className="h-1 bg-yellow-500 rounded-lg" style={{width: ((Rating/2)*100).toString().concat("%"), top: "0", bottom: "0"}}/>
                    <ToolTipStandard message={"Tier Average: " + String(tierPlayerAverages.average.rating)} pos={((tierPlayerAverages.average.rating/2)*100).toString().concat("%")}/>
                </div>
            </div>
            <div className="h-5 mb-6 w-full rounded-lg pb-8">
                <div className="h1 bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="text bg-midnight1"><div className="label">Pit</div></div>
                    <div className="h-1 bg-blue-500 rounded-lg" style={{width: ((Pit/2)*100).toString().concat("%")}}/>
                    <ToolTipStandard message={"Tier Average: " + String(tierPlayerAverages.average.pit)} pos={((tierPlayerAverages.average.pit/2)*100).toString().concat("%")}/>
                </div>
            </div>
            {player.GP<3?
                    <div className="h-5 mb-6 w-full rounded-lg  pb-12 pt-2">
                        <div className="h1 bg-midnight1 rounded-lg text-yellow-500 text-[0.8rem] text-center" style={{width: "90%", margin: "auto", position: "relative"}}>
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