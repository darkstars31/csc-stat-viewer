import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import { useFetchMultipleTeamsMatchesGraph } from '../dao/matchesGraphQLDao';
import { sortBy } from 'lodash';
import { Loading } from '../common/components/loading';
import { franchiseImages } from '../common/images/franchise';

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
    const response = useFetchMultipleTeamsMatchesGraph(selectedTier, sortedTeamsInTier);

    if ( response.some ( x => x.isLoading ) ) return <Container><Loading /></Container>;
    const teamsWithMatches = sortedTeamsInTier.map( (team, index) => { return { ...team, matches: response[index] } } );

    const x = teamsWithMatches.map( (team, index) => {
        const teamMatches = response[index].data as [];
        const teamRecord = teamMatches.reduce((teamRecord: number[], match: { stats: string | any[]; home: { name: any; }; }) => {
            if( match.stats.length > 0){
                const isHomeTeam = match.home.name === team?.name;
                if( match.stats.length > 0) {
                    const didCurrentTeamWin = ( isHomeTeam && match.stats[0].homeScore > match.stats[0].awayScore ) || ( !isHomeTeam && match.stats[0].homeScore < match.stats[0].awayScore);
                    didCurrentTeamWin ? teamRecord[0] = teamRecord[0] + 1 : teamRecord[1] = teamRecord[1] + 1;
                }
            }
            return teamRecord;
        }, [0,0]);

        return { ...team, matches: response[index], teamRecord };
    });

    const sortedTeamRecords = sortBy(x, 'teamRecord').reverse();
    console.info(sortedTeamRecords)

    return ( 
        <Container>
        <div className='my-4 p-2 max-w-7xl bg-teal-500 rounded'>This feature is a work in progress.</div>
        <h1>Team Standings</h1>
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
            <div>
            <div className='text-center m-4 text-2xl'>{selectedTier}</div>
            <div className='grid grid-cols-5 gap-2 m-4'>
                    <div></div>
                    <div>Wins</div>
                    <div>Losses</div>
            </div>
            { sortedTeamRecords.map( (team) => 
                <div className='grid grid-cols-5 gap-2 m-4'>
                    <div><img className='w-8 h-8 mr-2 float-left' src={franchiseImages[team.franchise.prefix]} alt="" /> {team.name} ({team.franchise.prefix})</div>
                    <div>{team.teamRecord[0]}</div>
                    <div>{team.teamRecord[1]}</div>
                </div>
            ) }
            </div>
        </Container>
    );
}