import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { useFetchMatchesGraph } from "../dao/cscMatchesGraphQLDao";
import dayjs from "dayjs";
import { Loading } from "../common/components/loading";
import { Match } from "../models/matches-types";
import { usePickems, usePickemsMatchUpConsensus, usePickemsMutation } from "../dao/analytikill";
import { queryClient } from "../App";
import { Dialog } from "@headlessui/react";
import { matchesByMatchDay } from "./pickems/utils";
import { GiChoice } from "react-icons/gi";
import { PickemsRules } from "./pickems/rules";
import * as Sentry from "@sentry/react";
import { PlayerPickemsExplorer } from "./pickems/PlayerPickemsExplorer";
import { WeeklyPickems } from "./pickems/WeeklyPickems";
import { TimeframeToggle } from "./pickems/TimeframeToggle";
import { SubmitPickemsButton } from "./pickems/SubmitPickemsButton";
import { ErrorMessage } from "./pickems/ErrorMessage";

// const ConcensusBar = ({match, pickemsConcensusData}) => {
//     const [isHovered, setIsHovered] = React.useState(false);
//     const totalVotes = Object.values(pickemsConcensusData?.[match.id] ?? {}).reduce((acc, votes) => acc + (votes || 0), 0);
//     return (
//         <div className="mt-2">
//             {totalVotes > 0 ? (
//                 <>
//                     <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
//                         <div className="flex h-full">
//                             <div 
//                                 className="bg-gradient-to-r from-blue-500 via-blue-500 to-yellow-800 text-xs flex items-center justify-center text-white transition-all duration-300"
//                                 style={{width: `${((pickemsConcensusData[match.id]?.[match.home.id] ?? 0) / totalVotes) * 100}%`}}
//                             >
//                                 {((pickemsConcensusData[match.id]?.[match.home.id] ?? 0) / totalVotes * 100).toFixed(0)}%
//                             </div>
//                             <div 
//                                 className="bg-gradient-to-r from-yellow-800 via-red-500 to-red-500 text-xs flex items-center justify-center text-white transition-all duration-300"
//                                 style={{width: `${((pickemsConcensusData[match.id]?.[match.away.id] ?? 0) / totalVotes) * 100}%`}}
//                             >
//                                 {((pickemsConcensusData[match.id]?.[match.away.id] ?? 0) / totalVotes * 100).toFixed(0)}%
//                             </div>
//                         </div>
//                     </div>
//                     { isHovered && <div className="flex justify-between text-xs mt-1">
//                         <span className="font-semibold">{pickemsConcensusData[match.id]?.[match.home.id] ?? 0} votes</span>
//                         <span className="font-semibold">{pickemsConcensusData[match.id]?.[match.away.id] ?? 0} votes</span>
//                     </div>}
//                 </>
//             ) : (
//                 <div className="text-xs text-center text-gray-500 italic">No votes yet</div>
//             )}
//         </div>
//     );
// };

