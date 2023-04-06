import { Link } from 'wouter';
import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from '../DataContext';
import { Loading } from '../common/components/loading';
import { Player } from '../models';
import { tiers, roleColors } from '../common/utils/player-utils';

export function Teams() {
    const { playerStats, isLoading } = useDataContext();
    const playerData = playerStats;
    const teams = playerData.filter( p => !["DE","FA","PFA","-"].includes(p.Team))
        .reduce<Player[]>( (uniqueTeams, team) => {
       if( !uniqueTeams.some( i => i.Tier === team.Tier && i.Team === team.Team) ){
        uniqueTeams.push(team);
       }
       return uniqueTeams;
    }, [])
    .filter( team => Boolean(team.Team) )
    .map( team => ({ Tier: team.Tier, Team: team.Team}));
    
    const teamsByTier = {
        premierTeams: teams.filter( team => team.Tier.includes("Premier")),
        eliteTeams: teams.filter( team => team.Tier.includes("Elite")),
        challengerTeams: teams.filter( team => team.Tier.includes("Challenger")),
        ContenderTeams: teams.filter( team => team.Tier.includes("Contender")),
        prospectTeams: teams.filter( team => team.Tier.includes("Prospect")),
    };
    
    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Teams</h2>
                <p className="mt-4 text-gray-300">
                    Current Teams and players on those teams + roles. Please note that some teams show up in multiple tiers because those Teams have players in both tiers during combines.
                </p>
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            { isLoading && <Loading /> }
            { Object.values(teamsByTier).map( (teams, index) =>
                    <div>
                        { teams.length > 0 &&
                        <div key={`tier-${tiers[index]}`} className="pt-12">
                            <div className="mx-auto max-w-lg text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl">{tiers[index]} <span className="text-gray-500">({teams.length})</span></h2>
                            </div>
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                { teams.map( team => 
                                        <div className="block rounded-xl border border-gray-800 p-6 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
                                            <Link key={`team-${index}-${team.Team}`}
                                                to={`/team/${team.Team}`}
                                            >
                                                <h2 className="mt-2 text-xl font-bold text-white text-center">{team.Team}</h2>
                                            </Link>
                                            <h4 className="mt-1 text-s font-bold text-gray-500 text-center">({(playerData.filter( p => p.Team === team.Team && p.Tier === tiers[index]).map( p => p.Rating).reduce((cum,cur) => cum + cur)/playerData.filter( p => p.Team === team.Team && p.Tier === tiers[index]).length).toFixed(2)})</h4>
                                            <div className="mt-1 text-sm text-gray-300 grid grid-cols-1 gap-1">
                                                {   playerData.filter( p => p.Team === team.Team && p.Tier === tiers[index]).map( p => 
                                                    <Link className="grid grid-cols-3 gap-1" key={`${tiers[index]}-${team.Team}-${p.Name}`}
                                                    to={`/players/${p.Tier}/${p.Name}`}
                                                    >
                                                        <div>{p.Name}</div>
                                                        <div className={`text-${roleColors[p.ppR as keyof typeof roleColors]}-400`}>{p.ppR}</div>
                                                        <div>{p.Rating}</div>
                                                    </Link>
                                                )}
                                            </div>
                                        
                                        </div> 
                                    )                              
                                }
                            </div>
                        </div>
                    }
                    </div>
            ) }
        </Container>
    );
}