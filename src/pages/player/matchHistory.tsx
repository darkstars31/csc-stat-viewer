import * as React from "react";
import { Player } from "../../models";
import { Loading } from "../../common/components/loading";
import { mapImages } from "../../common/images/maps";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { useCscPlayerMatchHistoryGraph } from "../../dao/cscPlayerMatchHistoryGraph";
import { Match } from "../../models/csc-player-match-history-types";
import { GoStarFill } from "react-icons/go";
import { ToolTip } from "../../common/utils/tooltip-utils";
import { getCssColorGradientBasedOnPercentage } from "../../common/utils/string-utils";
import * as Containers from "../../common/components/containers";

type Props = {
    player: Player;
}

function PlayerMatchStatLine( { playerStat, player }: { playerStat: any, player: Player } ) {
    return (
        <tr>
            <td>{playerStat.name}</td>
            <td>{playerStat.rating.toFixed(2)}</td>
            <td>{playerStat.kills} / {playerStat.deaths} / {playerStat.assists}</td>
            <td>{playerStat.damage}</td>
            <td className={`${getCssColorGradientBasedOnPercentage(playerStat.adr)}`}>{playerStat.adr.toFixed(1)}</td>
            <td className={`${getCssColorGradientBasedOnPercentage(Math.round(playerStat.hs / playerStat.kills * 100) || 0)}`}>{Math.round(playerStat.hs / playerStat.kills * 100) || 0}</td>
            <td>{playerStat.FAss}</td>
            <td>{playerStat.utilDmg}</td>
        </tr>
        // <div className={`flex flex-nowrap gap-4 py-1 hover:cursor-pointer hover:bg-midnight2 rounded ${ playerStat.name === player.name ? "bg-slate-900" : ""}`}>
        //     <div className={`basis-2/12`}>{playerStat.name}</div>
        //     <div className="basis-1/12">{playerStat.rating.toFixed(2)}</div>
        //     <div className="basis-1/12">{playerStat.kills} / {playerStat.deaths} / {playerStat.assists}</div>
        //     <div className={`basis-1/12`}>{playerStat.damage}</div>
        //     <div className={`basis-1/12 ${getCssColorGradientBasedOnPercentage(playerStat.adr)}`}>{playerStat.adr.toFixed(1)}</div>
        //     <div className={`basis-1/12 ${getCssColorGradientBasedOnPercentage(Math.round(playerStat.hs / playerStat.kills * 100) || 0)}`}>{Math.round(playerStat.hs / playerStat.kills * 100) || 0}</div>
        //     <div className="basis-1/12">{playerStat.FAss}</div>
        //     <div className="basis-1/12">{playerStat.utilDmg}</div>
        // </div> 
    )
}

function MatchHistory( { player, match }: { player: Player, match: Match } ) {
    const team1 = match.teamStats[0].name;
    const team2 = match.teamStats[1].name;
    const teamHome = match?.matchStats.filter( p => p.teamClanName === team1 ).sort( (a, b) => b.rating - a.rating );
    const teamAway = match?.matchStats.filter( p => p.teamClanName === team2 ).sort( (a, b) => b.rating - a.rating );
   

    return (
        <div className="relative text-xs pb-4">
             <Containers.StandardBackgroundPage>
                <table className="table-auto w-full border-spacing-0.5">
                    <thead className="text-left border-b border-gray-600">
                        <th>Name</th>
                        <th>Rating</th>
                        <th>K / D / A</th>
                        <th>Damage</th>
                        <th>ADR</th>
                        <th>HS%</th>
                        <th>F Asst</th>
                        <th>Util Dmg</th>
                    </thead>
                    <tbody>
                        <div className="relative">
                            <div className="absolute -left-20 top-4 -rotate-90 w-28 mr-16 text-center bg-gradient-to-r from-indigo-500 font-bold capitalize">{ team1.replace("_", " ") }</div>
                        </div>
                        { teamHome?.map( (playerStat, index) => 
                                    <PlayerMatchStatLine key={index} playerStat={playerStat} player={player} />
                            )
                        }
                        <tr>
                            <td colSpan={8} className="text-center h-4"></td>
                        </tr>
                        <div className="relative">
                            <div className="absolute -left-20 top-8 -rotate-90 w-28 mr-16 text-center bg-gradient-to-r from-orange-500 font-bold capitalize">{ team2.replace("_", " ") }</div>
                        </div>
                        { teamAway?.map( (playerStat, index) => 
                                <PlayerMatchStatLine key={index} playerStat={playerStat} player={player} />
                            )
                        }
                    </tbody>
                </table>
            </Containers.StandardBackgroundPage>
            {/* <div className="flex flex-row pl-2 gap-4 h-8 items-center border-b border-gray-600">
                <div className="basis-2/12">Name</div>
                <div className="basis-1/12">Rating</div>
                <div className="basis-1/12">K / D / A</div>
                <div className="basis-1/12">Damage</div>
                <div className="basis-1/12">ADR</div>
                <div className="basis-1/12">HS%</div>
                <div className="basis-1/12">Flash AST</div>
                <div className="basis-1/12">Util Dmg</div>
            </div>
            <div className="relative">
                <div className="absolute -left-20 top-14 -rotate-90 w-28 border-b border-gray-600 mr-16 text-center bg-gradient-to-r from-indigo-500 font-bold capitalize">{ team1.replace("_", " ") }</div>
                { teamHome?.map( (playerStat, index) => 
                        <PlayerMatchStatLine key={index} playerStat={playerStat} player={player} />
                    )
                }
            </div>
            <br />
            <div className="relative">
                <div className="absolute -left-20 top-14 -rotate-90 w-28 border-b border-gray-600 mr-16 text-center bg-gradient-to-r from-orange-500 font-bold capitalize">{ team2.replace("_", " ") }</div>
                { teamAway?.map( (playerStat, index) => 
                        <PlayerMatchStatLine key={index} playerStat={playerStat} player={player} />
                    )
                }
            </div> */}
        </div>
    )
};
        