export const Pickems = () => {
    const { loggedinUser, seasonAndMatchType } = useDataContext();
    const [ isShowRules, setIsShowRules ] = React.useState<boolean>(false);
    const [ exploringPlayerPickems, setExploringPlayerPickems ] = React.useState<boolean>(false);

    const { data: pickemsData, isLoading: isLoadingPickems, isFetching: isFetchingPickems } = usePickems( loggedinUser?.discordId, seasonAndMatchType.season, { enabled: !!(loggedinUser?.discordId && seasonAndMatchType.season > 0) });
    const { data: pickemsConcensusData, isLoading: isLoadingPickemsConsensus } = usePickemsMatchUpConsensus(seasonAndMatchType.season, { enabled: !!(loggedinUser?.discordId && seasonAndMatchType.season > 0) });
    const [ submitWasSuccessful, setSubmitWasSuccessful ] = React.useState<boolean>(false);
    const [ submitError, setSubmitError ] = React.useState<unknown | undefined>(undefined);
    const mutation = usePickemsMutation(seasonAndMatchType.season);
    const [ userTier, setUserTier ] = React.useState<string | undefined>(pickemsData?.tier ?? loggedinUser?.tier?.name ?? undefined);
    const { data: matches = [], isLoading } = useFetchMatchesGraph(seasonAndMatchType.season, undefined, { enabled: seasonAndMatchType.season > 0}); // seasonAndMatchType.season
    const [ selectedMatches, setSelectedMatches ] = React.useState<{ [key: string]: { teamId: number, teamName: string} | null }>(pickemsData?.pickems ?? {});
    const [ selectedTimeframe, setSelectedTimeframe ] = React.useState<string[]>(['current']);

    const [_, setTimeUpdateTrigger] = React.useState(0);    // Time toggles now handled by TimeframeToggle component

    // Add this effect to update the time display every minute
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeUpdateTrigger(prev => prev + 1);
        }, 60000); // Update every minute (60000ms)
        
        return () => clearInterval(timer);
    }, []);

    React.useEffect(() => {
        if (pickemsData?.tier && !isLoadingPickems) {
            setUserTier(pickemsData.tier);
            setSelectedMatches(pickemsData.pickems);
        } else if (loggedinUser?.tier && loggedinUser.tier.name) {
            setUserTier(loggedinUser.tier.name);
        }
    }, [loggedinUser, pickemsData]);

    React.useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["pickems", loggedinUser?.discordId, seasonAndMatchType.season] });
        queryClient.invalidateQueries({ queryKey: ["pickemsMatchUpConsensus", seasonAndMatchType.season] });
    }, [mutation.isSuccess])

    const currentDate = dayjs()

    if (isLoading || isLoadingPickems) {
        return <Container>
            <Loading />
        </Container>;
    }

    // write a reduce function on matches to organize all the matches by matchday
    const matchesByMatchday = matchesByMatchDay(matches, userTier);

    const pastMatchWeeks = Object.keys(matchesByMatchday).filter((matchDate) => 
        dayjs(matchDate).isBefore(currentDate, 'week')
    );
    const currentMatchWeek = Object.keys(matchesByMatchday).filter((matchDate) => 
        dayjs(matchDate).isSame(currentDate, 'week')
    );
    const futrueMatchWeeks = Object.keys(matchesByMatchday).filter((matchDate) =>
        dayjs(matchDate).isAfter(currentDate, 'week')
    );

    const handleSelection = (matchId: string, selected: { teamId: number; teamName: string }) => {
        setSelectedMatches((prev) => ({
            ...prev,
            [matchId]: selected,
        }));
    };    const handleSubmit = async () => {
        setSubmitError(undefined);
        try {
            const result = await mutation.mutateAsync({
                tier: userTier,
                picks: selectedMatches
            });
            setSelectedMatches(result.pickems);
            queryClient.invalidateQueries({ queryKey: ["pickems", loggedinUser?.discordId, seasonAndMatchType.season] });
            queryClient.invalidateQueries({ queryKey: ["pickemsMatchUpConsensus", seasonAndMatchType.season] });
            setSubmitWasSuccessful(true);
            setTimeout(() => setSubmitWasSuccessful(false), 3000);
        } catch (error) {
            Sentry.captureException(error);
            
            // Improved error handling
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else if (typeof error === "object" && error !== null && "message" in error) {
                setSubmitError((error as any).message);
            } else {
                setSubmitError("An unexpected error occurred while submitting your picks");
            }
            
            console.error("Error submitting pickems:", error);
        }
    }

    if (!loggedinUser){
        return <Container>
            <h1 className="text-2xl font-bold mb-4">My Weekly Pickems</h1>
            <div className="flex space-x-8">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">Please login to make your Pickems</h2>
                </div>
            </div>
        </Container>;
    }

    if( userTier === undefined || userTier.includes("Unrated") ) {
        return (
            <Container>
                <h1 className="text-2xl font-bold mb-4">Uh oh! It looks like your tierless, please select a Tier to get started.</h1>
                <p>Select the tier you want to participate in wisely, once you save your first pickems - you cannot switch tiers.</p>
                <div className="flex space-x-4">
                    {["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier"].map((tier: any) => (
                    <button
                        key={tier}
                        onClick={() => setUserTier(tier)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {tier}
                    </button>
                    ))}
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="h-fit">
                <h1 className="text-3xl font-bold mb-4 text-center">
                    { exploringPlayerPickems ? "Exploring" : `My ${userTier}`} Weekly Pickems
                </h1>
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                            Beta
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                            Live
                        </span>
                        <button 
                            onClick={() => setIsShowRules(true)}
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Rules
                        </button>
                        <span 
                            className="inline-flex items-center px-3 py-1 text-white text-sm font-bold rounded-full hover:text-blue-400 cursor-pointer transition-colors"
                            onClick={() => setExploringPlayerPickems(true)}
                            >
                            Explore Players Pickems <GiChoice size={"1.5rem"} className="inline" />
                        </span>
                    </div>
                </div>
                { !exploringPlayerPickems &&
                <>      
                    <TimeframeToggle selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} />
                    {/* {submitError && <ErrorMessage error={submitError} />} */}
                    <div className="text-xs font-extrabold uppercase text-gray-500">Picks last saved {pickemsData?.dateUpdated ? dayjs(pickemsData.dateUpdated).fromNow() : "Never"}</div>

                    <div className="flex space-x-8">               
                        <SubmitPickemsButton 
                            submitWasSuccessful={submitWasSuccessful} 
                            handleSubmit={handleSubmit}
                            isSubmitting={mutation.isPending} 
                        />
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
                                    selectedMatches={selectedMatches}
                                    pickemsConcensusData={pickemsConcensusData}
                                    handleSelection={handleSelection}                         
                                />
                            ))
                        }
                    </div>
                </>}
                {exploringPlayerPickems && (
                    <PlayerPickemsExplorer 
                        onBackToMyPickems={() => setExploringPlayerPickems(false)} 
                    />
                )}
                {/* {Object.keys(selectedMatches ?? []).length > 0 && (
                    <div className="mt-6 p-4 bg-blue-700 border border-blue-300 rounded-lg text-xs">
                        Debug
                        <p className="">Your selections:</p>
                        <ul className="flex flex-row flex-wrap gap-2">
                            {Object.entries(selectedMatches).map(([matchId, obj]) => (
                                <div key={matchId}>
                                    <div>Match ID {matchId}:</div>
                                    <div>{obj?.teamName}</div>
                                </div>
                            ))}
                        </ul>
                    </div>
                )} */}
            </div>
            <Dialog 
                open={isShowRules} 
                onClose={() => setIsShowRules(false)} 
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <PickemsRules setIsShowRules={setIsShowRules} />
            </Dialog>
        </Container>
    );
};