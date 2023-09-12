import * as React from "react";
import { useAnalytikillIndividualMatchHistory, useAnalytikillPlayerMatchHistory } from "../../dao/analytikill";
import { Player } from "../../models";
import { Loading } from "../../common/components/loading";
import { mapImages } from "../../common/images/maps";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { MatchHistoryPlayerStat } from "../../models/match-history-types";

type Props = {
    player: Player;
}

function MatchHistory( { match }: { match: MatchHistoryPlayerStat } ) {
    const { data: matchHistory, isLoading } = useAnalytikillIndividualMatchHistory( match.csc_match_id );

    if( isLoading ) {
        return <div><Loading /></div>;
    }

    const teamHome = matchHistory?.Match_Player_Stat.filter( p => p.Team === "team_home" ).sort( (a, b) => b.Rating - a.Rating );
    const teamAway = matchHistory?.Match_Player_Stat.filter( p => p.Team === "team_away" ).sort( (a, b) => b.Rating - a.Rating );

    console.info( match.Name, teamHome?.find( p => p.Name === match.Name), teamAway?.find( p => p.Name === match.Name) );

    return (
        <div className="pl-16 text-xs">
              <div className="flex flex-row pl-2 gap-4 h-8 items-center border-b border-gray-600">
                <div className="basis-1/12">Name</div>
                <div className="basis-1/6">Rating</div>
                <div className="basis-1/6">K / D / A</div>
                <div className="basis-1/12">ADR</div>
                <div className="basis-1/12">HS%</div>
                <div className="basis-1/12">Flash Assists</div>
            </div>
            { teamHome?.map( (playerStat, index) => 
                    <div className={`flex flex-nowrap gap-4 py-1 hover:cursor-pointer hover:bg-midnight2 rounded ${ playerStat.Name === match.Name ? "text-yellow-300" : ""}`}>
                        <div className={`basis-1/12`}>{playerStat.Name}</div>
                        <div className="basis-1/6">{playerStat.Rating.toFixed(2)}</div>
                        <div className="basis-1/6">{playerStat.Kills} / {playerStat.Deaths} / {playerStat.Assists}</div>
                        <div className="basis-1/12">{playerStat.ADR}</div>
                        <div className="basis-1/12">{playerStat.HS}</div>
                        <div className="basis-1/12">{playerStat.F_Ass}</div>
                    </div> 
                )
            }
            <br />
            { teamAway?.map( (playerStat, index) => 
                    <div className={`flex flex-nowrap gap-4 py-1 hover:cursor-pointer hover:bg-midnight2 rounded ${ playerStat.Name === match.Name ? "text-yellow-300" : ""}`}>
                        <div className={`basis-1/12`}>{playerStat.Name}</div>
                        <div className="basis-1/6">{playerStat.Rating.toFixed(2)}</div>
                        <div className="basis-1/6">{playerStat.Kills} / {playerStat.Deaths} / {playerStat.Assists}</div>
                        <div className="basis-1/12">{playerStat.ADR}</div>
                        <div className="basis-1/12">{playerStat.HS}</div>
                        <div className="basis-1/12">{playerStat.F_Ass}</div>
                    </div> 
                )
          }
        </div>
    )
};
        

function MatchRow( { match }: { match: MatchHistoryPlayerStat } ) {
    const [ isExpanded, setIsExpanded ] = React.useState(false);

    return (
        <div>
            <div className="flex flex-nowrap gap-4 my-1 py-2 hover:cursor-pointer hover:bg-midnight2 rounded pl-2 text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="w-8">{ isExpanded ? <MdKeyboardArrowDown size="1.5em" className='leading-8 pl-1' /> : <MdKeyboardArrowRight size="1.5em" className='leading-8 pl-1' />}</div>
                <div className="basis-1/12">{match.Match.type} <div className="text-xs text-gray-700">id: {match.csc_match_id}</div></div>
                <div className="basis-1/5"><span className="flex gap-2"><div className='text-sm'><img className='w-8 h-8 mx-auto' src={mapImages['de_'+match.Map.toLowerCase()]} alt=""/></div> {match.Map}</span></div>
                <div className={`basis-1/12 min-w-32 ${match.RF > match.RA ? "text-green-400" : "text-rose-400"}`}><span className="flex flex-nowrap">{match.RF} : {match.RA}</span></div>
                <div className="basis-1/12">{match.Rating.toFixed(2)}</div>
                <div className="basis-1/6">{match.Kills} / {match.Deaths} / {match.Assists}</div>
                <div className="basis-1/12">{match.ADR}</div>
                <div className="basis-1/12">{match.HS}</div>
                <div className="basis-1/12">{match.F_Ass}</div>
            </div>
            {
                isExpanded && <MatchHistory match={match} />
            }
        </div>
        
        );
}

export function PlayerMatchHistory( { player }: Props ) {
    const { data: playerMatchHistory, isLoading: isLoadingPlayerMatchHistory } = useAnalytikillPlayerMatchHistory( player?.steam64Id );
    const [ showAll, setShowAll ] = React.useState( false );

    const sortedPlayerMatchHistory = playerMatchHistory?.sort( (a, b) => Number(b.csc_match_id) - Number(a.csc_match_id) );

    if( playerMatchHistory?.length === 0 && !playerMatchHistory) {
        return null;
    }

    if( isLoadingPlayerMatchHistory ){
        return <div><Loading /></div>;
    }

    return (
        <div className="my-4 p-4">
            <h2 className="text-2xl text-center"><span className="font-bold">Match History</span> - {playerMatchHistory?.length} matches</h2>
            <h2 className="text-center text-sm text-gray-600">Beta Feature</h2>
            <div className="flex flex-row pl-2 gap-4 h-16 items-center border-b border-gray-600">
                <div className="w-8"></div>
                <div className="basis-1/12">Type</div>
                <div className="basis-1/5">Map</div>
                <div className="basis-1/12">Score</div>
                <div className="basis-1/12">Rating</div>
                <div className="basis-1/6">K / D / A</div>
                <div className="basis-1/12">ADR</div>
                <div className="basis-1/12">HS%</div>
                <div className="basis-1/12">Flash Assists</div>
            </div>
            {
                ( showAll ? sortedPlayerMatchHistory : sortedPlayerMatchHistory?.slice(0,5))?.map( (match) => <MatchRow key={match.csc_match_id} match={match} /> )
            }
            { !showAll && (playerMatchHistory ?? []).length > 5 && <div className="text-center hover:cursor-pointer hover:bg-midnight2 rounded" onClick={() => setShowAll(!showAll)}>Show All</div>}
        </div>
    )
}