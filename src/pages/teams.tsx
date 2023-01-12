import { Link } from 'wouter';
import * as React from "react";
import { Container } from "../common/components/container";
import { useDataContext } from '../DataContext';
import { Loading } from '../common/components/loading';

export function Teams() {
    const { season10CombinePlayers, isLoading } = useDataContext();
    const playerData = season10CombinePlayers;
    const teams = playerData.filter( p => !["DE","FA","PFA"].includes(p.Team))
        .filter( ( p, index, self) => 
            index === self.findIndex( t => t.Tier === p.Tier && t.Team === p.Team))
        .map( p => ({ Team: p.Team, Tier: String(p.Tier) } ) );
    
    const teamsByTier = {
        premierTeams: teams.filter( team => team.Tier.includes("Premier")),
        eliteTeams: teams.filter( team => team.Tier.includes("Elite")),
        challengerTeams: teams.filter( team => team.Tier.includes("Challenger")),
        ContenderTeams: teams.filter( team => team.Tier.includes("Contender")),
        prospectTeams: teams.filter( team => team.Tier.includes("Prospects")),
    }

    const tiers = ["Premier", "Elite", "Challenger", "Contender", "Prospects"];

    return (
        <Container>
            <div className="mx-auto max-w-lg text-center">
                <h2 className="text-3xl font-bold sm:text-4xl">Teams</h2>
                <p className="mt-4 text-gray-300">
                    blah blah place holder blah blah
                </p>
            </div>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-800" />
            { isLoading && <Loading /> }
            { Object.values(teamsByTier).map( (teams, index) =>
                        <div className="pt-8">
                            <div className="mx-auto max-w-lg text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl">{tiers[index]} <span className="text-gray-500">({teams.length})</span></h2>
                            </div>
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                { teams.map( team => 
                                        <Link
                                            key={`team-${index}-${team.Team}`}
                                            to={`/team/${team.Team}`}
                                            className="block rounded-xl border border-gray-800 p-6 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                                            >
                                            <h2 className="mt-2 text-xl font-bold text-white text-center">{team.Team} ({(playerData.filter( p => p.Team === team.Team).map( p => p.Rating).reduce((cum,cur) => Number(cum) + Number(cur))/playerData.filter( p => p.Team === team.Team).length).toFixed(2)})</h2>
                                            <div className="mt-1 text-sm text-gray-300 grid grid-cols-1 gap-1">
                                                {   playerData.filter( p => p.Team === team.Team).map( p => 
                                                        <div>{p.Name} - {p.ppR}</div>
                                                )}
                                            </div>
                                        </Link> 
                                    )
                                }
                            </div>
                        </div>
            ) }
        </Container>
    );
}