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
import { Transition } from "@headlessui/react";
import { useFetchPlayerProfile } from "../dao/analytikill";
import { ProfileJson } from "../models/profile-types";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useNotificationsContext } from "../NotificationsContext";
import { PlayerPercentilesOne } from "./player/playerPercentilesOne";
import { PlayerPercentilesTwo } from "./player/playerPercentilesTwo";
import { FreeAgentPlayerLeague } from "./player/freeAgentPlayerLeague";
import { franchiseImages } from "../common/images/franchise";

const PlayerMatchHistory = React.lazy(() =>import('./player/matchHistory').then(module => ({default: module.PlayerMatchHistory})));
const TeamSideRatingPie = React.lazy(() =>import('../common/components/teamSideRatingPie').then(module => ({default: module.TeamSideRatingPie})));
const PlayerRatingTrendGraph = React.lazy(() =>import('../common/components/playerRatingGraph').then(module => ({default: module.PlayerRatingTrendGraph})));
const KillsAssistsDeathsPie = React.lazy(() =>import('../common/components/killAssetDeathPie').then(module => ({default: module.KillsAssistsDeathsPie})));


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
		Recruit: "text-red-400",
		Prospect: "text-orange-400",
		Contender: "text-yellow-400",
		Challenger: "text-green-400",
		Elite: "text-blue-400",
		Premier: "text-purple-400",
	}

	const tabs = [
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
		{
			name: "Free Agent Player League",
			disabled: true
		}
	]


	return (
        <Container>
            <div className="vh-100 flex">
                <div className="w-2/12 bg-gray-300 text-center">
                    <div style={{writingMode: "vertical-lr", textOrientation: "upright"}} className="flex m-auto px-12 py-4 w-full font-extrabold uppercase text-center text-purple-950 text-6xl">
                        {currentPlayer.name}
                    </div>
                    <div className="text-purple-950">
                        {currentPlayer?.team?.franchise.prefix} | {currentPlayer.tier.name}
                    </div>
                    <div className="m-6">
                        <img src={franchiseImages[currentPlayer?.team?.franchise.prefix ?? ""]} alt={currentPlayer?.name} className="w-full" />
                    </div>
                </div>
                <div className="w-8 bg-yellow-500">

                </div>
                <div className="w-9/12 bg-midnight2">
                    <div className="flex flex-col m-8">
                        <div className="text-3xl font-bold text-white tracking-widest">
                            {currentPlayer.role ?? "RIFLER"}: {String(playerRatingIndex + 1).concat(nth(playerRatingIndex + 1))} Overall
                        </div>
                        <div className="m-4">
                            SEASON {seasonAndMatchType.season} STATS
                        </div>
						<div className="flex gird grid-cols-4 gap-24 text-xl">
							<div className="text-center">
								<div>RATING</div>
								<div>.6</div>
							</div>
							<div className="text-center">
								<div>ADR</div>
								<div>.6</div>
							</div>
							<div className="text-center">
								<div>IMPACT</div>
								<div>.6</div>
							</div>
							<div className="text-center">
								<div>EF</div>
								<div>.6</div>
							</div>
						</div>
						<div className="flex gird grid-cols-4 gap-24 text-xl">
							<div className="text-center">
								<div>CT RATING</div>
								<div>.6</div>
							</div>
							<div className="text-center">
								<div>T RATING</div>
								<div>.6</div>
							</div>
							<div className="text-center">
								<div>KAST</div>
								<div>.6</div>
							</div>
							<div className="text-center">
								<div>UTIL DMG</div>
								<div>.6</div>
							</div>
						</div>
						<div>
							<Containers.StandardContentBox>
								<PlayerRatings player={currentPlayer} stats={currentPlayerStats!} />
							</Containers.StandardContentBox>
						</div>
						<div>
							ACCOLADES
							<ul>
								<li>Can touch their toes!</li>
								<li>Throws Util really good</li>
								<li>Eats Breakfast usually</li>
								<li>MVP once</li>
							</ul>
						</div>
                    </div>
                </div>
            </div>
        </Container>
	);
}
