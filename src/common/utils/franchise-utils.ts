import { Franchise } from "../../models/franchise-types";
import { Player } from "../../models/player";

export const getFranchiseByPlayer = ( currentPlayer?: Player, franchises?: Franchise[]) => franchises?.find( f => f.name === currentPlayer?.team?.franchise.name);

export const getTeamByPlayer = ( currentPlayer?: Player, franchises?: Franchise[]) => getFranchiseByPlayer(currentPlayer, franchises)?.teams.find( t => t.name === currentPlayer?.team?.name);

export const getTeammates = (currentPlayer?: Player, players?: Player[], franchises?: Franchise[]) => players?.filter( p => { 
    return p.team?.name === currentPlayer?.team?.name && p.tier.name === getTeamByPlayer(currentPlayer, franchises)?.tier.name && p.name !== currentPlayer?.name;
}) ?? [];