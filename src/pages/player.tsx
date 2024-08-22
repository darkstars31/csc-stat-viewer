import * as React from "react";
import { Container } from "../common/components/container";
import { teamNameTranslator, getPlayerRatingIndex, PlayerTypes } from "../common/utils/player-utils";
import { getGridData } from "./player/grid-data";
import { GridContainer, GridStat } from "./player/grid-container";
import { Link, useRoute } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerNavigator } from "./player/player-navigator";
import { PlayerRatings } from "./player/playerRatings";
import { nth } from "../common/utils/string-utils";
import { getTeammates } from "../common/utils/franchise-utils";
import { TeamSideRatingPie } from "../common/components/teamSideRatingPie";
import { PlayerRatingTrendGraph } from "../common/components/playerRatingGraph";
import { KillsAssistsDeathsPie } from "../common/components/killAssetDeathPie";
import { Mmr } from "../common/components/mmr";
import { ExternalPlayerLinks } from "../common/components/externalPlayerLinks";
import { PlayerAwards } from "./player/playerAwards";
import { FaceitRank } from "../common/components/faceitRank";
import { ToolTip } from "../common/utils/tooltip-utils";
import * as Containers from "../common/components/containers";
import { StatsOutOfTier } from "./player/statsOutOfTier";
import { tiers } from "../common/constants/tiers";
import { PlayerMatchHistory } from "./player/matchHistory";
import { TiWarningOutline } from "react-icons/ti";
import { Exandable } from "../common/components/containers/Expandable";
import { Hitbox } from "./player/hitbox";
import { PlayerWeaponsExtended } from "./player/weapons-extended";

