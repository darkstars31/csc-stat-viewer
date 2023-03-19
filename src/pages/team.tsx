import * as React from "react";
import { useDataContext } from "../DataContext";


export function Team(){
	
	const { playerStats, isLoading } = useDataContext();

	return (
		<div>team page</div>
		);
}