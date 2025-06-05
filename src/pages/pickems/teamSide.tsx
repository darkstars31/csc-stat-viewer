import * as React from 'react';
import { Match } from "../../models/matches-types";
import { franchiseImages } from "../../common/images/franchise";
import { hasMatchStarted } from "./utils";


type Props = {
    match: Match;
    selectedMatches: { [key: string]: { teamId: number, teamName: string } | null };
    side: 'home' | 'away';
    pickemsConcensusData: { [matchId: string]: { [teamId: number]: number } } | undefined;
    handleSelection: (matchId: string, selection: { teamId: number, teamName: string }) => void;
}


export const TeamSide =  ({ match, selectedMatches, side, pickemsConcensusData, handleSelection }: Props) => {
        const team = match[side];
        const totalVotes = Object.values(pickemsConcensusData?.[match.id] ?? {}).reduce((acc, votes) => acc + (votes || 0), 0);
        const percentage = ((pickemsConcensusData?.[match.id]?.[team.id]?? 0) / totalVotes) * 100 || 0;
        return (
        <div 
            onClick={() => !hasMatchStarted(match.scheduledDate) && handleSelection(match.id, { teamId: team.id, teamName: team.name })}
            className={`flex flex-col cursor-pointer items-center h-20 w-16 rounded-lg p-2
            ${hasMatchStarted(match.scheduledDate) && selectedMatches[match.id]?.teamId === team.id && !!match.stats[0]?.winner && match.stats[0]?.winner?.id === team.id
            ? "bg-emerald-400 bg-opacity-15 border-2 border-green-500"
            : ""}
            ${hasMatchStarted(match.scheduledDate) && selectedMatches[match.id]?.teamId === team.id && !!match.stats[0]?.winner && match.stats[0]?.winner?.id !== team.id
            ? "bg-red-500 bg-opacity-15 border-2 border-amber-600"
            : ""}
            ${!hasMatchStarted(match.scheduledDate) && selectedMatches[match.id]?.teamId === team.id
            ? "bg-blue-500 bg-opacity-15 border-2 border-blue-500"
            : ""}
        `}
    >
            <div className="object-contain flex items-center justify-center h-12 w-12">
                <img
                    src={franchiseImages[team.franchise.prefix]}
                    alt={team.franchise.prefix}
                    className="rounded-lg"
                />
            </div>
            <div className={``}>
                { pickemsConcensusData && pickemsConcensusData[match.id] &&
                    <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                }
            </div>
        </div>);
}