import * as React from "react";
import { IoSkull } from "react-icons/io5";

export const ExtendedMatchHistoryClutches = ({ extendedMatchData } : { extendedMatchData: any }) => {

	const clutches = extendedMatchData?.data.clutches.filter((clutch: any) => (clutch.opponentCount >= 1 && clutch.hasWon));

    return (
        <div className="flex flex-row flex-wrap gap-4 justify-center">
            { clutches.map((clutch: any) => 
                <div className={`flex flex-col text-center w-20 border-2 ${clutch.hasWon ? "border-green-500 bg-green-800" : "border-red-500 bg-red-800"} rounded`}>
                    <div>1v{clutch.opponentCount}</div>
                    <div className="text-xs">{clutch.clutcherName}</div>
                    <div className="flex flex-row gap-1 m-auto align-middle "><IoSkull size={"1.1em"} className="mt-1" /> {clutch.clutcherKillCount}</div>
                    <div className="text-xs font-bold">Round {clutch.roundNumber}</div>
                    <div className={`text-xs font-bold border-t-2 ${clutch.hasWon ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}`}>{clutch.hasWon ? "WON" : "LOST"} {clutch.opponentCount > clutch.clutcherKillCount && clutch.side === 3 ? "Ninja" : ""}</div>
                </div>)
            }
        </div>
    )
}