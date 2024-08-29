import * as React from "react";
import { calculatePercentage } from "../../common/utils/string-utils";

export type Metadata = {
    metadata: {
        "matchup": {
            "teamAFaceitElo": number[], // Home Team
            "teamBFaceitElo": number[], // Away Team
            "teamACSCRatingsAtMatch": number[],
            "teamBCSCRatingsAtMatch": number[]
        }
    }
}

export const ExtendedMatchHistoryMatchup = ({ extendedMatchData } : { extendedMatchData: Metadata }) => {

    const teamACSCAverage = Object.values(extendedMatchData?.metadata.matchup.teamACSCRatingsAtMatch)
        .reduce( (acc: number, value: number) => acc + value, 0)
    const teamBCSCAverage = Object.values(extendedMatchData?.metadata.matchup.teamBCSCRatingsAtMatch)
        .reduce( (acc: number, value: number) => acc + value, 0)
    const summedCSCRating = (teamACSCAverage + teamBCSCAverage);
    const teamAFaceitEloAverage = Object.values(extendedMatchData?.metadata.matchup?.teamAFaceitElo ?? {})
        .reduce( (acc: number, value: number) => acc + value, 0)
    const teamBFaceitEloAverage = Object.values(extendedMatchData?.metadata.matchup?.teamBFaceitElo ?? {})
        .reduce( (acc: number, value: number) => acc + value, 0)
    const summedFaceitElo = (teamAFaceitEloAverage + teamBFaceitEloAverage);

    return (
        <>
            <div className="text-xs text-gray-500 text-center">*CSC Rating and Faceit Elo collected at match end.</div>
            <div className="flex flex-row flex-wrap gap-4 justify-evenly">
                <div className="basis-1/6 text-center">
                    <div>Team Away</div>
                    <div>{(teamACSCAverage/extendedMatchData?.metadata.matchup.teamACSCRatingsAtMatch.length).toFixed(2)} Rating</div>
                    { teamAFaceitEloAverage > 0 && <div>{(teamAFaceitEloAverage/extendedMatchData?.metadata.matchup.teamAFaceitElo.length).toFixed()} ELO</div> }
                </div>
                <div className="basis-1/2">
                    <div className="w-full bg-gray-200 rounded dark:bg-gray-700 m-1 h-6">
                        <div className="float-left w-full text-xs pt-1 pl-4">
                            {calculatePercentage(teamACSCAverage, summedCSCRating,0)}% 
                            <span className="float-right pr-4">{calculatePercentage(teamBCSCAverage, summedCSCRating,0)}%</span>
                        </div>
                        <div className="bg-orange-600 text-xs font-medium text-center p-0.5 leading-none h-6 rounded" 
                            style={{width: `${calculatePercentage(teamACSCAverage, summedCSCRating)}%`}} />
                        <div className="-mt-6 float-right bg-blue-600 text-xs font-medium text-center p-0.5 leading-none h-6 rounded" 
                                style={{width: `${calculatePercentage(teamBCSCAverage, summedCSCRating)}%`}} />
                    </div>
                    { teamAFaceitEloAverage > 0 && 
                        <div className="w-full bg-gray-200 rounded dark:bg-gray-700 m-1 h-6">
                            <div className="float-left w-full text-xs pt-1 pl-4">
                                {calculatePercentage(teamAFaceitEloAverage, summedFaceitElo,0)}%
                                <div className="float-right pr-4">{calculatePercentage(teamBFaceitEloAverage, summedFaceitElo,0)}%</div>
                            </div>
                            <div className="bg-orange-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none h-6 rounded" 
                                style={{width: `${calculatePercentage(teamAFaceitEloAverage, summedFaceitElo)}%`}} />
                            <div className="-mt-6 float-right bg-blue-600 text-xs font-medium text-center p-0.5 leading-none h-6 rounded" 
                                style={{width: `${calculatePercentage(teamBFaceitEloAverage, summedFaceitElo)}%`}} />
                        </div> 
                    }
                </div>
                <div className="basis-1/6 text-center">
                    <div>Team Home</div>
                    <div>Rating {(teamBCSCAverage/extendedMatchData?.metadata.matchup.teamBCSCRatingsAtMatch.length).toFixed(2)}</div>
                    { teamAFaceitEloAverage > 0 && <div> ELO {(teamBFaceitEloAverage/extendedMatchData?.metadata.matchup.teamBFaceitElo.length).toFixed()}</div> }
                </div>
            </div>
        </>
    )
}