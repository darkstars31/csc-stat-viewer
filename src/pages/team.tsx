import * as React from "react";
import { useDataContext } from "../DataContext";
import { PlayerStats } from "../models";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";
import { useRoute } from "wouter";
import { useFetchMatchesGraph } from "../dao/matchesGraphQLDao";
import { PlayerRow } from "./franchise/player-row";
import { MatchCards } from "./team/matches";
import { MapRecord } from "./team/mapRecord";


export function Team(){
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { franchises = [], players: CscPlayers = [], loading } = useDataContext();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const playerStats: PlayerStats[] = CscPlayers.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];
	const [, params] = useRoute("/franchises/:franchiseName/:teamName");
	const franchiseName = decodeURIComponent(params?.franchiseName ?? "");
    const teamName = decodeURIComponent(params?.teamName ?? "");

	const currentFranchise = franchises.find( f => f.name === franchiseName );
	const currentTeam = currentFranchise?.teams.find( t => t.name === teamName );

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: matches = [], isLoading: isLoadingMatches } = useFetchMatchesGraph(currentTeam?.id);
	console.info( matches )
	const teamRecord = matches.reduce((acc, match) => {
		if( match.stats.length > 0){
			match.stats[0].winner.name === currentTeam?.name ? acc[0] = acc[0] + 1 : acc[1] = acc[1] + 1;
		}
		return acc;
	}, [0,0]);

	return (
			<div style={{backgroundImage: `url('https://core.csconfederation.com/images/${currentFranchise?.logo.name}')`, overflow:'auto'}} className={`bg-repeat bg-center bg-fixed`}>
				<div className="backdrop-opacity-10 backdrop-brightness-90 bg-black/[.85] overflow-auto">
					<Container>
						<div className="m-2 p-2 backdrop-blur-sm">
							{	loading.isLoadingFranchises && <Loading />}
							<h2 className="text-5xl font-bold text-white grow text-center">{currentTeam?.name}</h2>
							<div className="text-center p-4 text-xl">
								{currentFranchise?.name} - <i>{currentFranchise?.prefix}</i>
							</div>
							<div className="p-4 rounded">
								<hr className="h-px my-4 border-0" />
								{
									currentTeam?.players?.map( player => <PlayerRow key={player.name} franchisePlayer={player} team={currentTeam} /> )
								}
								<div className="pt-8">
									<h2 className="text-2xl font-bold text-white grow text-center">Matches ({teamRecord[0]} - {teamRecord[1]})</h2>
									<MapRecord matches={matches} team={currentTeam} />
									<div className="grid grid-cols-2 md:grid-cols-4 ">
										{ matches.map( match => <MatchCards key={match.id} match={match} team={currentTeam} /> ) }
									</div>
								</div>
							</div>	
						</div>
					</Container>
				</div>
			</div>
	);
}