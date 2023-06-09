import * as React from 'react';
import { Match } from '../../models/matches-types';
import { Team } from '../../models/franchise-types';
import { mapImages } from './matches';

type Props = {
    matches: Match[];
    team?: Team;
}

export function MapRecord( { matches, team }: Props) {

	const mapRecords: { name: string, wins: number, loss: number}[] = matches.reduce((acc, match) => {
		if( match.stats.length > 0 ) {
			const map = match.stats[0].mapName;
			if( !acc[map] ) acc[map] = { name: map, wins: 0, loss: 0 };
			match.stats[0].winner.name === team?.name ? acc[map]["wins"] = acc[map]["wins"]+1 : acc[map]["loss"] = acc[map]["loss"]+1;
		}
		return acc;
	}, {} as any);
	console.info('mapRecord', mapRecords);

    return (
        <div className='grid grid-cols-7'>
            {
                Object.values(mapRecords).map( ( record ) => 
                    <div key={`record ${record.name}`} className=''>
                        <div className='text-sm'><img className='w-16 h-16 mx-auto' src={mapImages[record.name]} alt=""/></div>
                        <div className='text-center'>
                            <span className='text-green-400'>{record.wins}</span>
                            :
                            <span className='text-red-400'>{record.loss}</span> <br />
                            <span className='text-gray-500'>
                            ({((record.wins/(record.loss+record.wins))*100).toFixed(0)}%)
                            </span>               
                            </div>
                    </div>
                )
            }
        </div>
    );
}