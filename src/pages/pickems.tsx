import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { useFetchMatchesGraph } from "../dao/cscMatchesGraphQLDao";
import dayjs from "dayjs";
import { Loading } from "../common/components/loading";
import { Match } from "../models/matches-types";
import { usePickems, usePickemsMatchUpConsensus, usePickemsSearch, usePickemsMutation } from "../dao/analytikill";
import { queryClient } from "../App";
import { Dialog, Transition } from "@headlessui/react";
import { TeamSide } from "./pickems/teamSide";
import { hasMatchStarted, matchesByMatchDay } from "./pickems/utils";
import { GiChoice } from "react-icons/gi";
import { PickemsRules } from "./pickems/rules";
import * as Sentry from "@sentry/react";

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
    //const { data: pickemsSearchData, isLoading: isLoadingPickemsSearch } = usePickemsSearch(seasonAndMatchType.season, { enabled: exploringPlayerPickems });
    const [ submitWasSuccessful, setSubmitWasSuccessful ] = React.useState<boolean>(false);
    const [ submissionError, setSubmissionError ] = React.useState<string | undefined>(undefined);
    const mutation = usePickemsMutation(seasonAndMatchType.season);
    const [ userTier, setUserTier ] = React.useState<string | undefined>(pickemsData?.tier ?? loggedinUser?.tier?.name ?? undefined);
    const { data: matches = [], isLoading } = useFetchMatchesGraph(seasonAndMatchType.season, undefined, { enabled: seasonAndMatchType.season > 0}); // seasonAndMatchType.season
    const [ selectedMatches, setSelectedMatches ] = React.useState<{ [key: string]: { teamId: number, teamName: string} | null }>(pickemsData?.pickems ?? {});
    const [ selectedTimeframe, setSelectedTimeframe ] = React.useState<string[]>(['current']);

    const [_, setTimeUpdateTrigger] = React.useState(0);

    const TimeToggles = [
        { label: 'Past Matches', value: 'past' },
        { label: 'This Week', value: 'current' },
        { label: 'Future Matches', value: 'future' }
    ]

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
    };

    const handleSubmit = async () => {
        try{
            const result = await mutation.mutateAsync({
                tier: userTier,
                picks: selectedMatches
            })
            setSelectedMatches(result.pickems)
            queryClient.invalidateQueries({ queryKey: ["pickems", loggedinUser?.discordId, seasonAndMatchType.season] });
            queryClient.invalidateQueries({ queryKey: ["pickemsMatchUpConsensus", seasonAndMatchType.season] });
            setSubmitWasSuccessful(true);
            setTimeout(() => setSubmitWasSuccessful(false), 3000);
        } catch (error) {
            Sentry.captureException(error);
            console.info("Error submitting pickems:", error);
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
                {/* Timeframe Toggle */}
                <div className="flex justify-center space-x-2 mb-6">
                    {TimeToggles.map((timeframe) => (
                        <button
                            key={timeframe.value}
                            onClick={() => setSelectedTimeframe(prev => prev.includes(timeframe.value) ? 
                                prev.filter( p => p !== timeframe.value) 
                                : [...prev, timeframe.value])}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                selectedTimeframe.includes(timeframe.value)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {timeframe.label}
                        </button>
                    ))}
                </div>
                <div className="text-xs font-extrabold uppercase text-gray-500">Picks last saved {pickemsData?.dateUpdated ? dayjs(pickemsData.dateUpdated).fromNow() : "Never"}</div>

                <div className="flex space-x-8">               
                    <div className="mt-8 flex justify-center">
                        {submitWasSuccessful ? (
                            <div className="flex items-center justify-center">
                                <div className="text-green-500 text-6xl animate-bounce">✔️</div>
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    await handleSubmit();
                                }}
                                className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse hover:animate-none active:translate-y-1 active:shadow-inner active:scale-95 active:bg-gradient-to-r active:from-blue-600 active:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={mutation.isPending}
                            >
                                {!mutation.isPending ? "SUBMIT YOUR PICKS! ✨" : "Submitting"}
                            </button>
                        )}
                    </div>               
                    {matchesByMatchday &&
                        (Object.entries(matchesByMatchday) as [string, any[]][])
                        .filter(([matchDate]) => {
                            return (selectedTimeframe.includes('past') && pastMatchWeeks.includes(matchDate))
                            || (selectedTimeframe.includes('current') && currentMatchWeek.includes(matchDate))
                            || (selectedTimeframe.includes('future') && futrueMatchWeeks.includes(matchDate))
                            || selectedTimeframe.length === 0;
                        })
                        .map(([matchDate, matches]: [string, Match[]]) => (
                            <Transition
                                appear={true}
                                show={true}
                                enter="transition-opacity duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                >    
                            <div key={matchDate} className="flex flex-col">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 uppercase">Match Day {matches[0].matchDay.number.replace("M","")}</h2>
                                </div>
                                <div className="border rounded-lg shadow-sm">
                                    <div>
                                        <div className="text-xs font-semibold text-center">{dayjs(matchDate).format("MM/DD/YYYY")}</div>
                                        <div className="flex justify-between px-4 py-2 border-b">
                                            <span className="text-sm font-bold">HOME</span>
                                            <div className="text-gray-600 text-sm">
                                            {matches.reduce((acc, match) =>
                                                matches.find(m => m.id === match.id)?.completedAt && selectedMatches[match.id]?.teamId === match.stats[0]?.winner?.id ? acc + 1 : acc, 0)} pts
                                            </div>
                                            <span className="text-sm font-bold">AWAY</span>
                                        </div>
                                    </div>
                                    {matches.map((match: Match) => (
                                        <div key={match.id} className="p-1 relative">
                                            {hasMatchStarted(match.scheduledDate) && (
                                                <div className="absolute inset-0 bg-gray-400 bg-opacity-15 z-10" />
                                            )}
                                            <div className="flex flex-col">
                                                <div className="flex space-x-4">
                                                    <TeamSide match={match} selectedMatches={selectedMatches} side={"home"} pickemsConcensusData={pickemsConcensusData} handleSelection={handleSelection} />
                                                    <span className="m-auto text-md font-semibold">vs.</span>
                                                    <TeamSide match={match} selectedMatches={selectedMatches} side={"away"} pickemsConcensusData={pickemsConcensusData} handleSelection={handleSelection} />                                     
                                                </div>
                                                {/* { !isLoadingPickemsConsensus && <ConcensusBar match={match} pickemsConcensusData={pickemsConcensusData} /> } */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </Transition>        
                        ))}
                </div>
                </>}
                {exploringPlayerPickems && (
                    <div className="mt-8">
                        <p className="mb-4">This feature is under development, please check back later!</p>
                        <button 
                            onClick={() => setExploringPlayerPickems(false)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Back to My Pickems
                        </button>
                        {/* <div>
                            {isLoadingPickemsSearch ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loading />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pickemsSearchData?.length > 0 ? (
                                        pickemsSearchData.map((player) => {
                                            const { players } = useDataContext();
                                            const cscPlayer = players.find(p => p.discordId === player.discordId);
                                            return (
                                            <button 
                                                key={player.discordId}
                                                onClick={() => {
                                                    // TODO: Implement viewing another player's pickems
                                                    console.log(`View ${player.username}'s pickems`);
                                                }}
                                                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100"
                                            >
                                                {player.avatarUrl && (
                                                    <img 
                                                        src={cscPlayer?.avatarUrl} 
                                                        alt={cscPlayer?.name} 
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                )}
                                                <div className="text-left">
                                                    <div className="font-medium">{cscPlayer?.name}</div>
                                                    <div className="text-xs text-gray-600">Tier: {player.tier || "Unknown"}</div>
                                                </div>
                                                <div className="ml-auto text-blue-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </button>
                                        )})
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No player data available
                                        </div>
                                    )}
                                </div>
                            )}
                        </div> */}
                    </div>
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