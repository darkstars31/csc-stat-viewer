import * as React from "react";
import { PlayerCard } from "./player-cards";
import { Player } from "../../models";
import { PlayerTable } from "./player-table";
import _get from "lodash/get";

type Props = {
	orderBy: { label: string; value: string };
	displayStyle: string;
	players: Player[];
};

export function PlayerListMemoized({ orderBy, displayStyle, players }: Props) {
	let sortedPlayerData = players.sort((a, b) => {
		const itemA = _get(a, orderBy.value, 0);
		const itemB = _get(b, orderBy.value, 0);
		return itemA < itemB ? 1 : -1;
	});

	const orderedPlayerData = orderBy?.label.includes("Name") ? sortedPlayerData.reverse() : sortedPlayerData;

	if (displayStyle === "cards") {
		const playerCards = [];
		for (const player of orderedPlayerData) {
			!player?.name && console.info("no name", player);
			playerCards.push(<PlayerCard key={`${player.name}`} player={player} />);
		}

		return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{playerCards}</div>;
	} else {
		return <PlayerTable players={orderedPlayerData} />;
	}
}

export const PlayerList = React.memo(PlayerListMemoized);
