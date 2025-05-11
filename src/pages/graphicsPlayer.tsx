import * as React from "react";
import { Container } from "../common/components/container";
import { teamNameTranslator, getPlayerRatingIndex, PlayerTypes } from "../common/utils/player-utils";
import chicken from "../assets/images/chicken.png";
import { useDataContext } from "../DataContext";
import { Loading } from "../common/components/loading";
import { PlayerRatings } from "./player/playerRatings";
import { nth } from "../common/utils/string-utils";
import { FaceitRank } from "../common/components/faceitRank";
import { useFetchPlayerProfile } from "../dao/analytikill";

import { franchiseImages } from "../common/images/franchise";
import { useCscStatsProfileTrendGraph } from "../dao/cscProfileTrendGraph";
import { useRoute } from "wouter";

const TeamSideRatingPie = React.lazy(() =>import('../common/components/teamSideRatingPie').then(module => ({default: module.TeamSideRatingPie})));
const KillsAssistsDeathsPie = React.lazy(() =>import('../common/components/killAssetDeathPie').then(module => ({default: module.KillsAssistsDeathsPie})));

const StatLine = ({ title, value}: { title: string, value: number | string}) => (
<div className="text-center">
	<div className="text-sm font-extrabold">{title}</div>
	<div className="text-gray-400">{value}</div>
</div>)


