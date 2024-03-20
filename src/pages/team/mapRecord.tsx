import * as React from 'react';
import { Match } from '../../models/matches-types';
import { Team } from '../../models/franchise-types';
import { mapImages } from "../../common/images/maps";
import { calculateTeamRecord } from '../../common/utils/match-utils';

type Props = {
    matches: Match[];
    team?: Team;
}

type TeamRecord = { record: { wins: number, losses: number, roundsWon: number, roundsLost: number }, maps: { name: string, wins: number, loss: number, roundsWon: number, roundsLost: number }[] };


const calcPercentage = ( value: number, total: number) => ((value/total)*100).toFixed(0);

export function MapRecord( { matches, team }: Props) {

	const teamRecord: TeamRecord = calculateTeamRecord( team, matches );

    if( teamRecord.record === undefined ) {
        return null;
    }

    return (
        <div className='p-2'>
            <div className='text-center text-sm'>Total RWP {teamRecord.record.roundsWon}:{teamRecord.record.roundsLost} ({calcPercentage(teamRecord.record.roundsWon, teamRecord.record.roundsWon+teamRecord.record.roundsLost)}%)</div>
            <div className='grid grid-cols-4 md:grid-cols-7'>
                {
                    Object.values(teamRecord.maps).map( ( record ) => 
                        <div key={`record ${record.name}`} className=''>
                            <div className='text-sm text-center'><img className='w-16 h-16 mx-auto' src={mapImages[record.name]} alt="FFW"/></div>
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
        </div>
    );
}