import * as React from "react";
import { useDataContext } from "../DataContext";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { Link, useRoute } from "wouter";
import { useFetchMatchesGraph, useFetchMultipleMatchInfoGraph } from "../dao/cscMatchesGraphQLDao";
import { MatchCards } from "./team/matches";
import { MapRecord } from "./team/mapRecord";
import { PlayerRow } from "./franchise/player-row";
import { franchiseImages } from "../common/images/franchise";
import { TeamFooterTabulation } from "./franchise/team-footer-tabulation";
import { calculateTeamRecord } from "../common/utils/match-utils";
import { AwardsMappings } from "../common/utils/awards-utils";


export function Team(){
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { franchises = [], players: cscPlayers = [], loading } = useDataContext();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [, params] = useRoute("/franchises/:franchiseName/:teamName");
	const franchiseName = decodeURIComponent(params?.franchiseName ?? "");
    const teamName = decodeURIComponent(params?.teamName ?? "");

	const currentFranchise = franchises.find( f => f.name === franchiseName );
	const currentTeam = currentFranchise?.teams.find( t => t.name === teamName );
	const currentTeamStatAggregation = currentTeam?.players.reduce( (acc, player, index) => {
		const cscPlayerWithStats = cscPlayers.find( p => p.steam64Id === player.steam64Id );
		//console.info('found cscPlayerWithStats', cscPlayerWithStats)
		const divisor = index > 0 ? 2 : 1;
		//acc["rating"] = (acc["rating"] + cscPlayerWithStats?.stats.rating ?? 0) / divisor;
		acc["ef"] = ( acc["ef"] + cscPlayerWithStats?.stats.ef ?? 0) / divisor;
		acc["adr"] = ( acc["adr"] + cscPlayerWithStats?.stats.adr ?? 0) / divisor;
		acc["kast"] = ( acc["kast"] + cscPlayerWithStats?.stats.kast ?? 0 ) / divisor;
		acc["utilDmg"] = ( acc["utilDmg"] + cscPlayerWithStats?.stats.utilDmg ?? 0) / divisor;
		acc["impact"] = ( acc["impact"] + cscPlayerWithStats?.stats.impact ?? 0) / divisor;
		acc["clutchR"] = ( acc["clutchR"] +cscPlayerWithStats?.stats.clutchR ?? 0) / divisor;
		console.info('acc rating', acc["rating"]);
		return acc;
	}, { 'ef': 0, 'adr': 0, 'kast': 0, 'utilDmg': 0, 'impact': 0, 'clutchR': 0 } as any);
	//console.info( 'currentTeamStatAggregation', currentTeamStatAggregation);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: matches = [], isLoading: isLoadingMatches } = useFetchMatchesGraph(currentTeam?.id);
	const matchesData = useFetchMultipleMatchInfoGraph(matches.filter( match => match.stats.length > 0).map( match => match.id ));
	console.info( 'matchData', matchesData.flatMap( matchInfo => matchInfo.data ) );

	const teamRecord = calculateTeamRecord( currentTeam, matches );

	return (
			<div style={{backgroundImage: `url(${franchiseImages[currentFranchise?.prefix ?? '']})`, overflow:'auto'}} className={`bg-repeat bg-center bg-fixed`}>
				<div className="backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] overflow-auto">
					<Container>
						<div className="m-2 p-2 backdrop-blur-sm">
						<div className="my-4">
							<i><Link className="hover:text-blue-400" to={`/franchises`}>Franchises</Link> {"> "} 
							<Link className="hover:text-blue-400" to={`/franchises/${currentFranchise?.name}`}>{currentFranchise?.name}</Link></i> {"> "} 
							{currentTeam?.tier.name}
						</div>
							{	loading.isLoadingFranchises && <Loading />}
							<h2 className="text-5xl font-bold text-white grow text-center">{currentTeam?.name}</h2>
							<div className="text-center p-4 text-xl">
								{currentFranchise?.name} - <i>{currentFranchise?.prefix}</i>
							</div>
							<div className="flex flex-wrap justify-between">
								{ Object.entries(currentTeamStatAggregation).map( ([key, value]) => 
									<div className="flex-initial m-2 p-2 text-center">
										<div><b>{(value as number).toFixed(2)}</b></div>
										<div className="text-sm">{AwardsMappings[key]}</div>
									</div>
									)
								}
							</div>
							<div className="p-4 rounded">
								<hr className="h-px my-4 border-0" />
								<div>
								{
									currentTeam?.players?.map( player => <PlayerRow key={player.name} franchisePlayer={player} team={currentTeam} /> )
									//players?.map( ( player, index ) => <PlayerCard key={player.name} player={player} index={index}/> )								
								}
								{ currentTeam && <TeamFooterTabulation team={currentTeam} /> }
								</div>
								{ isLoadingMatches && <Loading />}
								{ matches.length > 0 && 
									<div className="pt-8">
										<h2 className="text-2xl font-bold text-white grow text-center">Matches ({teamRecord.record.wins} - {teamRecord.record.losses})</h2>
										<MapRecord matches={matches} team={currentTeam} />
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
											{ matches.map( match => <MatchCards key={match.id} match={match} team={currentTeam} /> ) }
										</div>
									</div>
								}								
							</div>	
						</div>
					</Container>
				</div>
			</div>
	);
}