import { PlayerStats } from "../../models";
import { ContractsQuery, Franchise, Player as PlayerContract, Team } from "../../models/contract-types";

export const findPlayerMMR = ( player: PlayerStats, contracts?: ContractsQuery ) => {
    if( player.Tier.includes("FA")){
        return contracts?.data.fas.find( (fa: { name: string, mmr: number}) => fa.name === player.Name)?.mmr;
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const franchise: Franchise | undefined = contracts?.data.franchises.find( franchise => franchise.teams.find( team => team.players.find( p => p.name === player.Name)));
        const team: Team | undefined = franchise?.teams.find( team => team.players.find( p => p.name === player.Name));
        const play: PlayerContract | undefined = team?.players.find( p => p.name === player.Name);
        return play?.mmr;
    }
}