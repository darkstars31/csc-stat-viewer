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
import { WeeklyPickems } from "./pickems/WeeklyPickems";
import { SubmitPickemsButton } from "./pickems/SubmitPickemsButton";
import { LastSaved } from "./pickems/lastSaved";
import { ErrorMessage } from "./pickems/ErrorMessage";
import { Link } from "wouter";
import { discordLogin } from "../dao/oAuth";

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
    const { loggedinUser, seasonAndMatchType, discordUser } = useDataContext();
    const [ isShowRules, setIsShowRules ] = React.useState<boolean>(false);

    const tierColors: Record<string, { bg: string; text: string; activeBg: string }> = {
        Recruit:    { bg: "bg-red-950",    text: "text-red-400",    activeBg: "bg-red-700" },
        Prospect:   { bg: "bg-orange-950", text: "text-orange-400", activeBg: "bg-orange-700" },
        Contender:  { bg: "bg-yellow-950", text: "text-yellow-400", activeBg: "bg-yellow-700" },
        Challenger: { bg: "bg-green-950",  text: "text-green-400",  activeBg: "bg-green-700" },
        Elite:      { bg: "bg-blue-950",   text: "text-blue-400",   activeBg: "bg-blue-700" },
        Premier:    { bg: "bg-purple-950", text: "text-purple-400", activeBg: "bg-purple-700" },
    };

    const { data: pickemsData, isLoading: isLoadingPickems, isFetching: isFetchingPickems } = usePickems( discordUser?.id, seasonAndMatchType.season, { enabled: !!(discordUser?.id && seasonAndMatchType.season > 0) });
    const { data: pickemsConcensusData, isLoading: isLoadingPickemsConsensus } = usePickemsMatchUpConsensus(seasonAndMatchType.season, { enabled: !!(seasonAndMatchType.season > 0) });
    const [ submitWasSuccessful, setSubmitWasSuccessful ] = React.useState<boolean>(false);
    //const [ submitError, setSubmitError ] = React.useState<unknown | undefined>(undefined);
    const mutation = usePickemsMutation(seasonAndMatchType.season);
    const [ userTier, setUserTier ] = React.useState<string | undefined>(pickemsData?.tier ?? loggedinUser?.tier?.name ?? (!discordUser ? "Contender" : undefined));
    const { data: matches = [], isLoading } = useFetchMatchesGraph(seasonAndMatchType.season, undefined, { enabled: seasonAndMatchType.season > 0}); // seasonAndMatchType.season
    const [ selectedMatches, setSelectedMatches ] = React.useState<{ [key: string]: { teamId: number, teamName: string} | null }>(pickemsData?.pickems ?? {});
    const [ selectedTimeframe, setSelectedTimeframe ] = React.useState<string[]>([]);

    console.log({ discordUser, pickemsData, isLoadingPickems, loggedinUser });

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

    if (isLoading || (loggedinUser && isLoadingPickems)) {
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
    };    
    const handleSubmit = async () => {
        //setSubmitError(undefined);
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
            // if (error instanceof Error) {
            //     setSubmitError(error.message);
            // } else if (typeof error === "object" && error !== null && "message" in error) {
            //     setSubmitError((error as any).message);
            // } else {
            //     setSubmitError("An unexpected error occurred while submitting your picks");
            // }
            
            console.error("Error submitting pickems:", error);
        }
    }

    if( discordUser && loggedinUser && (userTier === undefined || userTier.includes("Unrated")) ) {
        return (
            <Container>
                <h1 className="text-2xl font-bold mb-4">Uh oh! It looks like your tierless, please select a Tier to get started.</h1>
                <p>Select the tier you want to participate in wisely, once you save your first pickems - you cannot switch tiers.</p>
                <div className="flex space-x-4 mt-4">
                    {["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier"].map((tier) => {
                        const colors = tierColors[tier];
                        return (
                            <button
                                key={tier}
                                onClick={() => setUserTier(tier)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${colors.activeBg} ${colors.text} hover:opacity-90`}
                            >
                                {tier}
                            </button>
                        );
                    })}
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="h-fit">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        { discordUser && <h1 className="text-2xl font-bold mr-2">My Weekly Pickems</h1> }
                        {["Recruit", "Prospect", "Contender", "Challenger", "Elite", "Premier"].map((tier) => {
                            const colors = tierColors[tier];
                            const isActive = userTier === tier;
                            return (
                                <button
                                    key={tier}
                                    onClick={() => setUserTier(tier)}
                                    className={`px-3 py-1 text-sm rounded-full font-semibold transition-colors ${
                                        isActive
                                            ? `${colors.activeBg} ${colors.text}`
                                            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                    }`}
                                >
                                    {tier}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none px-3 py-1 text-sm text-gray-300">
                            <span>Future Matches</span>
                            <div
                                onClick={() => setSelectedTimeframe((prev) => prev.includes("future") ? prev.filter(p => p !== "future") : [...prev, "future"])}
                                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${selectedTimeframe.includes("future") ? "bg-blue-500" : "bg-gray-600"}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${selectedTimeframe.includes("future") ? "translate-x-4" : "translate-x-0"}`} />
                            </div>
                        </label>
                        <button 
                            onClick={() => setIsShowRules(true)}
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Rules
                        </button>
                        <Link className="inline-flex items-center px-3 py-1 text-white text-sm font-bold rounded-full hover:text-blue-400 cursor-pointer transition-colors"
                            href="/pickems/explorer"
                        >
                            Explore Players Pickems <GiChoice size={"1.5rem"} className="inline ml-1" />
                        </Link>
                    </div>
                </div>
                { 
                <>      
                    {/* {submitError && <ErrorMessage error={submitError} />} */}
                    <LastSaved dateUpdated={pickemsData?.dateUpdated} />
                    { !discordUser && (
                        <div className="mb-4 px-4 py-3 bg-blue-500 bg-opacity-10 border border-blue-400 rounded-lg text-sm text-center">
                            <button onClick={discordLogin} className="text-blue-400 hover:underline font-semibold">Log in</button> to make your own picks and track your score!
                        </div>
                    )}
                    <div className="flex flex-col space-y-8">               
                        { discordUser && (
                            <SubmitPickemsButton 
                                submitWasSuccessful={submitWasSuccessful} 
                                handleSubmit={handleSubmit}
                                //submitError={submitError}
                                isSubmitting={mutation.isPending} 
                            />
                        )}
                        {(() => {
                            const sorted = (Object.entries(matchesByMatchday) as [string, any[]][])
                                .sort(([a], [b]) => b.localeCompare(a))
                                .filter(([matchDate]) => {
                                    const isFuture = futrueMatchWeeks.includes(matchDate);
                                    if (isFuture) return selectedTimeframe.includes("future");
                                    return true;
                                });

                            const pastEntries = sorted.filter(([matchDate]) => pastMatchWeeks.includes(matchDate));
                            const currentEntries = sorted.filter(([matchDate]) => currentMatchWeek.includes(matchDate));
                            const futureEntries = sorted.filter(([matchDate]) => futrueMatchWeeks.includes(matchDate));

                            const renderCard = ([matchDate, matches]: [string, Match[]]) => (
                                <WeeklyPickems
                                    key={matchDate}
                                    matchDate={matchDate}
                                    matches={matches}
                                    selectedMatches={selectedMatches}
                                    pickemsConcensusData={pickemsConcensusData}
                                    handleSelection={discordUser ? handleSelection : () => {}}
                                />
                            );

                            return (
                                <>
                                    {futureEntries.map(renderCard)}
                                    <div className="flex items-start gap-8">
                                        <div className="flex-none">
                                            {currentEntries.map(renderCard)}
                                        </div>
                                        {pastEntries.length > 0 && (
                                            <div className="overflow-x-auto flex-1 min-w-0">
                                                <div className="flex space-x-8 pb-2" style={{ minWidth: "max-content" }}>
                                                    {pastEntries.map(renderCard)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </>}
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