function MatchRow( { player, match }: { player: Player, match: Match } ) {
    const [ isExpanded, setIsExpanded ] = React.useState(false);
    const matchType = match.matchType ?? "broke"
    const p = match.matchStats.find( ms => ms.name === player.name )!;
    const matchDateShort = new Date(match.createdAt ?? 0).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    const matchDateFull = new Date(match.createdAt ?? 0).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric",
      });

    if(p === undefined) {
        console.info('Player is missing match because their name does not appear as a player, possible name change?',p, 'match', match);
        return null;
    }

    return (
        <div>
            <div className="flex flex-nowrap gap-4 my-1 py-2 hover:cursor-pointer hover:bg-midnight2 rounded pl-2 text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="w-8">{ isExpanded ? <MdKeyboardArrowDown size="1.5em" className='leading-8 pl-1' /> : <MdKeyboardArrowRight size="1.5em" className='leading-8 pl-1' />}</div>
                <div className="basis-1/12"> <ToolTip type="generic" message={`Match Id: ${match.matchId}`}>{matchType} <div className="text-xs text-gray-600">{match?.tier}</div></ToolTip></div>
                <div className="basis-1/12 text-xs"><ToolTip type="generic" message={matchDateFull}>{matchDateShort}</ToolTip></div>
                <div className="basis-1/6"><span className="flex gap-2"><div className='text-sm'><img className='w-8 h-8 mx-auto' src={mapImages[match.mapName.toLowerCase()]} alt=""/></div> {match.mapName.split('de_')[1].charAt(0).toUpperCase() + match.mapName.split('de_')[1].slice(1)}</span></div>
                <div className={`basis-1/12 min-w-32 ${p.RF > p.RA ? "text-green-400" : "text-rose-400"}`}><span className="flex flex-nowrap">{p.RF} : {p.RA}</span></div>
                <div className="basis-1/12">{p.rating.toFixed(2)}</div>
                <div className="basis-1/12">{p.kills} / {p.deaths} / {p.assists}</div>
                <div className="basis-1/12">{p.damage}</div>
                <div className={`basis-1/12 ${ p.adr > 100 ? "text-yellow-400" : ""}`}>{p.adr.toFixed(1)} {p.adr > 100 ? <GoStarFill className="text-yellow-400 inline" /> : ""}</div>
                <div className={`basis-1/12 ${getCssColorGradientBasedOnPercentage(Math.round(p.hs / p.kills * 100) || 0)}`}>{Math.round(p.hs / p.kills * 100) || 0}</div>
                <div className="basis-1/12">{p?.FAss}</div>
                <div className="basis-1/12">{p?.utilDmg}</div>
            </div>
            {
                isExpanded && <MatchHistory player={player} match={match} />
            }
        </div>
        
        );
}

export function PlayerMatchHistory( { player }: Props ) {
    const { data: playerMatchHistory, isLoading: isLoadingPlayerMatchHistory } = useCscPlayerMatchHistoryGraph( player );
    const [ showAll, setShowAll ] = React.useState( false );

    const sortedPlayerMatchHistory = playerMatchHistory?.sort( (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() );

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
                <div className="basis-1/12">Date</div>
                <div className="basis-1/6">Map</div>
                <div className="basis-1/12">Score</div>
                <div className="basis-1/12">Rating</div>
                <div className="basis-1/12">K / D / A</div>
                <div className="basis-1/12">Damage</div>
                <div className="basis-1/12">ADR</div>
                <div className="basis-1/12">HS%</div>
                <div className="basis-1/12">Flash AST</div>
                <div className="basis-1/12">Util. Damage</div>
            </div>
            {
                ( showAll ? sortedPlayerMatchHistory : sortedPlayerMatchHistory?.slice(0,5))?.map( (match) => <MatchRow key={match.matchId} player={player} match={match} /> )
            }
            { !showAll && (playerMatchHistory ?? []).length > 5 && <div className="text-center hover:cursor-pointer hover:bg-midnight2 rounded" onClick={() => setShowAll(!showAll)}>Show All</div>}
        </div>
    )
}