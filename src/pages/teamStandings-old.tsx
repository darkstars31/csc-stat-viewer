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
import { Team } from '../models/franchise-types';

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
            <div>
                <b>
                    <span className='text-green-400'>{team.teamRecord.record.wins}</span> : <span className='text-red-400'>{team.teamRecord.record.losses}</span>
                </b> 
                <span className='text-gray-400 text-xs pl-2'>
                    ({(team.teamRecord.record.wins / (team.teamRecord.record.wins + team.teamRecord.record.losses)*100).toFixed(2)}%)
                </span>
                <div className='text-gray-400 text-xs pl-2'>
                    (Conf. {team.teamRecord.record.conferenceWins}:{team.teamRecord.record.conferenceLosses})
                </div>
            </div>
            <div><span className='text-green-400'>{team.teamRecord.record.roundsWon}</span> : <span className='text-red-400'>{team.teamRecord.record.roundsLost}</span> <span className='text-gray-400 text-xs'>(diff {team.teamRecord.record.roundsWon - team.teamRecord.record.roundsLost > 0 ? '+': ''}{team.teamRecord.record.roundsWon - team.teamRecord.record.roundsLost}</span> <span className='text-gray-400 text-xs'>{(team.teamRecord.record.roundsWon / (team.teamRecord.record.roundsWon + team.teamRecord.record.roundsLost)*100).toFixed(1)}%)</span></div>
            {/* <div><span className='text-green-400'>{team.teamRecord.record.conferenceWins}</span> : <span className='text-red-400'>{team.teamRecord.record.conferenceLosses}</span></div> */}
        </div>
    );
}

export function TeamStandings_old() {
    const { franchises, dataConfig } = useDataContext();
    const [ selectedTier, setSelectedTier ] = React.useState('');
    const [ showConferences, setShowConferences ] = React.useState(false);
    const { data: season = [] } = useCscSeasonDivisionsByTier(dataConfig?.season);
    const divisions = season.find(s => s.tier.name === selectedTier)?.divisions;
    const teamsInDivision = divisions?.reduce( (acc, division) => {
        acc[division.name] = division.teams.map( team => team.team.name ) ;
        return acc;
    }, {} as Record<string, string[]>);
    
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
        const conferenceName = Object.keys(teamsInDivision ?? {}).find( key => teamsInDivision![key].includes( team.name ) );
        const conferenceTeams = teamsInDivision![conferenceName ?? ''];
        const teamMatches = responses[index].data as [];
        const teamRecord = calculateTeamRecord( team, teamMatches, conferenceTeams );

        return { ...team, matches: responses[index], teamRecord, conferenceName };
    });

    // TODO: Custom sort algorithm that accounts for tie-breakers
    const tieBreakers: string[] = [];
    const sortedTeamRecordsByTier = sortBy(teamsWithMatchesCalculatedWinLoss, "teamRecord.record.wins");

    const sortedTeamRecords = sortedTeamRecordsByTier.sort( ( a, b ) => {
        const isSameConference = a.conferenceName === b.conferenceName;
        const isRecordSame = a.teamRecord?.record.wins === b.teamRecord?.record.wins;
        const isConferenceRecordSame = a.teamRecord?.record.conferenceWins === b.teamRecord?.record.conferenceWins;

        // if( a.name.includes('Neon') && b.name.includes('Holy') || a.name.includes('Holy') && b.name.includes('Neon')) {
        //     console.info( a, b,'isRecordSame', isRecordSame, 'isConferenceRecordSame', isConferenceRecordSame);
        // }

        if( isSameConference && isRecordSame ) {
            if( isConferenceRecordSame ) {
                const teamAHasDefeatedTeamB = a.teamRecord?.record.teamsDefeated?.includes( b.name );
                //console.info( a.name, teamAHasDefeatedTeamB ? 'beats' : 'lost', b.name ); 
                return teamAHasDefeatedTeamB ? -1 : 1;
            } else {
                return b.teamRecord?.record.conferenceWins - a.teamRecord?.record.conferenceWins;
            }
        }
        
        return b.teamRecord?.record.wins - a.teamRecord?.record.wins;
        
    });

    const sortedTeamRecordsInConferences = showConferences ? sortedTeamRecords.reduce( ( acc, team ) => {
        if ( !acc[team.conferenceName]) acc[team.conferenceName] = [];
        acc[team.conferenceName].push(team);
        return acc;
        
    }, {} as any) 
    : 
    // eslint-disable-next-line no-useless-computed-key
    { ['']: sortedTeamRecords };

    const tierButtonClass = "rounded-md flex-grow px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring-0 active:bg-blue-300";

    const tiers = [
        { name: "Recruit", color: 'red'},
        { name: "Prospect", color: 'orange'},
        { name: "Contender", color: 'yellow'},
        { name: "Challenger", color: 'green'},
        { name: "Elite", color: 'blue'},
        { name: "Premier", color: 'purple'},
    ];

    return ( 
        <Container>
            <div>
                <div>
                <h1 className='text-2xl text-center my-4'>Team Standings</h1>    
                <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                    <input
                        className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value=""
                        onChange={ () => setShowConferences(!showConferences) }
                        id="checkboxChecked"
                        checked={ showConferences } />
                    <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="checkboxChecked">
                        Show Conferences
                    </label>
                    </div>
                    <div
                        className="justify-center flex flex-wrap rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out bg-blue-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        role="group">
                        {
                            tiers.map( tier => 
                                <button key={tier.name} 
                                    type="button" 
                                    onClick={() => setSelectedTier(tier.name)} 
                                    className={`${selectedTier === tier.name ? 'bg-blue-500' : 'bg-blue-700'} text-${tier.color}-400 ${tierButtonClass}`}
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
                        Object.entries(sortedTeamRecordsInConferences).map( ([key, value], index) => {
                            return (
                                <Card key={key}>
                                    { key && <div className='text-l'>
                                        <i>{key} Conference</i>
                                    </div>
                                    }
                                    <div className='grid grid-cols-3 gap-2 mx-4 text-sm'>
                                        <div></div>
                                        <div>W : L</div>
                                        <div>Rounds</div>                                       
                                    </div>
                                    <div>
                                        {(value as Team[]).map( (team, index) => 
                                            <>
                                                <TeamRecordRow key={`${index}-${team.name}`} team={team} index={index} />
                                                { key &&
                                                    Math.ceil(( value as []).length / 2 ) === index+1 && 
                                                    <span className='text-gray-600 text-xs'><i>Playoff Line</i><div className='-mt-[.8em] ml-20 border-dotted border-b border-gray-500' /></span>
                                                }
                                            </>
                                        )}
                                    </div>                               
                                </Card>
                            )
                            }
                        )                       
                    }                   
                    { tieBreakers.length > 0 && <div className='m-4'>
                        <li>
                            {tieBreakers.length > 0 &&
                                tieBreakers.map( (tieBreaker, index) =>
                                    <ul>{tieBreaker}</ul> )
                            }
                        </li>
                    </div> }           
                    { selectedTier && <div className='text-center text-xs m-4 text-slate-400'>
                        * Tie-Breakers partially-implemented: Conference Record, Head-to-Head <br />
                        * Unofficial Standings, could contain inaccuracies. <br />
                        * Playoff line is estimated and not guaranteed. <br />
                        * Bo1 Play-Ins not currently shown.
                        </div>}    
                    { !selectedTier && <div className='text-center text-xl m-4'>Select a tier to get started.</div>}                    
                </div>       
            </div>
        </Container>
    );
}