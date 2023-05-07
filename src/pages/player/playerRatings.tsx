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

export function PlayerRatings({ player }: Props) {
    const { players = [] } = useDataContext();
    const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
    const {Pit, Peak, Rating, Form, "CONCY": ratingConsistency } = player;
    const tierPlayerAverages = TotalPlayerAverages( playerStats, { tier: player?.Tier} );

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-te-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
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
                    <p>
                        <a className="bg-midnight1" data-te-toggle="tooltip" title={"Tier Average: " + String(tierPlayerAverages.average.peak)} href='#' style={{left: ((tierPlayerAverages.average.peak/2)*100).toString().concat("%"), position: "absolute", top: "20px", bottom: "-4px", borderLeft: "2px solid #fff"}}>
                        </a>
                    </p>
                    <div></div>
                </div>
            </div>
            <div className="h-5 mb-6 w-full rounded-lg">
                <div className="h1 bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="text bg-midnight1"><div className="label">Rating</div></div>
                    <div className="h-1 bg-yellow-500 rounded-lg" style={{width: ((Rating/2)*100).toString().concat("%"), top: "0", bottom: "0"}}/>
                    <div className="line bg-midnight1" style={{left: ((tierPlayerAverages.average.rating/2)*100).toString().concat("%"), position: "absolute", top: "20px", bottom: "-4px", borderLeft: "2px solid #fff"}}></div>
                </div>
            </div>
            <div className="h-5 mb-6 w-full rounded-lg pb-8">
                <div className="h1 bg-midnight2 rounded-lg" style={{width: "90%", margin: "auto", position: "relative"}}>
                    <div className="text bg-midnight1"><div className="label">Pit</div></div>
                    <div className="h-1 bg-blue-500 rounded-lg" style={{width: ((Pit/2)*100).toString().concat("%")}}/>
                    <div className="line bg-midnight1" style={{left: ((tierPlayerAverages.average.pit/2)*100).toString().concat("%"), position: "absolute", top: "20px", bottom: "-4px", borderLeft: "2px solid #fff"}}></div>
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