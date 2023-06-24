import * as React from 'react';
import { useDataContext } from '../../DataContext';
import { Player } from '../../models/player';
import { Team } from '../../models/franchise-types';
import { COLUMNS } from '../franchise';

export function TeamFooterTabulation( { team }: { team: Team }) {
    const { players = [] } = useDataContext();
    const mmrTeamTotal = team.players.reduce((sum, next) => sum+next.mmr, 0);
    const tierMmrCap = team.tier.mmrCap;
    const playersOnTeam = team.players.reduce( (accumlator: Player[], player) => {
        // OLD const p = players.find( p => player.name === p.name && p.tier.name === team.tier.name && p.stats?.Tier === team.tier.name && p.stats);
        const p = players.find( p => player.name === p.name && p.tier.name === team.tier.name && p.tier.name === team.tier.name && p.stats);

        if( p ) {
            accumlator.push( p );
        }
        return accumlator;
    }, [] );

    return (
        <div className={`grid grid-cols-${COLUMNS} text-xs`}>
            <div></div>
            <div>{mmrTeamTotal}/{tierMmrCap} Cap - {((mmrTeamTotal/tierMmrCap)*100).toFixed(0)}%</div>
            {/* //OLD { playersOnTeam.length > 0 && <div>{(playersOnTeam.reduce((sum, next) => sum+(next?.stats?.Rating ?? 0), 0)/playersOnTeam.length).toFixed(2)} Avg Rating</div> } */}
            { playersOnTeam.length > 0 && <div>{(playersOnTeam.reduce((sum, next) => sum+(next?.stats?.Rating ?? 0), 0)/playersOnTeam.length).toFixed(2)} Avg Rating</div> }

        </div>
    );
}