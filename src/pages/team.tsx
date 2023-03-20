import * as React from "react";
import { useDataContext } from "../DataContext";


export function Team(){
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { playerStats, isLoading } = useDataContext();

	return (
		<div>team page</div>
		);
}