// @ts-nocheck

import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { useFetchMatchesGraph } from "../dao/cscMatchesGraphQLDao";
import dayjs from "dayjs";
import { Loading } from "../common/components/loading";
import { franchiseImages } from "../common/images/franchise";
import { Match } from "../models/matches-types";

export const Pickems = () => {
    const x = {
        "5353": {
          "teamId": "176",
          "teamName": "Lawless Llamas"
        },
        "5354": {
          "teamId": "147",
          "teamName": "The Watchers"
        },
        "5355": {
          "teamId": "106",
          "teamName": "Cheetahs"
        },
        "5356": {
          "teamId": "54",
          "teamName": "Pho Fighters"
        },
        "5357": {
          "teamId": "57",
          "teamName": "Ravens"
        },
        "5358": {
          "teamId": "90",
          "teamName": "Sirens"
        },
        "5359": {
          "teamId": "126",
          "teamName": "Storm"
        },
        "5360": {
          "teamId": "127",
          "teamName": "Fraggin Frogs"
        },
        "5361": {
          "teamId": "150",
          "teamName": "Decibel Demons"
        },
        "5387": {
          "teamId": "127",
          "teamName": "Fraggin Frogs"
        },
        "5388": {
          "teamId": "106",
          "teamName": "Cheetahs"
        },
        "5389": {
          "teamId": "54",
          "teamName": "Pho Fighters"
        },
        "5390": {
          "teamId": "150",
          "teamName": "Decibel Demons"
        },
        "5391": {
          "teamId": "132",
          "teamName": "Salty Scripters"
        },
        "5392": {
          "teamId": "124",
          "teamName": "The Bachelors"
        },
        "5394": {
          "teamId": "90",
          "teamName": "Sirens"
        },
        "5395": {
          "teamId": "147",
          "teamName": "The Watchers"
        }
      }
    const { loggedinUser, seasonAndMatchType } = useDataContext();
    const [ userTier, setUserTier ] = React.useState<string | undefined>(loggedinUser?.tier?.name);
    const { data: matches, isLoading } = useFetchMatchesGraph(16); // seasonAndMatchType.season
    const [ selectedMatches, setSelectedMatches ] = React.useState<{ [key: string]: { teamId: number, teamName: string} | null }>(x);
    const [ selectedTimeframe, setSelectedTimeframe ] = React.useState<'past' | 'current' | 'future'>('current');

    const currentDate = dayjs("02/18/2025").add(21, "hours").add(1, "minute") 

    const hasMatchStarted = React.useCallback((matchDate: Date) => {
        return dayjs(matchDate).isBefore(currentDate);
    }, []);

    if (isLoading) {
        return <Container>
            <Loading />
        </Container>;
    }

    // write a reduce function on matches to organize all the matches by matchday
    const matchesByMatchday = matches?.filter( m => m.matchDay.number.includes("M"))
    .filter( m => m.home.tier.name === userTier)
        .reduce((acc: any, match: any) => {
            const matchday = dayjs(match.scheduledDate).format("YYYY-MM-DD");
            if (!acc[matchday]) {
                acc[matchday] = [];
            }
            acc[matchday].push(match);
            return acc;
        }, {});

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

    const handleSubmit = () => {
        console.log("Selected Matches:", selectedMatches);
    }

    if (!loggedinUser){
        return <Container>
            <h1 className="text-2xl font-bold mb-4">Weekly Matches</h1>
            <div className="flex space-x-8">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">Please login to make your Pickems</h2>
                </div>
            </div>
        </Container>;
    }

    if( userTier === undefined ) {
        return (
            <Container>
                <h1 className="text-2xl font-bold mb-4">Select Your Tier</h1>
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

    const TeamSideItem = ({match, selectedMatches, side}: { match: Match, selectedMatches: { [key: string]: { teamId: number, teamName: string } | null }, side: 'home' | 'away' }) => {
        const team = match[side];
        return (
        <div onClick={() => !hasMatchStarted(match.scheduledDate) && handleSelection(match.id, { teamId: team.id, teamName: team.name })}
        className={`flex flex-col items-center h-14 w-14 rounded-lg p-2
            ${hasMatchStarted(match.scheduledDate) && selectedMatches[match.id]?.teamId === team.id && match.stats[0]?.winner?.id === team.id
                ? "bg-green-500 bg-opacity-15 border-2 border-green-500"
                : ""}
            ${hasMatchStarted(match.scheduledDate) && selectedMatches[match.id]?.teamId === team.id && match.stats[0]?.winner?.id !== team.id
                ? "bg-red-500 bg-opacity-15 border-2 border-red-500"
                : ""
            }
            ${!hasMatchStarted(match.scheduledDate) && selectedMatches[match.id]?.teamId === team.id
                ? "bg-blue-500 bg-opacity-15 border-2 border-blue-500"
                : ""
            }
        `}
    >
        <img
            src={franchiseImages[team.franchise.prefix]}
            alt={team.franchise.prefix}
            className="h-12 w-12 rounded-lg"
        />
    </div>);
    }

    return (
        <Container>
            <h1 className="text-3xl font-bold mb-4 text-center">{userTier} Weekly Pickems</h1>
            {/* Timeframe Toggle */}
            <div className="flex justify-center space-x-2 mb-6">
                {['past', 'current', 'future'].map((timeframe) => (
                    <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe as 'past' | 'current' | 'future')}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            selectedTimeframe === timeframe
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Matches
                    </button>
                ))}
            </div>

            <div className="flex space-x-8">
                {matchesByMatchday &&
                    (Object.entries(matchesByMatchday) as [string, any[]][])
                    .filter(([matchDate]) => {
                        switch(selectedTimeframe) {
                            case 'past':
                                return pastMatchWeeks.includes(matchDate);
                            case 'current':
                                return currentMatchWeek.includes(matchDate);
                            case 'future':
                                return futrueMatchWeeks.includes(matchDate);
                            default:
                                return false;
                        }
                    })
                    .map(([matchDate, matches]: [string, Match[]]) => (
                        <div key={matchDate} className="flex flex-col">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Match Day {matches[0].matchDay.number.replace("M","")}</h2>
                                <h2 className="text-sm font-semibold mb-2">{dayjs(matchDate).format("MM/DD/YYYY")}</h2>
                            </div>
                            <div className="border rounded-lg shadow-sm">
                                <div>
                                    <div className="flex justify-between px-4 py-2 border-b">
                                        <span className="text-sm font-bold">HOME</span>
                                        <div className="text-gray-600 text-sm">
                                        {matches.reduce((acc, match) =>
                                            selectedMatches[match.id]?.teamId === match.stats[0]?.winner?.id ? acc + 1 : acc, 0)} pts
                                        </div>
                                        <span className="text-sm font-bold">AWAY</span>
                                    </div>
                                </div>
                                {matches.map((match: Match) => (
                                    <div key={match.id} className="p-1 relative">
                                        {hasMatchStarted(match.scheduledDate) && (
                                            <div className="absolute inset-0 bg-gray-400 bg-opacity-20 z-10" />
                                        )}
                                        <div className="flex flex-col">
                                            <div className="flex space-x-4">
                                                <TeamSideItem match={match} selectedMatches={selectedMatches} side={"home"} />
                                                <span className="m-auto text-md font-semibold">vs.</span>
                                                <TeamSideItem match={match} selectedMatches={selectedMatches} side={"away"} />                                     
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
            
            {/* Big shiny submit button */}
            {selectedTimeframe === 'current' && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => handleSubmit()}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse hover:animate-none active:translate-y-1 active:shadow-inner active:scale-95 active:bg-gradient-to-r active:from-blue-600 active:to-purple-700"
                        disabled={Object.keys(selectedMatches).length === 0}
                    >
                        SUBMIT YOUR PICKS! ✨
                    </button>
                </div>
            )}
            
            {Object.keys(selectedMatches).length > 0 && (
                <div className="mt-6 p-4 bg-blue-700 border border-blue-300 rounded-lg">
                    <p className="text-blue-700">Your selections:</p>
                    <ul className="list-disc pl-5">
                        {Object.entries(selectedMatches).map(([matchId, obj]) => (
                            <li key={matchId}>
                                Match ID {matchId}: {obj?.teamName} (ID: {obj?.teamId})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Container>
    );
};