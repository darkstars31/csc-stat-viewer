import * as React from "react";
import { cs2icons, cs2killfeedIcons } from "../../common/images/cs2icons";


export const ExtendedMatchHistoryKillFeed = ( { extendedMatchData }: { extendedMatchData: any } ) => {

    const killsByRound = extendedMatchData?.data.kills.reduce(( acc: any[], kill: Record<string,number>) => {
		if (!acc[kill.roundNumber]) acc[kill.roundNumber] = [];
		acc[kill.roundNumber].push(kill);
		return acc;
	}, []) ?? [];

    const rounds = extendedMatchData?.data.rounds

    return (
       <div className="flex flex-row pb-2 gap-6 overflow-x-scroll">
            { killsByRound.map((kills: any, index: number) => 
                <div>
                    <div className="border-b border-yellow-400 mb-2">
                        <div className="flex flex-row justify-between text-xs">
                            <div className="flex flex-col">
                                <div>Home</div>
                                <div>{rounds[index-1].teamAEconomyType}</div>
                            </div>
                            <div className="font-bold text-center text-lg">Round {index}</div>
                            <div className="flex flex-col">
                                <div>Away</div>
                                <div>{rounds[index-1].teamBEconomyType}</div>
                            </div>
                        </div>
                    </div>
                    { kills.map((kill: any) =>
                        <div className={`flex flex-row text-center border-1 rounded text-xs justify-around w-60`}>
                            <div className={`truncate max-w-[7em] ${kill.killerSide === 2 ? "text-red-400" : "text-blue-400"}`}>{kill.killerName}</div>
                            <div className="flex flex-row">
                                { kill.is_killer_blinded && <img className="ml-1 w-4 h-4" src={cs2killfeedIcons["blindKill"]} /> }
                                { kill.is_killer_airborne && <img className="ml-1 w-4 h-4" src={cs2killfeedIcons["airborne"]} /> }
                                <img className="ml-1 max-w-[5em] h-5" src={cs2icons[kill.weaponName]} alt={kill.weaponName} />
                                { kill.isNoScope && <img className="ml-1 w-5 h-5" src={cs2killfeedIcons["noScope"]} /> }
                                { kill.isThroughSmoke && <img className="ml-1 w-5 h-5" src={cs2killfeedIcons["smokeKill"]} /> }
                                { kill.penetradedObjects > 0 && <img className="ml-1 w-4 h-4" src={cs2killfeedIcons["wallBang"]} /> }
                                { kill.isHeadshot && <img className="ml-1 w-5 h-5" src={cs2killfeedIcons["headshot"]} /> }
                            </div>
                            <div className={`truncate max-w-[7em] ${kill.victimSide === 2 ? "text-red-400" : "text-blue-400"}`}>{kill.victimName}</div>
                        </div>
                        )
                    }
                </div>
            )}			
        </div>
    )
}