export function GraphicsPlayer() {
	const [, params] = useRoute("/graphics/players/:id");
	const { players = [], loading, seasonAndMatchType } = useDataContext();

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

	const teamAndFranchise =
		currentPlayer?.team?.franchise ?
			`${currentPlayer?.team?.franchise.name} (${currentPlayer?.team?.franchise.prefix}) > ${currentPlayer?.team?.name}`
		:	teamNameTranslator(currentPlayer);
	const playerRatingIndex = getPlayerRatingIndex(currentPlayer, players) ?? 0;

	const isSubbing =
		currentPlayer.type === PlayerTypes.TEMPSIGNED ? "FA Sub"
		: currentPlayer.type === PlayerTypes.PERMFA_TEMP_SIGNED ? "PFA Sub"
		: currentPlayer.type === PlayerTypes.SIGNED_SUBBED ? "Sub Out"
		: currentPlayer.type === PlayerTypes.INACTIVE_RESERVE ? "Inactive Reserve"
		: "";

	const tierCssColors = {
		Recruit: "text-red-700",
		Prospect: "text-orange-700",
		Contender: "text-yellow-700",
		Challenger: "text-green-700",
		Elite: "text-blue-700",
		Premier: "text-purple-700",
	}

	const gradientColors = {
		Recruit: "from-gray-950 via-gray-900 to-red-950",
		Prospect: "from-gray-950 via-gray-900 to-orange-950",
		Contender: "from-gray-950 via-gray-900 to-yellow-950",
		Challenger: "from-gray-950 via-gray-900 to-green-950",
		Elite: "from-gray-950 via-gray-900 to-blue-950",
		Premier: "from-gray-950 via-gray-900 to-purple-950",
	}

	const playerTypesShortHand = {
		[PlayerTypes.TEMPSIGNED]: "SUB",
		[PlayerTypes.DRAFT_ELIGIBLE]: "DE",
		[PlayerTypes.FREE_AGENT]: "FA",
		[PlayerTypes.PERMANENT_FREE_AGENT]: "PFA",
	}

	const gameCount = currentPlayerStats?.gameCount ?? 0;

	const accolades = [
		"⭐ Can touch their toes!",
		"⭐ Throws Util real good",
		"⭐ Eats Breakfast usually",
		"⭐ Has Legs",
		currentPlayer.stats.clutchR > .1 ? `⭐ Clutch God` : undefined,
		(currentPlayer.stats.fAssists) > 3 ? `⭐ Flashbang Picasso - ${currentPlayer.stats.fAssists / gameCount} flash assists per game` : undefined,
		(currentPlayer.extendedStats.weaponKillSubTypes.grenade / gameCount) > 2 ? `⭐ Utility Maniac - ${currentPlayer.extendedStats.weaponKillSubTypes.grenade / gameCount} utility kills` : undefined,
		((currentPlayer.extendedStats.weaponKills.Knife ?? 0) / gameCount) > 0.5 ? `⭐ Stabber Extraordinaire - ${currentPlayer.extendedStats.weaponKills.Knife! / gameCount} knife kills per game` : undefined,
		((currentPlayer.extendedStats.weaponKills["Zeus x27"] ?? 0) / gameCount) > 0.5 ? `⭐ Zeus Abuser ${currentPlayer.extendedStats.weaponKills["Zeus x27"]!}` : undefined,
		(currentPlayer.extendedStats.trackedObj.selfKills) > 0 ? `⭐ Self-Sabotage Specialist - ${currentPlayer.extendedStats.trackedObj.selfKills} self-inflicted deaths` : undefined,
		currentPlayer.stats.hs > 50 ? `⭐ Big Head MODE ACTIVATED - ${currentPlayer.stats.hs.toFixed(2)} percentage` : undefined,
		currentPlayer.stats.kills - currentPlayer.stats.deaths > 0 ? `⭐ Kills more than they die - positive k/d ${currentPlayer.stats.kills - currentPlayer.stats.deaths}` : undefined,
		(currentPlayer.extendedStats.trackedObj.wallBangKills / gameCount) > 1.2 ? `⭐ What wall? - ${currentPlayer.extendedStats.trackedObj.wallBangKills} kills through walls` : undefined,
		(currentPlayer.extendedStats.trackedObj.noScopesKills / gameCount) > 2 ? `⭐ No Crosshairs required - ${currentPlayer.extendedStats.trackedObj.noScopesKills} no scopes` : undefined,
		(currentPlayer.extendedStats.trackedObj.airborneKills / gameCount) > 2 ? `⭐ Blue Angel Flying Mac10 Squadon` : undefined,
		(currentPlayer.extendedStats.trackedObj.diedToBomb) > 5 ? `⭐ Doesn't understand Bomb Radius` : undefined,
		(currentPlayer.extendedStats.trackedObj.bombsDefused / gameCount) > 3 ? `⭐ The Red Wire Award w/ ${currentPlayer.extendedStats.trackedObj.bombsDefused / gameCount} defuses` : undefined,
		(currentPlayer.extendedStats.trackedObj.bombsPlanted / gameCount) > 5 ? `⭐ Designated Bomb Carrier w/ ${currentPlayer.extendedStats.trackedObj.bombsPlanted / gameCount} plants` : undefined,
		(currentPlayer.extendedStats.trackedObj.smokeKills / gameCount) > 2 ? `⭐ The Smoke Criminal w/ ${(currentPlayer.extendedStats.trackedObj.smokeKills / gameCount).toFixed(2)} kills through smoke` : undefined,
		(currentPlayer.extendedStats.trackedObj.ninjaDefuses / gameCount) > 0.7 ? `⭐ Certified Ninja @ ${(currentPlayer.extendedStats.trackedObj.ninjaDefuses / gameCount)} defuses per game` : undefined,
		`⭐ ${currentPlayer.extendedStats.trackedObj.mvpCount} Time Round MVP`,
		(currentPlayer.stats.fiveK > 2) ?`⭐ ${currentPlayer.stats.fiveK} Aces` : undefined,
		(currentPlayer.extendedStats.trackedObj.teamKills / gameCount > 0.5 ? `⭐ Should be more careful which direction their gun is pointed - ${currentPlayer.extendedStats.trackedObj.teamKills} Team Kills` : undefined),
	].filter(Boolean);

	const randomizedAccolades = accolades.sort(() => Math.random() - 0.5).slice(0, 4);

	const teamPrefixOrType = currentPlayer?.team?.franchise.prefix ?? playerTypesShortHand[currentPlayer.type as keyof typeof playerTypesShortHand];

	return (
        <div id="player-card" className={`max-w-5xl m-8 bg-gradient-to-b from-gray-900 ${gradientColors[currentPlayer.tier.name as keyof typeof tierCssColors]} text-white rounded-lg`}>
            <div className="vh-100 flex">
				<div className="w-2/12 bg-gray-300 text-center rounded-l-lg flex flex-col justify-between">
					<div style={{writingMode: "vertical-lr", textOrientation: "upright", textShadow: "4px 4px 0 rgba(0, 0, 0, .5), 8px 8px 0 rgba(0, 0, 0, .3)"}} 
					className={`flex m-auto px-12 py-4 w-full font-extrabold text-center text-blue-950 ${ currentPlayer.name.length < 8 ? "text-6xl" : currentPlayer.name.length < 12 ? "text-5xl" : "text-4xl" }`}>
						{currentPlayer.name}
					</div>
					<div className="mt-auto">
						<div className="text-purple-950 font-mono text-lg font-extrabold uppercase">
							{teamPrefixOrType}|<span className={`${tierCssColors[currentPlayer.tier.name as keyof typeof tierCssColors]}`}>{currentPlayer.tier.name}</span>
						</div>
						<div className="m-6">
							{ currentPlayer?.team?.franchise.prefix ? 
								<img src={franchiseImages[currentPlayer?.team?.franchise.prefix ?? ""]} alt={currentPlayer?.name} className="w-full" />
								:
								<img
										className="shadow-lg shadow-black/20 dark:shadow-black/40 rounded-xl min-w-[128px] min-h-[128px]"
										src={currentPlayer?.avatarUrl}
										alt="Discord PFP Missing"
									/>
							}
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
								{randomizedAccolades.map((accolade, index) => (
									<li key={index}>{accolade}</li>
								))}
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
						{cscPlayerProfile?.reverse().slice(0, 15)?.map((item, index) => (
							<React.Fragment key={index}>
								<div
									className={`w-4 h-4 rounded-full ${
										item.rating > 1.0 ? "bg-yellow-500" : "bg-gray-400"}`}								
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
