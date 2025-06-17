import * as React from "react";
import { Loading } from "../../common/components/loading";
import { useDataContext } from "../../DataContext";
import { usePickems, usePickemsMatchUpConsensus, usePickemsSearch } from "../../dao/analytikill";
import { GiChoice } from "react-icons/gi";
import { Link, useRoute, useSearch } from "wouter";
import { Container } from "../../common/components/container";
import { WeeklyPickems } from "./WeeklyPickems";
import { LastSaved } from "./lastSaved";
import { useFetchMatchesGraph } from "../../dao/cscMatchesGraphQLDao";
import dayjs from "dayjs";
import { matchesByMatchDay } from "./utils";
import { TimeframeToggle } from "./TimeframeToggle";
import { Match } from "../../models/matches-types";
import { FaArrowLeft } from "react-icons/fa";

type PlayersPickems =    {
  "discordId": string,
  "tier": "Recruit" | "Prospect" | "Contender" | "Challenger" | "Elite" | "Premier",
  "season": number
}

export const PickemsExplorer: React.FC = () => {
    const { seasonAndMatchType, players } = useDataContext();
    const { data: pickemsSearchData, isLoading: isLoadingPickemsSearch } = usePickemsSearch<PlayersPickems[]>(seasonAndMatchType.season, { enabled: true });
    const { data: matches = [], isLoading } = useFetchMatchesGraph(seasonAndMatchType.season, undefined, { enabled: seasonAndMatchType.season > 0});
    const queryParams = new URLSearchParams(useSearch());
    const [, params] = useRoute("/pickems/explorer/:id");
    const nameParam = decodeURIComponent(params?.id ?? "");
    const player = players.find(p => p.name === nameParam);
    const [ selectedTimeframe, setSelectedTimeframe ] = React.useState<string[]>(['past','current']);
    const { data: pickemsConcensusData, isLoading: isLoadingPickemsConsensus } = usePickemsMatchUpConsensus(seasonAndMatchType.season, { enabled: !!(player?.discordId && seasonAndMatchType.season > 0) });
    
    const { data: pickemsData } = usePickems( player?.discordId, seasonAndMatchType.season, { enabled: !!player });
    const currentDate = dayjs()

    const playersWithPickems = players.filter( p => pickemsSearchData?.find(pd => pd.discordId === p.discordId))

    const matchesByMatchday = matchesByMatchDay(matches, pickemsData?.tier);
    
        const pastMatchWeeks = Object.keys(matchesByMatchday).filter((matchDate) => 
            dayjs(matchDate).isBefore(currentDate, 'week')
        );
        const currentMatchWeek = Object.keys(matchesByMatchday).filter((matchDate) => 
            dayjs(matchDate).isSame(currentDate, 'week')
        );
        const futrueMatchWeeks = Object.keys(matchesByMatchday).filter((matchDate) =>
            dayjs(matchDate).isAfter(currentDate, 'week')
        );

    return (
        <Container>
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4 text-center">
                    <h2 className="text-2xl font-bold flex items-center">
                        <GiChoice size={"1.5rem"} className="inline mr-2" /> 
                        Explore Players Pickems
                    </h2>         
                </div>            
                { isLoadingPickemsSearch ? (
                    <div className="text-center flex justify-center items-center py-8">
                        <Loading />
                    </div>
                ) : player && pickemsData ? (
                    <>
                        <div className="h-fit">
                            <h1 className="text-3xl font-bold mb-4">
                                {player.name} {pickemsData.tier} Weekly Pickems
                            </h1>
                            <div className="flex flex-row gap-10">
                                <div 
                                    onClick={() => history.back()}
                                    className="cursor-pointer text-blue-500 hover:text-blue-700">
                                    <FaArrowLeft size="1.5rem" className="inline m-4" />
                                    Back
                                </div>      
                                <TimeframeToggle selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} />
                            </div>
                            {/* {submitError && <ErrorMessage error={submitError} />} */}
                            <LastSaved dateUpdated={pickemsData?.dateUpdated} />  
                            <div className="flex space-x-8">                                                      
                                {matchesByMatchday &&
                                    (Object.entries(matchesByMatchday) as [string, any[]][])
                                        .filter(([matchDate]) => {
                                            return (
                                                (selectedTimeframe.includes("past") && pastMatchWeeks.includes(matchDate)) ||
                                                (selectedTimeframe.includes("current") && currentMatchWeek.includes(matchDate)) ||
                                                (selectedTimeframe.includes("future") && futrueMatchWeeks.includes(matchDate)) ||
                                                selectedTimeframe.length === 0
                                            );
                                        })
                                        .map(([matchDate, matches]: [string, Match[]]) => (
                                        <WeeklyPickems                           
                                            matchDate={matchDate}
                                            matches={matches}
                                            selectedMatches={pickemsData.pickems}
                                            pickemsConcensusData={pickemsConcensusData}
                                            handleSelection={() => {}}                         
                                        />
                                    ))
                                }
                            </div>                          
                        </div>
                    </>
                ) : playersWithPickems ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        { playersWithPickems.map(cscPlayer => {
                            return (
                                <Link
                                    key={cscPlayer.discordId}
                                    href={`/pickems/explorer/${encodeURIComponent(cscPlayer.name)}`}
                                    className="p-2 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 bg-gradient-to-r from-gray-300 to-gray-500 hover:from-blue-400 hover:to-blue-400"
                                >
                                    {cscPlayer?.avatarUrl && (
                                        <img 
                                            src={cscPlayer.avatarUrl} 
                                            alt={cscPlayer.name} 
                                            className="w-12 h-12 rounded-full"
                                        />
                                    )}
                                    <div className="text-left">
                                        <div className="font-medium">{cscPlayer?.name}</div>
                                        <div className="text-xs text-gray-600 uppercase font-extrabold">{cscPlayer?.tier.name || "Unknown"}</div>
                                    </div>
                                    <div className="ml-auto text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border">
                        <div className="text-gray-500 mb-2">No player data available</div>
                        <p className="text-sm text-gray-400">This feature is currently under development.</p>
                        <p className="mt-4">
                            <Link
                                href="/pickems"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Back to My Pickems
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </Container>
    );
};
