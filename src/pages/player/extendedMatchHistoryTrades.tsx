import * as React from "react";
import { calculatePercentage } from "../../common/utils/string-utils";

export const ExtendedMatchHistoryTrades = ({ extendedMatchData } : { extendedMatchData: any }) => {

    const trades = Object.values(extendedMatchData?.data.players).reduce( (acc: any, player: any) => {

        if( !acc[player.name]) acc[player.name] = { tradeKill: 0, tradeDeath: 0, totalKills: 0, totalDeaths: 0 }

        extendedMatchData?.data.kills.forEach( (kill: any) => {
            if(kill.killerName === player.name) {
                acc[kill.killerName]["tradeKill"] += kill.isTradeKill ? 1 : 0;
                acc[kill.killerName]["totalKills"] += 1;
            }
            if(kill.victimName === player.name) {
                acc[kill.victimName]["tradeDeath"] += kill.isTradeDeath ? 1 : 0;
                acc[kill.victimName]["totalDeaths"] += 1;
            }
        })

        return acc
    }, {})

    console.info( trades );

    return (
        <>
            <div className="text-xs text-gray-500 text-center">*Trade Kills/Deaths over Total, does not currently account for opportunities.</div>
            <div className="flex flex-row flex-wrap gap-4 justify-center ">
                {
                    Object.entries(trades as any).map( ([key, value]: any) => (
                    <div className="basis-1/6">
                        <div className="font-bold text-center">{key}</div>
                        <div className="w-full bg-gray-200 rounded dark:bg-gray-700 m-1 h-6">
                            <div className="float-left w-full text-center text-xs pt-1">Kills {value.tradeKill} / {value.totalKills} ({calculatePercentage(value.tradeKill, value.totalKills,0)}%) </div>
                            <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none h-6 rounded" 
                            style={{width: `${calculatePercentage(value.tradeKill, value.totalKills)}%`}}>
                                </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded dark:bg-gray-700 m-1 h-6">
                            <div className="float-left w-full text-center text-xs pt-1">Deaths {value.tradeDeath} / {value.totalDeaths} ({calculatePercentage(value.tradeDeath, value.totalDeaths,0)}%) </div>
                            <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none h-6 rounded" 
                            style={{width: `${calculatePercentage(value.tradeDeath, value.totalDeaths)}%`}}>
                                </div>
                        </div>
                    </div>
                    ))
                }
            </div>
        </>
    )
}