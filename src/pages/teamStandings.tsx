import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import { useFetchMultipleTeamsMatchesGraph } from '../dao/cscMatchesGraphQLDao';
import { sortBy } from 'lodash';
import { Loading } from '../common/components/loading';
import { franchiseImages } from '../common/images/franchise';
import { calculateTeamRecord } from '../common/utils/match-utils';
import { useCscSeasonDivisionsByTier } from '../dao/cscSeasonDivisionsByTierDao';
import { Card } from '../common/components/card';
import { Link } from 'wouter';


function TeamRecordRow ({ team, index }: { team: any, index: number }) {
    return (
        <div key={`${team.name}${index}`} className='grid grid-cols-3 gap-2 m-4'>
            <div><Link 
                to={`/franchises/${team.franchise.name}/${team.name}`} 
                className='hover:cursor-pointer hover:text-sky-400 transition ease-in-out hover:-translate-x-1 duration-300'>
                    <img className='w-8 h-8 mr-2 float-left' src={franchiseImages[team.franchise.prefix]} alt="" /> 
                    {team.name} ({team.franchise.prefix})
                </Link>
            </div>
            <div><b><span className='text-green-400'>{team.teamRecord.record.wins}</span> : <span className='text-red-400'>{team.teamRecord.record.losses}</span></b> <span className='text-gray-400 text-xs pl-2'>({(team.teamRecord.record.wins / (team.teamRecord.record.wins + team.teamRecord.record.losses)*100).toFixed(2)}%)</span></div>
            <div><span className='text-green-400'>{team.teamRecord.record.roundsWon}</span> : <span className='text-red-400'>{team.teamRecord.record.roundsLost}</span> <span className='text-gray-400 text-xs'>(diff {team.teamRecord.record.roundsWon - team.teamRecord.record.roundsLost > 0 ? '+': ''}{team.teamRecord.record.roundsWon - team.teamRecord.record.roundsLost}</span> <span className='text-gray-400 text-xs'>{(team.teamRecord.record.roundsWon / (team.teamRecord.record.roundsWon + team.teamRecord.record.roundsLost)*100).toFixed(1)}%)</span></div>
        </div>
    );
}

export function TeamStandings() {
    const { franchises } = useDataContext();
    const [ selectedTier, setSelectedTier ] = React.useState('');
    const { data: season = [] } = useCscSeasonDivisionsByTier(11);
    const divisions = season.find(s => s.tier.name === selectedTier)?.divisions;
    const teamsInDivision = divisions?.reduce( (acc, division) => {
        acc[division.name] = division.teams.map( team => team.team.name ) ;
        return acc;
    }, {} as any);
    
    const teamsInTiers = franchises.reduce( ( acc, franchise) => {
        franchise.teams.forEach( team => {
            if( !acc[team.tier.name] ) acc[team.tier.name] = [];
            acc[team.tier.name].push( { ...team, franchise: { name: franchise.name, prefix: franchise.prefix } } );
        });
        return acc; 
    }, {} as any);

    const sortedTeamsInTier = sortBy(teamsInTiers[selectedTier], 'id');
    const responses = useFetchMultipleTeamsMatchesGraph(selectedTier, sortedTeamsInTier);

    if ( responses.some( response => response.isError ) ) {
        // TODO: Make better error message, suggest using different portion of app
        return ( <Container>
                <div className='my-4 text-center text-l'>
                    An error occured loading data from the server for franchise standings. Please try again later.
                </div>          
            </Container>
            );
    }

    const teamsWithMatches = sortedTeamsInTier.map( (team, index) => { return { ...team, matches: responses[index] } } );

    const teamsWithMatchesCalculatedWinLoss = teamsWithMatches.map( (team, index) => {
        const conferenceName = Object.keys(teamsInDivision)?.find( key => teamsInDivision[key].includes( team.name ) );
        const teamMatches = responses[index].data as [];
        const teamRecord = calculateTeamRecord( team, teamMatches );

        return { ...team, matches: responses[index], teamRecord, conferenceName };
    });

    const sortedTeamRecords = sortBy(teamsWithMatchesCalculatedWinLoss, 'teamRecord.record.wins').reverse();

    const sortedTeamRecordsInConferences = sortedTeamRecords.reduce( (acc, team ) => {
        if ( !acc[team.conferenceName]) acc[team.conferenceName] = [];
        acc[team.conferenceName].push(team);
        return acc;
    }, {} as any);

    const tierButtonClass = "rounded-md flex-grow px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring-0 active:bg-blue-300";

    const tiers = [
        { name: "Recruit"},
        { name: "Prospect"},
        { name: "Contender"},
        { name: "Challenger"},
        { name: "Elite"},
        { name: "Premier"},
    ];

    return ( 
        <Container>
            <div>
                <div>
                <h1 className='text-2xl text-center'>Team Standings</h1>    
                    <div
                        className="justify-center flex flex-wrap rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out bg-blue-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        role="group">
                        {
                            tiers.map( tier => 
                                <button key={tier.name} 
                                    type="button" 
                                    onClick={() => setSelectedTier(tier.name)} 
                                    className={`${selectedTier === tier.name ? 'bg-blue-500' : 'bg-blue-700'} ${tierButtonClass}`}
                                >
                                    {tier.name}
                                </button>                     
                            )
                        }                    
                    </div>
                </div>
                <div className='pt-2'>
                    { responses.some( response => response.isLoading ) ? 
                        <Loading /> 
                        :
                        Object.entries(sortedTeamRecordsInConferences).map( ([key, value]) => {
                            return (
                                <Card>
                                    <div className='text-2xl'>
                                        <i>{key}</i>
                                    </div>
                                    <div className='grid grid-cols-3 gap-2 m-4'>
                                        <div></div>
                                        <div>W : L</div>
                                        <div>Rounds</div>
                                    </div>
                                    <div>
                                        {(value as []).map( (team, index) => <TeamRecordRow key={`${index}`} team={team} index={index} />)}
                                    </div>
                                </Card>
                            )
                            } )     
                    }
                    { !selectedTier && <div className='text-center text-xl m-4'>Select a tier to get started.</div>}                    
                </div>       
            </div>
        </Container>
    );
}