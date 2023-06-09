import * as React from "react";
import { Match } from "../../models/matches-types";
import { Team } from "../../models/franchise-types";

type Props = {
    match: Match
    team?: Team,
}

type MapImages = Record<string, string>;

export const mapImages: MapImages = {
    de_vertigo: "https://developer.valvesoftware.com/w/images/d/d5/De_vertigo.png",
    de_mirage:"https://developer.valvesoftware.com/w/images/6/68/De_mirage.png",
    de_nuke: "https://developer.valvesoftware.com/w/images/5/57/De_nuke.png",
    de_anubis: "https://developer.valvesoftware.com/w/images/5/54/De_anubis.png",
    de_ancient: "https://developer.valvesoftware.com/w/images/9/94/De_ancient.png",
    de_overpass: "https://developer.valvesoftware.com/w/images/d/dc/De_overpass.png",
    de_inferno: "https://developer.valvesoftware.com/w/images/b/be/De_inferno.png",
}

export function MatchCards( { match, team }: Props ) {
    const matchDate = {
        month : new Date(match.scheduledDate).getMonth(),
        day: new Date(match.scheduledDate).getDate(),
        hour: new Date(match.scheduledDate).getHours() % 12,
    }

    const backgroundColor = match.stats.length > 0 ? match.stats[0].winner.name === team?.name ? "bg-emerald-900": "bg-amber-950": "bg-midnight1";

    return (
        <div className={`m-4 p-2 ${backgroundColor} rounded-lg overflow-hidden z-0`}>
            <div className="w-full flex text-sm pb-2">
                <div className="basis-3/4">{match.matchDay.number} | {matchDate.month}/{matchDate.day} {matchDate.hour}PM</div>
                <span className="text-gray-700 text-xs text-right w-full">
                    id:{ match.id }
                </span>
            </div>
            <div className="grid grid-cols-2 overflow-hidden">
                <div className="h-16 w-16 mx-auto"><img src={`https://core.csconfederation.com/${match.home.franchise.logo.url}`} alt=""/></div>
                <div className="h-16 w-16 mx-auto"><img src={`https://core.csconfederation.com/${match.away.franchise.logo.url}`} alt=""/></div>
            </div>
            <div className="grid grid-cols-2 text-center text-sm">
                <div className="text-sky-500">{match.home.name}</div>
                <div className="text-amber-500">{match.away.name}</div>
            </div>
            { match.stats.length > 0 &&
            <div className="relative pt-2">
                <div className="absolute -z-10 w-full">
                    <img className="object-cover object-center w-16 h-16" src={mapImages[match.stats[0].mapName as keyof MapImages ]} alt=""/>
                </div>
                <div className="text-center z-10">{match.stats[0].mapName.split('_')[1]}</div>
                <div className="grid grid-cols-1 text-3xl text-center z-10">
                    <div>
                        <span className={`${match.stats[0].homeScore > match.stats[0].awayScore} ? "text-green-400 : "text-red-400"`}>{match.stats[0].homeScore}</span>
                        : 
                        <span className={`${match.stats[0].homeScore > match.stats[0].awayScore} ? "text-green-400 : "text-red-400"`}>{match.stats[0].awayScore}</span>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}