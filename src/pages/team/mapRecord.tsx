import * as React from 'react';
import { Match } from '../../models/matches-types';
import { Team } from '../../models/franchise-types';
import { mapImages } from "../../common/images/maps";

type Props = {
    matches: Match[];
    team?: Team;
}

type Record = { name: string, wins: number, loss: number, roundsWon: number, roundsLost: number};


const calcPercentage = ( value: number, total: number) => ((value/total)*100).toFixed(0);

export function MapRecord( { matches, team }: Props) {

	const mapRecords: Record[] = matches.reduce((acc, match) => {
		if( match.stats.length > 0 ) {
            const isHomeTeam = match.home.name === team?.name;
			const map = match.stats[0].mapName;
			if( !acc[map] ) acc[map] = { name: map, wins: 0, loss: 0, roundsWon: 0, roundsLost: 0 };
			match.stats[0].winner.name === team?.name 
                ? acc[map]["wins"] = acc[map]["wins"]+1 
                : acc[map]["loss"] = acc[map]["loss"]+1;
            isHomeTeam ? acc[map]["roundsWon"] = acc[map]["roundsWon"] + match.stats[0].homeScore : acc[map]["roundsWon"] = acc[map]["roundsWon"] + match.stats[0].awayScore;
            isHomeTeam ? acc[map]["roundsLost"] = acc[map]["roundsLost"] + match.stats[0].awayScore : acc[map]["roundsLost"] = acc[map]["roundsLost"] + match.stats[0].homeScore;
        }
		return acc;
	}, {} as any);

    const totalRoundsWon = Object.values(mapRecords).reduce((sum, record) => sum + record.roundsWon, 0);
    const totalRoundsLost = Object.values(mapRecords).reduce((sum, record) => sum + record.roundsLost, 0);


    return (
        <>
        <div className='text-center text-sm'>Total RWP {totalRoundsWon}:{totalRoundsLost} ({calcPercentage(totalRoundsWon, totalRoundsLost+totalRoundsWon)}%)</div>
        <div className='grid grid-cols-4 md:grid-cols-7'>
            {
                Object.values(mapRecords).map( ( record ) => 
                    <div key={`record ${record.name}`} className=''>
                        <div className='text-sm'><img className='w-16 h-16 mx-auto' src={mapImages[record.name]} alt=""/></div>
                        <div className='text-center'>
                            <span className='text-green-400'>{record.wins}</span>
                            :
                            <span className='text-red-400'>{record.loss}</span>
                            <span className='text-gray-500 md:mx-2 hidden'>
                                ({calcPercentage(record.wins, record.wins+record.loss)}%)
                            </span>
                            <div className='text-slate-500 text-xs'>
                                RWP {record.roundsWon}:{record.roundsLost} ({calcPercentage(record.roundsWon, record.roundsLost+record.roundsWon)}%)
                            </div>          
                        </div>
                    </div>
                )
            }
        </div>
        </>
    );
}