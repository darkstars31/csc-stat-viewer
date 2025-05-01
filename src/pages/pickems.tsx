import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from "../DataContext";
import { useFetchMatchesGraph } from "../dao/cscMatchesGraphQLDao";
import dayjs from "dayjs";
import { Loading } from "../common/components/loading";
import { franchiseImages } from "../common/images/franchise";
import { log } from "console";

export const Pickems = () => {
    const { loggedinUser, seasonAndMatchType } = useDataContext();
    const loggedInUserTier = loggedinUser?.tier?.name;
    const { data: matches, isLoading } = useFetchMatchesGraph(16); // seasonAndMatchType.season
    const [selectedMatches, setSelectedMatches] = React.useState<{ [key: string]: string | null }>({});

    // write a reduce function on matches to organize all the matches by matchday
    const matchesByMatchday = matches?.filter( m => m.matchDay.number.includes("M"))
    .filter( m => m.home.tier.name === loggedInUserTier)
        .reduce((acc: any, match: any) => {
            const matchday = dayjs(match.scheduledDate).format("YYYY-MM-DD");
            if (!acc[matchday]) {
                acc[matchday] = [];
            }
            acc[matchday].push(match);
            return acc;
        }, {});
    

    const handleSelection = (matchId: string, selectedTeam: string) => {
        setSelectedMatches((prev) => ({
            ...prev,
            [matchId]: selectedTeam,
        }));
    };

    if (isLoading) {
        return <Container>
            <Loading />
        </Container>;
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

    return (
        <Container>
            <h1 className="text-2xl font-bold mb-4">Weekly Matches</h1>
            <div className="flex space-x-8">
                {matchesByMatchday &&
                    (Object.entries(matchesByMatchday) as [string, any[]][]).map(([matchday, matches]: [string, any[]]) => (
                        <div key={matchday} className="flex-1">
                            <h2 className="text-xl font-semibold mb-2">{matchday}</h2>
                            <div className="space-y-4 border rounded-lg shadow-sm">
                                {matches.map((match: any) => (
                                    <div key={match.id} className="p-4">
                                        <div className="flex flex-col">
                                            <div className="mt-2 flex space-x-8">
                                                <div
                                                    onClick={() => handleSelection(match.id, match.home.name)}
                                                    className={`flex flex-col items-center h-16 w-16 cursor-pointer ${
                                                        selectedMatches[match.id] === match.home.name
                                                            ? "bg-green-500 bg-opacity-15 border-2 border-green-500 p-2 rounded-lg"
                                                            : ""
                                                    }`}
                                                >
                                                    <img
                                                        src={franchiseImages[match.home.franchise.prefix]}
                                                        alt={match.home.franchise.prefix}
                                                        className="h-12 w-12 rounded-lg"
                                                    />
                                                </div>
                                                <span className="text-md font-semibold">vs.</span>
                                                <div
                                                    onClick={() => handleSelection(match.id, match.away.name)}
                                                    className={`flex flex-col items-center h-16 w-16 cursor-pointer ${
                                                        selectedMatches[match.id] === match.away.name
                                                            ? "bg-green-500 bg-opacity-15 border-2 border-green-500 p-2 rounded-lg"
                                                            : ""
                                                    }`}
                                                >
                                                    <img
                                                        src={franchiseImages[match.away.franchise.prefix]}
                                                        alt={match.away.franchise.prefix}
                                                        className="h-12 w-12 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                            {/* {match.stats[0]?.winner && (
                                                <span className="text-sm text-gray-500 mt-2">
                                                    Winner: {match.stats[0].winner.name}
                                                </span>
                                            )} */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
            {Object.keys(selectedMatches).length > 0 && (
                <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                    <p className="text-blue-700">Your selections:</p>
                    <ul className="list-disc pl-5">
                        {Object.entries(selectedMatches).map(([matchId, team]) => (
                            <li key={matchId}>
                                Match ID {matchId}: {team}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Container>
    );
};