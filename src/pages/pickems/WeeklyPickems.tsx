import * as React from "react";
import { Transition } from "@headlessui/react";
import dayjs from "dayjs";
import { Match } from "../../models/matches-types";
import { TeamSide } from "./teamSide";
import { hasMatchStarted } from "./utils";
import { FaLock } from "react-icons/fa";

interface WeeklyPickemsProps {
    matchDate: string;
    matches: Match[];
    selectedMatches: { [key: string]: { teamId: number; teamName: string } | null };
    pickemsConcensusData: any;
    handleSelection: (matchId: string, selected: { teamId: number; teamName: string }) => void;
}

export const WeeklyPickems: React.FC<WeeklyPickemsProps> = ({
    matchDate,
    matches,
    selectedMatches,
    pickemsConcensusData,
    handleSelection,
}) => {
    const [timeRemaining, setTimeRemaining] = React.useState<dayjs.Dayjs | undefined>(dayjs(matches.at(0)?.scheduledDate));
    const isToday = dayjs().isSame(matchDate, "day");
    //usePerspectiveEffect("weekly-pickems-container", "weekly-pickems-layer", 20);

    React.useEffect(() => {
        const updateTimeRemaining = () => {
            const timeToMatchesStart = matches.at(0)?.scheduledDate;
            if (isToday && timeToMatchesStart) {              
                setTimeRemaining(dayjs(timeToMatchesStart));
            } 
        };

        const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [timeRemaining])

    return (
        <>
            <Transition
                key={matchDate}
                appear={true}
                show={true}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div id="weekly-pickems-container" className="flex flex-col">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 uppercase">Match Day {matches.at(-1)?.matchDay.number.replace("M", "")}</h2>
                    </div>
                    <div className="border rounded-lg shadow-sm">
                        <div>
                            <div className="text-xs font-semibold text-center">{dayjs(matchDate).format("MM/DD/YYYY")}</div>
                            { isToday && <div className={`text-xs text-center ${ dayjs(timeRemaining).diff(dayjs(), 'minute') < 120 ? "text-red-500" : "" }`}>Picks <FaLock className={`inline`} /> { timeRemaining?.fromNow() }</div> }
                            <div className="flex justify-between px-4 py-2 border-b">
                                <span className="text-sm font-bold">HOME</span>
                                <div className="text-gray-600 text-sm">
                                    {matches.reduce(
                                        (acc, match) =>
                                            matches.find((m) => m.id === match.id)?.completedAt &&
                                            selectedMatches[match.id]?.teamId === match.stats[0]?.winner?.id
                                                ? acc + 1
                                                : acc,
                                        0
                                    )}{" "}
                                    pts
                                </div>
                                <span className="text-sm font-bold">AWAY</span>
                            </div>
                        </div>
                        {matches.map((match: Match) => (
                            <div id="weekly-pickems-layer" key={match.id} className="p-1 relative">
                                {hasMatchStarted(match.scheduledDate) && (
                                    <div className="absolute inset-0 bg-gray-400 bg-opacity-15 z-10" />
                                )}
                                <div className="flex flex-col">
                                    <div className="flex space-x-4">
                                        <TeamSide
                                            match={match}
                                            selectedMatches={selectedMatches}
                                            side={"home"}
                                            pickemsConcensusData={pickemsConcensusData}
                                            handleSelection={handleSelection}
                                        />
                                        <span className="m-auto text-md font-semibold">vs.</span>
                                        <TeamSide
                                            match={match}
                                            selectedMatches={selectedMatches}
                                            side={"away"}
                                            pickemsConcensusData={pickemsConcensusData}
                                            handleSelection={handleSelection}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Transition>
        </>
    );
};
