import * as React from "react";
import { useDataContext } from "../../DataContext";
import { Link } from "wouter";
import { getPlayersInTierOrderedByRating } from "../../common/utils/player-utils";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";
import { useWindowDimensions } from "../../common/hooks/window";
import { Player } from "../../models/player";

type Props = {
	player?: Player;
	playerIndex: number;
};

export function PlayerNavigator({ player, playerIndex }: Props) {
	const windowDimensions = useWindowDimensions();
	const pageSize =
		windowDimensions.width < 600 ? 2
		: windowDimensions.width < 1000 ? 4
		: 7; // LOL don't do this
	const [pageCurrent, setPageCurrent] = React.useState(Math.floor(playerIndex / pageSize));
	const { players = [] } = useDataContext();
	if (!player) {
		return null;
	}
	const playerInTierOrderedByRating = getPlayersInTierOrderedByRating(player, players);
	const pageMax = playerInTierOrderedByRating.length / pageSize;
	if (pageCurrent > pageMax) {
		console.info(`Warning: pageCurrent ${pageCurrent} is greater than pageMax ${pageMax}`);
		setPageCurrent(pageMax);
	}
	if (!player) {
		return null;
	}
	return (
		<div className="py-2 w-full">
			<div
				className="flex flex-row px-4 overflow-hidden"
				style={{ width: "100%", justifyContent: "space-between" }}
			>
				{pageCurrent > 0 && (
					<button className="grow-0" onClick={() => setPageCurrent(pageCurrent - 1)}>
						<ImArrowLeft />
					</button>
				)}
				{playerInTierOrderedByRating
					.slice(pageCurrent * pageSize, pageCurrent * pageSize + pageSize)
					.map((player, index) => (
						<Link key={`closeby-${player.name}`} to={`/players/${player.name}`}>
							<div
								style={{ userSelect: "none", lineHeight: "95%" }}
								className="my-[5px] mr-4 flex h-[32px] cursor-pointer items-center rounded-[4px] bg-[#eceff1] px-[12px] py-0 text-[11px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none hover:!shadow-none active:bg-[#cacfd1] dark:bg-midnight2 dark:text-neutral-200"
							>
								<img
									className="my-0 -ml-[12px] mr-[8px] h-[inherit] w-[inherit] rounded-[4px]"
									src={players.find(p => p.name === player.name)?.avatarUrl}
									alt=""
								/>
								{player.name}
								<span className="ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-midnight1 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.9em] font-bold leading-none text-neutral-200">
									{player?.stats?.gameCount > 2 ? pageCurrent * pageSize + index + 1 : "U"}
								</span>
							</div>
						</Link>
					))}
				{pageCurrent * pageSize + pageSize < playerInTierOrderedByRating.length && (
					<button className="grow-0" onClick={() => setPageCurrent(pageCurrent + 1)}>
						<ImArrowRight />
					</button>
				)}
			</div>
		</div>
	);
}
