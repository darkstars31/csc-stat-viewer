import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import { useFetchMultipleTeamsMatchesGraph } from '../dao/cscMatchesGraphQLDao';
import { sortBy } from 'lodash';
import { Loading } from '../common/components/loading';
import { franchiseImages } from '../common/images/franchise';
import { calculateTeamRecord } from '../common/utils/match-utils';

export function TeamStandings() {
    const { franchises } = useDataContext();
    const [ selectedTier, setSelectedTier ] = React.useState('');

    const teamsInTiers = franchises.reduce( ( acc, franchise) => {
        franchise.teams.forEach( team => {
            if( !acc[team.tier.name] ) acc[team.tier.name] = [];
            acc[team.tier.name].push( { ...team, franchise: { name: franchise.name, prefix: franchise.prefix } } );
        });
        return acc; 
    }, {} as any);

    const sortedTeamsInTier = sortBy(teamsInTiers[selectedTier], 'id');
    const responses = useFetchMultipleTeamsMatchesGraph(selectedTier, sortedTeamsInTier);

    if ( responses.some( response => response.isLoading ) ) return <Container><Loading /></Container>;
    const teamsWithMatches = sortedTeamsInTier.map( (team, index) => { return { ...team, matches: responses[index] } } );

    const teamsWithMatchesCalculatedWinLoss = teamsWithMatches.map( (team, index) => {
        const teamMatches = responses[index].data as [];
        const teamRecord = calculateTeamRecord( team, teamMatches );

        return { ...team, matches: responses[index], teamRecord };
    });

    const sortedTeamRecords = sortBy(teamsWithMatchesCalculatedWinLoss, 'teamRecord.record.wins').reverse();

    return ( 
        <Container>
            <div>
            <h1 className='text-2xl text-center'>Team Standings</h1>
            <div>Click a tier to see the standings.</div>        
                <div
                    className="inline-flex rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    role="group">
                    <button
                        type="button"
                        onClick={() => setSelectedTier('Recruit')}
                        className="inline-block rounded-l bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        Recruit
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTier('Prospect')}
                        className="inline-block bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        Prospect
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTier('Contender')}
                        className="inline-block rounded-r bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        Contender
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTier('Challenger')}
                        className="inline-block rounded-r bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        Challenger
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTier('Elite')}
                        className="inline-block rounded-r bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        Elite
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTier('Premier')}
                        className="inline-block rounded-r bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 active:bg-primary-700"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        Premier
                    </button>
                </div>
            </div>
            <div>
            <div className='text-center m-4 text-2xl'>{selectedTier}</div>
            <div className='grid grid-cols-5 gap-2 m-4'>
                    <div></div>
                    <div>Wins : Loss</div>
                    <div>Win %</div>
                    <div>Rounds Won:Lost</div>
                    <div>Round Win %</div>
            </div>
            { sortedTeamRecords.map( (team, index) => 
                <div key={`${team.name}${index}`} className='grid grid-cols-5 gap-2 m-4'>
                    <div><img className='w-8 h-8 mr-2 float-left' src={franchiseImages[team.franchise.prefix]} alt="" /> {team.name} ({team.franchise.prefix})</div>
                    <div><b><span className='text-green-400'>{team.teamRecord.record.wins}</span> : <span className='text-red-400'>{team.teamRecord.record.losses}</span></b></div>
                    <div>{(team.teamRecord.record.wins / (team.teamRecord.record.wins + team.teamRecord.record.losses)*100).toFixed(2)}%</div>
                    <div><span className='text-green-400'>{team.teamRecord.record.roundsWon}</span> : <span className='text-red-400'>{team.teamRecord.record.roundsLost}</span> <span className='text-gray-400 text-xs'>(diff {team.teamRecord.record.roundsWon - team.teamRecord.record.roundsLost > 0 ? '+': ''}{team.teamRecord.record.roundsWon - team.teamRecord.record.roundsLost})</span></div>
                    <div>{(team.teamRecord.record.roundsWon / (team.teamRecord.record.roundsWon + team.teamRecord.record.roundsLost)*100).toFixed(2)}%</div>
                </div>
            ) }
            </div>
        </Container>
    );
}