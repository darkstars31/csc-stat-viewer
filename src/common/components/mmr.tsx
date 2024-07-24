import * as React from "react";
import { Player } from "../../models/player";
import { Player as FranchisePlayer } from "../../models/franchise-types";

type Props = {
	player: Player | FranchisePlayer;
};

export function Mmr({ player }: Props) {
	return <span>{player.mmr !== 0 ? player.mmr : "???"}</span>;
}
