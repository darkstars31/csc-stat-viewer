import React from "react";
import { useDataContext } from "../DataContext";
import { useCscSeasonMatches } from "../dao/cscSeasonMatches";
import { Container } from "../common/components/container";
import { Card } from "../common/components/card";
import { Loading } from "../common/components/loading";
import { Link } from "wouter";
import { franchiseImages } from "../common/images/franchise";
import { sortBy } from 'lodash';
import { Franchise } from "../models/franchise-types";

type ProcessedTeamStandings = {
     franchise?: Franchise, 
     name: string, 
     wins: number, 
     losses: number, 
     roundsWon: number, 
     roundsLost: number, 
     ctRoundsWon: number, 
     tRoundsWon: number, 
     ctTotalRounds: number, 
     tTotalRounds: number, 
     pistolRoundsWon: number, 
     pistolTotalRounds: number 
}


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
                    <span className='text-green-400'>{team.wins}</span> : <span className='text-red-400'>{team.losses}</span>
                </b> 
                <span className='text-gray-400 text-xs pl-2'>
                    ({(team.wins / (team.wins + team.losses)*100).toFixed(2)}%)
                </span>
            </div>
            <div><span className='text-green-400'>{team.roundsWon}</span> : <span className='text-red-400'>{team.roundsLost}</span> <span className='text-gray-400 text-xs'>(diff {team.roundsWon - team.roundsLost > 0 ? '+': ''}{team.roundsWon - team.roundsLost}</span> <span className='text-gray-400 text-xs'>{(team.roundsWon / (team.roundsWon + team.roundsLost)*100).toFixed(1)}%)</span></div>
            {/* <div><span className='text-green-400'>{team.teamRecord.record.conferenceWins}</span> : <span className='text-red-400'>{team.teamRecord.record.conferenceLosses}</span></div> */}
        </div>
    );
}

export function TeamStandings() {
    const { franchises, dataConfig } = useDataContext();
    const [ selectedTier, setSelectedTier ] = React.useState('Contender');
    const { data: matches = [], isLoading } = useCscSeasonMatches(selectedTier, dataConfig?.season);

    const teamsWithScores = matches.reduce( ( acc, match ) => {
       match.teamStats.forEach( team => {
            if( !acc[team.name] ) {
                const franchise = franchises.find( f => f.teams.find( t => t.name === team.name));
                console.info( franchise );
                acc[team.name] = { franchise: franchise, name: team.name, wins: 0, losses: 0, roundsWon: 0, roundsLost: 0, ctRoundsWon: 0, tRoundsWon: 0, ctTotalRounds: 0, tTotalRounds: 0, pistolRoundsWon: 0, pistolTotalRounds: 0 };
            }

            if( team.score > match.totalRounds/2 ){
                acc[team.name].wins += 1;
            } else {
                acc[team.name].losses += 1;
            }

            acc[team.name].roundsWon += team.score;
            acc[team.name].roundsLost += match.totalRounds - team.score;
            acc[team.name].ctRoundsWon += team.ctRW;
            acc[team.name].tRoundsWon += team.TRW;
            acc[team.name].ctTotalRounds += team.ctR;
            acc[team.name].tTotalRounds += team.TR
            acc[team.name].pistolRoundsWon += team.pistolsW
            acc[team.name].pistolTotalRounds += team.pistols
       });
       

       return acc;

    }, {} as Record<string,ProcessedTeamStandings>);

    const sorted = sortBy(Object.values(teamsWithScores), "wins").reverse(); //.sort( (a,b) => (a as any).wins - (b as any).wins);
    // const sortedX = sorted.sort( (a,b) => {

    //     if( a.wins === b.wins ){
    //        const match = matches.find( m => m.teamStats.find( t => t.name === a.name ));
           
    //     }
    //     return 0;
    // })

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
                <h1 className='text-2xl text-center my-4'>Team Standings (Beta Feature)</h1>    
                <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                   
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
                    { isLoading ? 
                        <Loading /> 
                        :
                            <Card>                                
                                <div className='grid grid-cols-3 gap-2 mx-4 text-sm'>
                                    <div></div>
                                    <div>W : L</div>
                                    <div>Rounds</div>                                       
                                </div>
                                <div>
                                    { sorted.map( (team: any, index: number) => 
                                        <>
                                            <TeamRecordRow key={`${index}`} team={team} index={index} />
                                            { 
                                                Math.ceil(( sorted as []).length / 2 ) === index+1 && 
                                                <span className='text-gray-600 text-xs'><i>Playoff Line</i><div className='-mt-[.8em] ml-20 border-dotted border-b border-gray-500' /></span>
                                            }
                                        </>
                                    )}
                                </div>                               
                            </Card>                                            
                    }                   
                    {/* { tieBreakers.length > 0 && <div className='m-4'>
                        <li>
                            {tieBreakers.length > 0 &&
                                tieBreakers.map( (tieBreaker, index) =>
                                    <ul>{tieBreaker}</ul> )
                            }
                        </li>
                    </div> }            */}
                    { selectedTier && false && 
                        <div className='text-center text-xs m-4 text-slate-400'>
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