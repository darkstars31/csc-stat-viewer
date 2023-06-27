import * as React from "react";
import { Match } from "../../models/matches-types";
import { Team } from "../../models/franchise-types";
import { GrDocumentVideo } from "react-icons/gr"
import { Link } from "wouter";

import { mapImages } from "../../common/images/maps";

type Props = {
    match: Match
    team?: Team,
}

export function MatchCards( { match, team }: Props ) {
    const matchDate = {
        month : new Date(match.scheduledDate).getMonth(),
        day: new Date(match.scheduledDate).getDate(),
        hour: new Date(match.scheduledDate).getHours() % 12,
    }
    const isHomeTeam = match.home.name === team?.name;
    const didCurrentTeamWin =  (isHomeTeam && match.stats[0].homeScore > match.stats[0].awayScore) || (!isHomeTeam && match.stats[0].homeScore < match.stats[0].awayScore);
    const backgroundColor = match.stats.length > 0 ? didCurrentTeamWin  ? "bg-emerald-900": "bg-amber-950": "bg-midnight1";

    return (
        <div className={`m-2 p-2 ${backgroundColor} rounded-lg overflow-hidden z-0`}>
            <div className="w-full flex text-sm pb-2">
                <div className="basis-3/4">{match.matchDay.number} | {matchDate.month}/{matchDate.day} {matchDate.hour}PM</div>
                <span className="text-gray-700 text-xs text-right w-full">
                    id:{ match.id }
                </span>
            </div>
            <div className="cursor-pointer">
                <div className="grid grid-cols-2 overflow-hidden">
                    <Link to={`/franchises/${match.home.franchise.name}/${match.home.name}`}><div className="h-16 w-16 mx-auto"><img src={`https://core.csconfederation.com/${match.home.franchise.logo.url}`} alt=""/></div></Link>
                    <Link to={`/franchises/${match.away.franchise.name}/${match.away.name}`}><div className="h-16 w-16 mx-auto"><img src={`https://core.csconfederation.com/${match.away.franchise.logo.url}`} alt=""/></div></Link>
                </div>
                <div className="grid grid-cols-2 text-center text-sm">
                    <Link to={`/franchises/${match.home.franchise.name}/${match.home.name}`}><div className="text-sky-500">{match.home.name}</div></Link>
                    <Link to={`/franchises/${match.away.franchise.name}/${match.away.name}`}><div className="text-amber-500">{match.away.name}</div></Link>
                </div>
            </div>
            { match.stats.length > 0 ?
            <div className="relative pt-2">
                <div className="absolute -z-10 w-full">
                    <img className="object-cover object-center w-16 h-16" src={mapImages[match.stats[0].mapName as keyof typeof mapImages ]} alt={match.stats[0].mapName}/>
                </div>
                <div className="text-center z-10">{match.stats[0].mapName.split('_')[1]}</div>
                <div className="grid grid-cols-1 text-3xl text-center z-10">
                    <div>
                        <span className={`${match.stats[0].homeScore > match.stats[0].awayScore} ? "text-green-400 : "text-red-400"`}>{match.stats[0].homeScore}</span>
                        : 
                        <span className={`${match.stats[0].homeScore > match.stats[0].awayScore} ? "text-green-400 : "text-red-400"`}>{match.stats[0].awayScore}</span>
                    </div>
                </div>
                { match.demoUrl && <div className="float-right"><a href={match.demoUrl} title="Download Demo" rel="noreferrer" target="_blank"><GrDocumentVideo className="text-white" /></a></div> }
            </div>
            :
            <div className="text-center py-4 text-sm text-gray-700">Match hasn't been played yet or no stats found</div>}
        </div>
    );
}