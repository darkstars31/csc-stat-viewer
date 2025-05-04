import * as React from "react";
import { Container } from "../common/components/container";
import { teamNameTranslator, getPlayerRatingIndex, PlayerTypes } from "../common/utils/player-utils";
import chicken from "../assets/images/chicken.png";
import { useLocation, useRoute, useSearch } from "wouter";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { PlayerRatings } from "./player/playerRatings";
import { nth } from "../common/utils/string-utils";
import { getTeammates } from "../common/utils/franchise-utils";
import { FaceitRank } from "../common/components/faceitRank";
import { useFetchPlayerProfile } from "../dao/analytikill";
import { useNotificationsContext } from "../NotificationsContext";

import { franchiseImages } from "../common/images/franchise";
import { useCscStatsProfileTrendGraph } from "../dao/cscProfileTrendGraph";

const TeamSideRatingPie = React.lazy(() =>import('../common/components/teamSideRatingPie').then(module => ({default: module.TeamSideRatingPie})));
const KillsAssistsDeathsPie = React.lazy(() =>import('../common/components/killAssetDeathPie').then(module => ({default: module.KillsAssistsDeathsPie})));

const StatLine = ({ title, value}: { title: string, value: number | string}) => (
<div className="text-center">
	<div className="text-sm font-extrabold">{title}</div>
	<div className="text-gray-400">{value}</div>
</div>)


export function GraphicsPlayer() {
	const [, setLocation] = useLocation();
	const queryParams = new URLSearchParams(useSearch());
	const divRef = React.useRef<HTMLDivElement>(null);
	const [, params] = useRoute("/graphics/players/:id");
	const { players = [], franchises = [], loading, seasonAndMatchType, tiers, loggedinUser } = useDataContext();
	const { addNotification } = useNotificationsContext();
	const [ showProfile, setShowProfile ] = React.useState(false);
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

	const { data: playerProfile = {}, isLoading: isLoadingPlayerProfile } = useFetchPlayerProfile(currentPlayer?.discordId);
	const { data: cscPlayerProfile, isLoading } = useCscStatsProfileTrendGraph(currentPlayer?.steam64Id, seasonAndMatchType.season);

	console.info("cscPlayerProfile", cscPlayerProfile);
	
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

	if ( currentPlayer === loggedinUser && !isLoadingPlayerProfile && Object.keys(playerProfile).length === 0 ) {
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
		Recruit: "text-red-800",
		Prospect: "text-orange-800",
		Contender: "text-yellow-800",
		Challenger: "text-green-800",
		Elite: "text-blue-800",
		Premier: "text-purple-800",
	}

	return (
        <div className="m-8 bg-gradient-to-b from-gray-900 to-red-950 text-white rounded-lg">
            <div className="vh-100 flex">
				<div className="w-2/12 bg-gray-300 text-center rounded-l-lg flex flex-col justify-between">
					<div style={{writingMode: "vertical-lr", textOrientation: "upright", textShadow: "4px 4px 0 rgba(0, 0, 0, .5), 8px 8px 0 rgba(0, 0, 0, .3)"}} className="flex m-auto px-12 py-4 w-full font-extrabold text-center text-blue-950 text-6xl">
						{currentPlayer.name}
					</div>
					<div className="mt-auto">
						<div className="text-purple-950 font-mono text-lg uppercase">
							{currentPlayer?.team?.franchise.prefix} | <span className={`${tierCssColors[currentPlayer.tier.name as keyof typeof tierCssColors]}`}>{currentPlayer.tier.name}</span>
						</div>
						<div className="m-6">
							<img src={franchiseImages[currentPlayer?.team?.franchise.prefix ?? ""]} alt={currentPlayer?.name} className="w-full" />
						</div>
					</div>
				</div>
                <div className="w-8 bg-yellow-500" />
                <div className="w-9/12">
                    <div className="flex flex-col m-8">
						<div className="text-4xl font-bold text-white tracking-widest">
						✨ {currentPlayer.role ?? "RIFLER"}: {String(playerRatingIndex + 1).concat(nth(playerRatingIndex + 1))} Overall ✨
						</div>
						<div className="mx-2 pt-2 font-extrabold relative">
							SEASON {seasonAndMatchType.season} STATS
							<span className="pt-2 pl-4"><FaceitRank player={currentPlayer} /></span>					
							<span className="ml-2 bg-gradient-to-r from-amber-300 to-pink-700 bg-clip-text text-transparent">
								~{currentPlayer?.hltvTwoPointO?.toFixed(2)} HLTV 2.0
							</span>			
						</div>
						<div className="my-2 p-2">
							<div className="grid grid-cols-4 gap-24 text-xl">
								<StatLine title="Matches" value={currentPlayerStats?.gameCount ?? "N/A"} />
								<StatLine title="ADR" value={currentPlayerStats?.adr.toFixed(2) ?? "N/A"} />
								<StatLine title="IMPACT" value={currentPlayerStats?.impact.toFixed(2) ?? "N/A"} />
								<StatLine title="EF" value={currentPlayerStats?.ef.toFixed(2) ?? "N/A"} />
							</div>
							<div className="grid grid-cols-4 gap-24 text-xl">
								<StatLine title="CT RATING" value={currentPlayerStats?.ctRating.toFixed(2) ?? "N/A"} />
								<StatLine title="T RATING" value={currentPlayerStats?.TRating.toFixed(2) ?? "N/A"} />
								<StatLine title="KAST" value={currentPlayerStats?.kast.toFixed(2) ?? "N/A"} />
								<StatLine title="UTIL DMG" value={currentPlayerStats?.utilDmg.toFixed(2) ?? "N/A"} />
							</div>
						</div>				
						<div>
							<PlayerRatings player={currentPlayer} stats={currentPlayerStats!} options={{dontShowWarnings: true}} />	
						</div>
						<div className="m-4 pt-4 font-extrabold uppercase">
							<ul>
								<li>⭐ Can touch their toes!</li>
								<li>⭐ Throws Util really good</li>
								<li>⭐ Eats Breakfast usually</li>
								<li>⭐ MVP once</li>
								<li>⭐ This section still a WIP</li>
							</ul>
						</div>
						<div className="flex grid-cols-3 gap-2 item-center">							
							<TeamSideRatingPie player={currentPlayer} />														
							<KillsAssistsDeathsPie stats={currentPlayerStats!} />
							{currentPlayer?.extendedStats &&
								<div className="flex flex-col items-center justify-center">
								{currentPlayer.extendedStats.chickens.killed} 
								<div className="uppercase text-sm text-center">Chickens Killed</div>
								<img className="m-auto h-20 w-20" src={chicken} alt="Chickens" />
							</div>		
}			
						</div>
                    </div>
					<div className="text-xs text-gray-500 m-0.5 pl-2 p-0.5 italic">
							Designed by skrunkly
					</div>
                </div>
				<div>
					<div className="flex flex-col items-center mt-8">
						{cscPlayerProfile?.map((item, index) => (
							<React.Fragment key={index}>
								<div
									className={`w-4 h-4 rounded-full ${
										activeTab === index ? "bg-purple-500" : "bg-gray-400"
									}`}
									onClick={() => setActiveTab(index)}
									style={{ cursor: "pointer" }}
								></div>
								{index < cscPlayerProfile.length - 1 && (
									<div className="w-1 bg-gray-400 text-xs relative" style={{ height: "2rem" }}> 
										<div className="absolute left-4 -top-4">{item.rating.toFixed(2)}</div>
									</div>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
            </div>
        </div>
	);
}
