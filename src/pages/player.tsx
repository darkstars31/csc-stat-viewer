import * as React from "react";
import { Container } from "../common/components/container";
import { teamNameTranslator, getPlayerRatingIndex, PlayerTypes } from "../common/utils/player-utils";
import { getGridData } from "./player/grid-data";
import { GridContainer, GridStat } from "./player/grid-container";
import { Link, useLocation, useRoute, useSearch } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { RoleRadar } from "../common/components/roleRadar";
import { PlayerNavigator } from "./player/player-navigator";
import { PlayerRatings } from "./player/playerRatings";
import { nth } from "../common/utils/string-utils";
import { getTeammates } from "../common/utils/franchise-utils";
import { Mmr } from "../common/components/mmr";
import { ExternalPlayerLinks } from "../common/components/externalPlayerLinks";
import { PlayerAwards } from "./player/playerAwards";
import { FaceitRank } from "../common/components/faceitRank";
import { ToolTip } from "../common/utils/tooltip-utils";
import * as Containers from "../common/components/containers";
import { TiWarningOutline } from "react-icons/ti";
import { Exandable } from "../common/components/containers/Expandable";
import { Hitbox } from "./player/hitbox";
import { PlayerWeaponsExtended } from "./player/weapons-extended";
import { Reputation } from "./player/reputation";
import { CgProfile } from "react-icons/cg";
import { PlayerProfile } from "./player/profile";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { useFetchPlayerProfile } from "../dao/analytikill";
import { ProfileJson } from "../models/profile-types";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useNotificationsContext } from "../NotificationsContext";
import { PlayerPercentilesOne } from "./player/playerPercentilesOne";
import { PlayerPercentilesTwo } from "./player/playerPercentilesTwo";
import { FreeAgentPlayerLeague } from "./player/freeAgentPlayerLeague";
import { TbPlayCardStarFilled } from "react-icons/tb";
import { GraphicsPlayer } from "./graphicsPlayer";
import { Button } from "../common/components/button";
import { toPng } from 'html-to-image';
import { MdKeyboardArrowDown } from "react-icons/md";
import dayjs from "dayjs";
import { PlayerHistory } from "./player/playerHistory";
import { RiArrowDownWideFill } from "react-icons/ri";

const PlayerMatchHistory = React.lazy(() =>import('./player/matchHistory').then(module => ({default: module.PlayerMatchHistory})));
const TeamSideRatingPie = React.lazy(() =>import('../common/components/teamSideRatingPie').then(module => ({default: module.TeamSideRatingPie})));
const PlayerRatingTrendGraph = React.lazy(() =>import('../common/components/playerRatingGraph').then(module => ({default: module.PlayerRatingTrendGraph})));
const KillsAssistsDeathsPie = React.lazy(() =>import('../common/components/killAssetDeathPie').then(module => ({default: module.KillsAssistsDeathsPie})));


