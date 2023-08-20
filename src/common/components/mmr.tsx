import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Player } from "../../models/player";
import { Player as FranchisePlayer } from "../../models/franchise-types";

type Props = {
    player: Player | FranchisePlayer,
}

export function Mmr( { player }: Props) {
    const { dataConfig } = useDataContext();
    const seasonStartDate = new Date( dataConfig?.seasonStartDate ?? "");
    const seasonEndDate = new Date( dataConfig?.seasonEndDate ?? "");
    const isInSeason = seasonEndDate > new Date() && seasonStartDate < new Date();
    return <span>{ isInSeason ? player.mmr : "???"}</span> ;
}