import { Team } from "../../models/franchise-types";
import { Match } from "../../models/matches-types";


export const getTeamRecord = ( team?: Team, matches?: Match[] ) => matches?.reduce((acc, match) => {
    if( match.stats.length > 0) {
        const isHomeTeam = match.home.name === team?.name;
        if( match.stats.length > 0) {
            const didCurrentTeamWin = ( isHomeTeam && match.stats[0].homeScore > match.stats[0].awayScore ) || ( !isHomeTeam && match.stats[0].homeScore < match.stats[0].awayScore);
            didCurrentTeamWin ? acc.wins = acc.wins + 1 : acc.losses = acc.losses + 1;
        }
    }
    return acc;
}, { wins: 0, losses: 0 });

export const calculateTeamRecord = (team?: Team, matches?: Match[]) => matches?.reduce((acc, match) => {
    if( match.stats.length > 0 ) {
        const isHomeTeam = match.home.name === team?.name;
        const map = match.stats[0].mapName;

        if( !acc.record ) { 
            acc.record = { wins: 0, losses: 0, roundsWon: 0, roundsLost: 0 };
            acc.maps = [];
        }

        if( !acc.maps[map] ) {
            acc.maps[map] = { name: map, wins: 0, loss: 0, roundsWon: 0, roundsLost: 0 };
        }

        const didCurrentTeamWin = (isHomeTeam && match.stats[0].homeScore > match.stats[0].awayScore ) || ( !isHomeTeam && match.stats[0].homeScore < match.stats[0].awayScore );

        if( didCurrentTeamWin ) {
            acc.record.wins += 1;
            acc.maps[map]["wins"] += 1;
        } else {
            acc.record.losses += 1;
            acc.maps[map]["loss"] += +1;
        }

        if( isHomeTeam ){
            acc.record.roundsWon += match.stats[0].homeScore;
            acc.record.roundsLost += match.stats[0].awayScore;
            acc.maps[map]["roundsWon"] += match.stats[0].homeScore
            acc.maps[map]["roundsLost"] += match.stats[0].awayScore
        } else {
            acc.record.roundsWon += match.stats[0].awayScore;
            acc.record.roundsLost += match.stats[0].homeScore;
            acc.maps[map]["roundsWon"] += match.stats[0].awayScore;
            acc.maps[map]["roundsLost"] += match.stats[0].homeScore;
        }
    }
    return acc;
}, {} as any);