export function Player() {
	const divRef = React.useRef<HTMLDivElement>(null);
	const { players = [], franchises = [], loading } = useDataContext();
	const [, params] = useRoute("/players/:id");
	const nameParam = decodeURIComponent(params?.id ?? "");
	const nameFromUrl = window.location.href.split("/").pop();
	if (nameFromUrl?.includes("?")) {
		console.warn("Player URL contains a query string '?'. This should not be allowed, but unfortunately it is.");
	}
	const currentPlayer = players.find(p => p.name === nameParam || p.name === nameFromUrl);
	const currentPlayerStats = currentPlayer?.stats;

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (loading.isLoadingCscPlayers) {
		return (
			<Container>
				<Loading />
			</Container>
		);
	}

	if (!currentPlayer) {
		return <Container>An error occured. Player could not found. Please inform Camps of this error.</Container>;
	}

	const teamAndFranchise =
		currentPlayer?.team?.franchise ?
			`${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}`
		:	teamNameTranslator(currentPlayer);
	const teammates = getTeammates(currentPlayer, players, franchises);
	const playerRatingIndex = getPlayerRatingIndex(currentPlayer, players) ?? 0;

	const isSubbing =
		currentPlayer.type === PlayerTypes.TEMPSIGNED ? "FA Sub"
		: currentPlayer.type === PlayerTypes.PERMFA_TEMP_SIGNED ? "PFA Sub"
		: currentPlayer.type === PlayerTypes.SIGNED_SUBBED ? "Sub Out"
		: currentPlayer.type === PlayerTypes.INACTIVE_RESERVE ? "Inactive Reserve"
		: "";

	return (
		<>
			<div ref={divRef} />
			<Container>
				<PlayerNavigator player={currentPlayer} playerIndex={playerRatingIndex} />
				<Containers.StandardBackgroundPage>
					<div className="flex flex-wrap flex-row pb-2">
						<div className="flex basis-full md:basis-1/3 space-x-4">
							<div className="object-contain">
								{currentPlayer?.avatarUrl && (
									<img
										className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px]"
										src={currentPlayer?.avatarUrl}
										alt="Missing Discord Profile"
									/>
								)}
								{!currentPlayer?.avatarUrl && (
									<div className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px] border" />
								)}
							</div>
							<div className="text-left basis-3/4">
								<div className="text-2xl font-extrabold text-white-100 md:text-4xl pb-0">
									{currentPlayer?.name ?? "n/a"}
								</div>
								<div className="flex flex-row flex-wrap gap-1 text-[1.1rem] pb-5 italic">
									<div className="font-bold">
										{currentPlayer?.role ? `${currentPlayer?.role}` : ""}
									</div>
									{currentPlayer?.role && <div>—</div>}
									{currentPlayer?.team?.franchise.name ?
										<Link
											to={`/franchises/${currentPlayer.team.franchise.name}/${currentPlayer.team.name}`}
										>
											<span className="hover:cursor-pointer hover:text-blue-400">
												{currentPlayer.type === PlayerTypes.EXPIRED ?
													<ToolTip
														type="generic"
														message="This players contract has expired."
													>
														<TiWarningOutline className="inline text-red-500" />
													</ToolTip>
												:	""}
												<span>
													{currentPlayer?.team?.franchise.prefix} {currentPlayer?.team?.name}
													{isSubbing ? "*" : ""}
												</span>
												<div className="flex justify-end text-sm text-gray-300 text-right">
													{isSubbing}
												</div>
											</span>
										</Link>
									:	<span>{teamNameTranslator(currentPlayer)}</span>}
								</div>
								<ul className="text-[0.8rem]">
									<li>
										{String(playerRatingIndex + 1).concat(nth(playerRatingIndex + 1))} Overall in{" "}
										<span
											className={`text-${tiers.find(t => t.name === currentPlayer.tier.name)?.color}-500`}
										>
											<b>
												<i>
													{currentPlayer.name.toLowerCase() === "comradsniper" ?
														"Super "
													:	""}{" "}
													{currentPlayer.tier.name}
												</i>
											</b>
										</span>
										<br /> <Mmr player={currentPlayer} /> MMR
										<div>
											<span className="flex leading-7">
												<FaceitRank player={currentPlayer} />
												<ToolTip
													type="generic"
													message="HLTV2.0 Rating formula w/ <1% margin of error."
												>
													<span className="ml-2 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
														~{currentPlayer.hltvTwoPointO?.toFixed(2)} HLTV
													</span>
												</ToolTip>
											</span>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<div className="basis-1/2 grow p-4 content-center">
							<PlayerAwards player={currentPlayer} players={players} />
						</div>
						<div className="basis-1/12">
							<ExternalPlayerLinks player={currentPlayer} />
						</div>
					</div>
					{currentPlayerStats && (
						<div className="space-y-2">
							<Containers.StandardBoxRow>
								<Containers.StandardContentBox>
									<PlayerRatings player={currentPlayer} stats={currentPlayerStats} />
								</Containers.StandardContentBox>
								<Containers.StandardContentBox>
									<PlayerRatingTrendGraph player={currentPlayer} />
								</Containers.StandardContentBox>
							</Containers.StandardBoxRow>
							<Containers.StandardBoxRow>
								<Containers.StandardContentBox>
									<RoleRadar stats={currentPlayerStats!} />
								</Containers.StandardContentBox>
								<Containers.StandardContentBox>
									<TeamSideRatingPie player={currentPlayer} />
									<KillsAssistsDeathsPie stats={currentPlayerStats} />
								</Containers.StandardContentBox>
							</Containers.StandardBoxRow>
						</div>
					)}
				</Containers.StandardBackgroundPage>
				{teammates.length > 0 &&
					false && ( // TODO: fix weird bug in logic that shows same teammate twice
						<div>
							Teammates - {teamAndFranchise}
							<div className="grid grid-cols-1 md:grid-cols-5">
								{teammates.map(teammate => (
									<Link key={`closeby-${teammate.name}`} to={`/players/${teammate.name}`}>
										<div
											style={{ userSelect: "none", lineHeight: "95%" }}
											className="my-[5px] mr-4 flex h-[32px] cursor-pointer items-center rounded-[4px] bg-[#eceff1] px-[12px] py-0 text-[11px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none hover:!shadow-none active:bg-[#cacfd1] dark:bg-midnight2 dark:text-neutral-200"
										>
											<img
												className="my-0 -ml-[12px] mr-[8px] h-[inherit] w-[inherit] rounded-[4px]"
												src={teammate?.avatarUrl}
												alt=""
											/>
											{teammate.name}
										</div>
									</Link>
								))}
							</div>
						</div>
					)}
				<br />
				{currentPlayerStats && (
					<div className="py-2">
						{Array(Math.ceil(getGridData(currentPlayerStats).length / 2))
							.fill(0)
							.map((_, i) => {
								const pair = getGridData(currentPlayerStats).slice(i * 2, (i + 1) * 2);
								return (
									<React.Fragment key={`pair-${i}`}>
										<GridContainer>
											{pair.map((section, sectionIndex) => (
												<div
													key={`section-${i * 2 + sectionIndex}`}
													className="grid grid-cols-1 gap-2 p-2 h-fit"
												>
													{section.map(({ name, value }, statIndex) => (
														<GridStat
															key={`stat-${i * 2 + sectionIndex}-${statIndex}`}
															name={name}
															value={value}
															rowIndex={statIndex} // pass statIndex instead of i
														/>
													))}
												</div>
											))}
										</GridContainer>
										{i < Math.ceil(getGridData(currentPlayerStats).length / 2) - 1 && <br />}
									</React.Fragment>
								);
							})}
					</div>
				)}
				{!currentPlayerStats && (
					<div className="text-center">
						<strong>
							<i>This player has no stats in {currentPlayer.tier.name} for the current season.</i>
						</strong>
						{currentPlayer.statsOutOfTier !== null && (
							<div className="text-xs">Stats found in non-primary tier(s).</div>
						)}
					</div>
				)}
				<br />
				{currentPlayer?.extendedStats && (
					<>
						<Exandable title="Extended Stats">
							<div className="flex flex-row flex-wrap justify-center">
								{Object.entries(currentPlayer.extendedStats.trackedObj).map(([key, value]) => (
									<div className="m-2 p-2">
										<div>{key}</div>
										<div className="text-center">{value}</div>
									</div>
								))}
							</div>
						</Exandable>
						<div className="flex flex-row flex-wrap gap-4">
							<div className="basis-3/12 grow">
								<Exandable title="Chickens">
									<div className="flex flex-row flex-wrap justify-center">
										{Object.entries(currentPlayer.extendedStats.chickens).map(([key, value]) => (
											<div className="m-2 p-2">
												<div>{key}</div>
												<div className="text-center">{value}</div>
											</div>
										))}
									</div>
								</Exandable>
							</div>
							<div className="basis-3/12 grow">
								<Exandable title="Pistols">
									<div className="flex flex-row flex-wrap justify-center">
										{Object.entries(currentPlayer.extendedStats.averages).map(([key, value]) => (
											<div className="m-2 p-2">
												<div>{key}</div>
												<div className="text-center">{String(value.toFixed(2))}</div>
											</div>
										))}
									</div>
								</Exandable>
							</div>
							<div className="basis-3/12 grow">
								<Exandable title="Flash Averages">
									<div className="flex flex-row flex-wrap justify-center">
										{Object.entries(currentPlayer.extendedStats.durationAverages).map(([key, value]) => (
											<div className="m-2 p-2">
												<div>{key}</div>
												<div className="text-center">{String(value.toFixed(2))}</div>
											</div>
										))}
									</div>
								</Exandable>
							</div>
						</div>
						<div className="flex flex-row flex-wrap gap-4">
							<div className="basis-5/12 grow">
								<Exandable title="Weapons">
									<PlayerWeaponsExtended extendedStats={currentPlayer?.extendedStats} />
								</Exandable>
							</div>
							<div className="basis-1/3">
								<Exandable title="Hitboxes">
									<Hitbox hitboxTags={currentPlayer?.extendedStats.hitboxTags} />
								</Exandable>
							</div>
						</div>
					</>
				)}
				<br />
				<PlayerMatchHistory player={currentPlayer} />
				<br />
				{currentPlayer.statsOutOfTier &&
					currentPlayer.statsOutOfTier.map(outOfTierStats => <StatsOutOfTier stats={outOfTierStats} />)}
			</Container>
		</>
	);
}
