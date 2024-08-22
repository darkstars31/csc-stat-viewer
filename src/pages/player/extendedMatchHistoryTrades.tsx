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
        <div className="flex flex-row flex-wrap gap-4 justify-center ">
            {
                  Object.entries(trades as any).map( ([key, value]: any) => (
                    <div className="basis-1/6">
                        <div className="font-bold">{key}</div>
                        <div className="text-sm">K {value.tradeKill} / {value.totalKills} ({calculatePercentage(value.tradeKill, value.totalKills)}%)</div>
                        <div className="text-sm">D {value.tradeDeath} / {value.totalDeaths} ({calculatePercentage(value.tradeDeath, value.totalDeaths)}%)</div>
                    </div>
                   ))
            }
        </div>
    )
}