import * as React from "react";
import { useDataContext } from "../DataContext";
import { PlayerStats } from "../models";


export function Team(){
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { players = [], isLoading } = useDataContext();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const playerStats: PlayerStats[] = players.filter( p => Boolean(p.stats) ).map( p => p.stats) as PlayerStats[];

	return (
		<div>team page</div>
		);
}