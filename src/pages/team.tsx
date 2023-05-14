import * as React from "react";
import { useDataContext } from "../DataContext";
import { PlayerStats } from "../models";
import { Container } from "../common/components/container";
import { Loading } from "../common/components/loading";


export function Team(){
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { franchises = [], players = [], loading } = useDataContext();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];

	return (
		<Container>
			{	loading.isLoadingFranchises &&
				<Loading />
			}
			<div>
				team page
			</div>
		</Container>
		);
}