export function Player() {
	const [, setLocation] = useLocation();
	const queryParams = new URLSearchParams(useSearch());
	const divRef = React.useRef<HTMLDivElement>(null);
	const [, params] = useRoute("/players/:id");
	const { players = [], franchises = [], loading, seasonAndMatchType, tiers, loggedinUser } = useDataContext();
	const { addNotification } = useNotificationsContext();
	const [ showProfile, setShowProfile ] = React.useState(false);
	const [ isPlayerCardOpen, setIsPlayerCardOpen ] = React.useState(false);
	const [ showPlayerHistory, setShowPlayerHistory ] = React.useState(false);
	const [ activeTab, setActiveTab ] = React.useState<number>(0);

	const nameParam = decodeURIComponent(params?.id ?? "");
	const nameFromUrl = window.location.href.split("/").pop();
	if (nameFromUrl?.includes("?")) {
		console.warn("Player URL contains a query string '?'. This should not be allowed, but unfortunately it is.");
	}

	const currentPlayer = players.find(p => p.name === nameParam || p.name === nameFromUrl);
	const [ viewStatSelection, setViewStatSelection ] = React.useState<string | undefined>(currentPlayer?.tier.name);
	
	const currentPlayerStats = viewStatSelection === currentPlayer?.tier.name ? currentPlayer?.stats : currentPlayer?.statsOutOfTier?.find(s => s.tier === viewStatSelection)?.stats;
	const currentPlayerTierOptions = [ currentPlayer?.tier.name, ...(currentPlayer?.statsOutOfTier ?? []).map( s => s.tier)].filter( item => item !== viewStatSelection)

	const { data: playerProfile, isLoading: isLoadingPlayerProfile } = useFetchPlayerProfile(currentPlayer?.discordId);

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if ([loading.isLoadingCscPlayers, 
		loading.isLoadingCscSeasonAndTiers, 
		loading.isLoadingCachedStats].some(Boolean)) {
		return (
			<Container>
				<Loading />
			</Container>
		);
	}

	if (!currentPlayer) {
		return <Container>An error occured. Player could not found. Please inform Camps of this error.</Container>;
	}

	if ( currentPlayer === loggedinUser && !isLoadingPlayerProfile && Object.keys(playerProfile?.profile ?? {}).length === 0 ) {
		addNotification({
			id: "FillOutProfile",
			title: "It Looks like your profile is empty.",
			subText: "Click here to go to your profile.",
			shouldNewTab: false,
			href: "/profile",
		})
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

	const tierCssColors = {
		Recruit: "text-red-400",
		Prospect: "text-orange-400",
		Contender: "text-yellow-400",
		Challenger: "text-green-400",
		Elite: "text-blue-400",
		Premier: "text-purple-400",
	}

	const tabs: { name: string; disabled?: boolean }[] = [
		{
			name: "Stats",
		},
		{
			name: "Rankings",
		},
		{
			name: "Extended Stats",
		},
		{
			name: "Match History",
		},
		// {
		// 	name: "Free Agent Player League",
		// 	disabled: true
		// }
	]

	const tierButtonClass =
	"rounded-md flex-grow px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-blue-600 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-700";


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
										alt="Discord PFP Missing"
									/>
								)}
								{!currentPlayer?.avatarUrl && (
									<div className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px] border" />
								)}
								<div className="flex flex-col justify-center w-full">
									{Object.keys(playerProfile?.profile ?? {}).length > 0 ?
										<>
											<ToolTip type="generic" message={"Show Profile"}>
												<div 
													onClick={() => setShowProfile(!showProfile)} 
													className="text-center rounded-md text-xs m-1 border-2 border-blue-400 text-blue-400">
													<CgProfile
														className="m-1 w-4 h-4 inline"									
													/> Profile
												</div>
											</ToolTip>
										</>
									:	<ToolTip type="generic" message={"Player has not updated their profile."}>
											<div className="text-center rounded-md text-xs m-1 border-2 border-gray-400 opacity-50">
												<CgProfile
													className="m-1 w-4 h-4 inline"												
												/> Profile
											</div>
										</ToolTip>
									}
									<Reputation playerDiscordId={currentPlayer.discordId} />
								</div>
							</div>
							<div id="player-tier" className="text-left basis-3/4">
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
											className={`${tierCssColors[tiers.find(t => t.tier.name === viewStatSelection)?.tier.name as keyof typeof tierCssColors]} font-bold italic`}
										>
											{currentPlayer?.name.toLowerCase() === "comradsniper" ? "Super " : ""}{" "}
											<Popover className="inline relative">
												<PopoverButton
													className={`transition ease-in-out hover:scale-105 duration-100`}
												>
													{viewStatSelection}
													{currentPlayer?.tier.name === viewStatSelection ? "" : "*"} { currentPlayerTierOptions.length > 0 && <MdKeyboardArrowDown className="inline" /> }
												</PopoverButton>
												<PopoverPanel
													anchor="bottom"
													className="border-gray-800 divide-y divide-white/5 rounded-xl bg-gray-700 bg-opacity-50 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
												>
													<div className="p-2 shadow-inner">
														{currentPlayerTierOptions.map(tier => (
															<button
																className="block rounded-lg py-1 px-2 transition hover:bg-white/50"
																onClick={() => setViewStatSelection(tier)}
															>
																<p
																	className={`font-semibold ${tierCssColors[tiers.find(t => t.tier.name === viewStatSelection)?.tier.name as keyof typeof tierCssColors]}`}
																>
																	{tier}
																</p>
															</button>
														))}
													</div>
												</PopoverPanel>
											</Popover>
										</span>
										<br />
										{currentPlayer && (
											<>
												<Mmr player={currentPlayer} /> MMR
											</>
										)}
										<div>
											<span className="flex leading-7">
												<FaceitRank player={currentPlayer} />
												<ToolTip
													type="generic"
													message="HLTV2.0 Rating formula w/ <1% margin of error."
												>
													<span className="ml-2 bg-gradient-to-r from-amber-300 to-pink-700 bg-clip-text text-transparent">
														~{currentPlayer?.hltvTwoPointO?.toFixed(2)} HLTV
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
						<div className="float-right w-4 sm:w-40 after:clear-both">
							<div className="flex flex-col justify-center items-center">
								<ExternalPlayerLinks player={currentPlayer} />
								<div className="pt-1 justify-end text-xs italic font-bold hover:cursor-pointer">
									{/* <Link to={`/graphics/players/${currentPlayer.name}`}>
										<TbPlayCardStarFilled className="inline" /> Player Card
									</Link> */}
									<a onClick={() => setIsPlayerCardOpen(true)}><TbPlayCardStarFilled className="inline" /> Player Card</a>
								</div>
							</div>
							
						</div>
						{/* <div className="clear-both" /> */}
					</div>
					{Object.values(playerProfile ?? {}).length > 0 && (
						<Transition
							as={"div"}
							show={showProfile}
							enter="transition ease-out duration-300"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<PlayerProfile player={currentPlayer} playerProfile={playerProfile?.profile!} />
						</Transition>
					)}
					{viewStatSelection !== currentPlayer.tier.name && (
						<div className="text-sm italic font-bold text-gray-500 text-center w-full">
							*Non-Primary Tier Stats
						</div>
					)}
					{currentPlayerStats && (
						<div className="space-y-2">
							<React.Suspense fallback={<Loading />}>
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
							</React.Suspense>
						</div>
					)}
					{playerProfile?.teamHistory && (
						<div className="space-y-2 w-full">
							<div
								onClick={() => setShowPlayerHistory(prev => !prev)}
								className="flex flex-col mt-3 w-full text-center items-center justify-center text-gray-400 text-sm">								
									<div>Expand Player History</div>
									<div className="w-full flex justify-center items-center">
										<RiArrowDownWideFill style={{transform: 'scale(2.8,1.5)'}} />
									</div>
							</div>										
								<Transition
									as={"div"}
									show={showPlayerHistory}
									enter="transition ease-out duration-300"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-100"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>	
									<PlayerHistory playerProfile={playerProfile} />
							</Transition>															
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
				<div
					className="justify-center flex flex-wrap rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out bg-slate-700 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-700 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
					role="group"
				>
					{tabs.map((tab, index) => (
						<button
							key={tab.name}
							type="button"
							onClick={() => {
								//queryParams.set("q", index);
								//setLocation(window.location.pathname + "?" + queryParams.toString());
								setActiveTab(index);
							}}
							className={`${activeTab === index ? "bg-blue-500" : "bg-slate-700"} ${tierButtonClass} ${tab?.disabled ? "pointer-events-none text-gray-500" : ""}`}
							disabled={tab?.disabled}
						>
							{tab.name}
						</button>
					))}
				</div>
				{ activeTab === 0 && currentPlayerStats && (
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
				{!currentPlayerStats ||
					(currentPlayerTierOptions.length > 0 && (
						<div className="text-center font-bold italic">
							Looking for stats in a different tier?{" "}
							<a className="text-blue-600 underline" href="#player-tier">
								You can now find that here
							</a>
							<div className="text-xs">Click on the players current tier.</div>
						</div>
					))}
				<br />
				{activeTab === 1 && 
					currentPlayerStats && (<div>
						{/* <Exandable title={'Stat Rankings'}> */}
							<Containers.StandardBoxRow>
								<Containers.StandardContentBox>
									<PlayerPercentilesOne player={currentPlayer} stats={currentPlayerStats} />
								</Containers.StandardContentBox>
								<Containers.StandardContentBox>
									<PlayerPercentilesTwo player={currentPlayer} stats={currentPlayerStats} />
								</Containers.StandardContentBox>
							</Containers.StandardBoxRow>
						{/* </Exandable> */}
					</div>)
				}
				{activeTab === 2 && Object.keys(currentPlayer?.extendedStats ?? {}).length > 0 && (
					<div>					
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
							<div className="flex flex-row flex-wrap justify-center">
								<div className="h-12 basis-full text-center uppercase font-extrabold border-b border-yellow-400">
									Stats
								</div>
								{Object.entries(currentPlayer.extendedStats.trackedObj).map(([key, value]) => (
									<div className="m-2 p-2">
										<div>{key}</div>
										<div className="text-center">{value}</div>
									</div>
								))}
							</div>
							<div className="flex flex-row flex-wrap justify-center">
								<div className="h-12 basis-full text-center uppercase font-extrabold border-b border-yellow-400">
									Chickens
								</div>
								{Object.entries(currentPlayer.extendedStats.chickens).map(([key, value]) => (
									<div className="m-2 p-2">
										<div>{key}</div>
										<div className="text-center">{value}</div>
									</div>
								))}
							</div>
							<div className="flex flex-row flex-wrap justify-center">
								<div className="h-12 basis-full text-center uppercase font-extrabold border-b border-yellow-400">
									Pistols
								</div>
								{Object.entries(currentPlayer.extendedStats.averages).map(([key, value]) => (
									<div className="m-2 p-2">
										<div>{key}</div>
										<div className="text-center">{String(value.toFixed(2))}</div>
									</div>
								))}
							</div>
							<div className="flex flex-row flex-wrap justify-center">
								<div className="h-12 basis-full text-center uppercase font-extrabold border-b border-yellow-400">
									Flashes
								</div>
								{Object.entries(currentPlayer.extendedStats.durationAverages).map(
									([key, value]) => (
										<div className="m-2 p-2">
											<div>{key}</div>
											<div className="text-center">{String(value.toFixed(2))}</div>
										</div>
									),
								)}
							</div>
						</div>
						<Exandable title="Weapons">
							<PlayerWeaponsExtended extendedStats={currentPlayer?.extendedStats} />
						</Exandable>
						<Exandable title="Hitboxes">
							<Hitbox hitboxTags={currentPlayer?.extendedStats.hitboxTags} />
						</Exandable>
					</div>
				)}
				<br />
				{
				activeTab === 3 && 
					<React.Suspense fallback={<Loading />}>
						<PlayerMatchHistory player={currentPlayer} season={seasonAndMatchType.season} />
					</React.Suspense>
				}
				{
				activeTab === 4 && 
					<React.Suspense fallback={<Loading />}>
						<Container>
							<FreeAgentPlayerLeague />
						</Container>
					</React.Suspense>
				}
			</Container>
			<Dialog 
				open={isPlayerCardOpen} 
				onClose={() => setIsPlayerCardOpen(false)} 
				className="fixed inset-0 z-10 overflow-y-auto"
				>
					<div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
						<DialogPanel className="space-y-4 p-12">
						<DialogTitle className="font-bold bg-slate-600 rounded-lg bg-opacity-50 backdrop-blur-md text-white p-4 shadow-lg">
							<div className="flex flex-row justify-between items-center">
								<div>
									Player Card
								</div>
								<div className="text-sm italic text-gray-400">
									Work in Progress
								</div>
								<div>
									<Button onClick={() => { 
										const node = document.getElementById('player-card');
										if (!node) return;
										
										toPng(node, {
											filter: (node) => {
												// Skip elements with external CSS
												const tagName = node.tagName?.toLowerCase();
												if (tagName === 'link') return false;
												return true;
											},
											style: {
												// Add any necessary styles inline
												backgroundColor: 'transparent',
											},
											quality: 1.0
										})
										.then((dataUrl) => {
											// Create a download link instead of appending to body
											const link = document.createElement('a');
											link.download = `${currentPlayer?.name ?? 'player'}-card.png`;
											link.href = dataUrl;
											link.click();
										})
										.catch((err) => {
											console.error('Failed to export image:', err);
										});
									}}>
										Export as PNG
									</Button>
								</div>
							</div>
						</DialogTitle>							
							<GraphicsPlayer />											
						</DialogPanel>
					</div>
			</Dialog>
		</>
	);
}
