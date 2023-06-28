import * as React from 'react';
import { useDataContext } from '../DataContext';
import { Container } from '../common/components/container';
import { useFetchMatchesGraph } from '../dao/matchesGraphQLDao';
import { sortBy } from 'lodash';

export function TeamStandings() {
    const { franchises } = useDataContext();

    const teamsInTiers = franchises.reduce( ( acc, franchise) => {
        franchise.teams.forEach( team => {
            if( !acc[team.tier.name] ) acc[team.tier.name] = [];
            acc[team.tier.name].push(team);
        });
        return acc; 
    }, {} as any);


    const tendy = sortBy(teamsInTiers['Contender'], 'id');

    tendy.reduce( async ( acc, team ) => {
        // eslint-disable-next-line  
        const { data: matches = [] } = await useFetchMatchesGraph(team?.id);
        acc[team.name] = { ...team, matches };
        return acc;
    }, {} as any)

    console.info( tendy );
    

    return ( 
        <Container>
            <h1>Team Standings</h1>
        </Container>
    );
}