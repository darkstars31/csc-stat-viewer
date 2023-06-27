import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Player } from "../../models/player";
import { Player as FranchisePlayer } from "../../models/franchise-types";

type Props = {
    player: Player | FranchisePlayer,
}

export function Mmr( { player }: Props) {
    const { dataConfig } = useDataContext();
    const date = new Date( dataConfig?.seasonEndDate ?? "");
    const isInSeason = date < new Date();
    return <span>{ isInSeason ? player.mmr : "???"}</span> ;
}