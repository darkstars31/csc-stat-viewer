import * as React from "react";
import { Router as Wouter, Route, Switch, useLocation, Link } from "wouter";
import { Container } from "./common/components/container";
import {
	Admin,
	About,
	LoginCallBack,
	Charts,
	LeaderBoards,
	Franchises,
	Franchise,
	FranchiseManagement,
	Players,
	Player,
	Profile,
	Playground,
	Team,
	PlayerComparison,
	ExportData,
	TeamStandings,
	Servers,
} from "./pages";
import { ArticleRoutes } from "./pages/articles/routes";
import { useDataContext } from "./DataContext";
import { ProgressBar } from "./common/components/progress";
import ReactGA from "react-ga4";
import { ErrorBoundary } from "./common/components/errorBoundary";
import { discordFetchUser } from "./dao/oAuth";
import cookie from "js-cookie";
import { useLocalStorage } from "./common/hooks/localStorage";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEnableFeature } from "./common/hooks/enableFeature";
import { useFetchGithubRepoBranchJson } from "./dao/githubRepo";

export function Router() {
	const [closeNotificationBanner, setCloseNotificationBanner] = useLocalStorage(
		"closeNotificationBannerRequestAServer",
		"",
	);
	const [ newVersionBanner, setNewVersionBanner] = React.useState<{ isOpen: boolean, commitHash: string | undefined }>({ isOpen: false, commitHash: undefined });
	const { data: githubBranch, isLoading: isLoadingGithubBranch } = useFetchGithubRepoBranchJson();
	const { loading, discordUser, setDiscordUser, seasonAndMatchType, loggedinUser, setSeasonAndMatchType } = useDataContext();
	const BASE_ROUTE = "";
	const [location] = useLocation();
	const enableFeature = useEnableFeature("canRequestServers");

	React.useEffect(() => {
		if(!isLoadingGithubBranch && newVersionBanner.commitHash === undefined ) {
			setNewVersionBanner({ ...newVersionBanner, commitHash: githubBranch?.commit?.sha });
		} 
		if( newVersionBanner.commitHash !== githubBranch?.commit?.sha && newVersionBanner.commitHash !== undefined) {
			setNewVersionBanner(  perv => ({ ...perv, isOpen: true }));
		}
	}, [ isLoadingGithubBranch, githubBranch ]);

	// const Player = React.lazy(() => import("./pages/player").then(module => { return { default: module.Player } }) );
	// const Franchises = React.lazy(() => import("./pages/franchises").then(module => { return { default: module.Franchises } }) );
	// const Franchise = React.lazy(() => import("./pages/franchise").then(module => { return { default: module.Franchise } }) );
	// const Team = React.lazy(() => import("./pages/team").then(module => { return { default: module.Team } }) );
	// const LeaderBoards = React.lazy(() => import("./pages/leaderboards").then(module => { return { default: module.LeaderBoards } }) );
	// const TeamStandings = React.lazy(() => import("./pages/teamStandings").then(module => { return { default: module.TeamStandings } }) );
	// const PlayerComparison = React.lazy(() => import("./pages/playerComparison").then(module => { return { default: module.PlayerComparison } }) );
	// const Charts = React.lazy(() => import("./pages/charts").then(module => { return { default: module.Charts } }) );
	// const About = React.lazy(() => import("./pages/about").then(module => { return { default: module.About } }) );

	const routes = [
		{ path: `/`, component: () => <Players /> },
		{ path: `/articles`, component: () => <ArticleRoutes base={"articles"} /> },
		{ path: `/about`, component: () => <About /> },
		{ path: `/cb`, component: () => <LoginCallBack /> },
		{ path: `/charts`, component: () => <Charts /> },
		{ path: `/export`, component: () => <ExportData /> },
		{ path: `/franchises`, component: () => <Franchises /> },
		{ path: `/franchises/:franchise`, component: () => <Franchise /> },
		{ path: `/franchises/:franchise/:team`, component: () => <Team /> },
		{ path: `/players`, component: () => <Players /> },
		{ path: `/players/:id`, component: () => <Player /> },
		{ path: `/players/:tier/:id`, component: () => <Player /> }, // TODO: Remove route when no longer needed
		{ path: `/player-compare`, component: () => <PlayerComparison /> },
		{ path: `/leaderboards`, component: () => <LeaderBoards /> },
		{ path: `/playground`, component: () => <Playground /> },
		{ path: `/profile`, component: () => <Profile /> },
		{ path: `/standings`, component: () => <TeamStandings /> },
		{ path: `/servers`, component: () => <Servers /> },

		{ path: `/admin`, component: () => <Admin /> },
		{ path: `/franchiseManagement`, component: () => <FranchiseManagement /> },
	];

	React.useEffect(() => {
		const fetchUser = async () => {
			const accessToken = cookie.get("access_token");
			if (accessToken && discordUser === null) {
				const user = await discordFetchUser(accessToken);
				if (user) {
					setDiscordUser(user);
				}
			}
		};

		fetchUser();
	}, [discordUser, setDiscordUser]);

	let ga: Record<string, string> = { hitType: "pageview", page: location, title: "Page View" };
	if( loggedinUser?.discordId && loggedinUser?.name ) {
		ga = { ...ga, discordId: loggedinUser.discordId, name: loggedinUser.name };
	}

	ReactGA.send(ga);

	return (
		<>
			{loading.isLoadingCscPlayers && <ProgressBar />}
			<Wouter base={BASE_ROUTE}>
				<div>
					{newVersionBanner.isOpen && (
						<button
							className="w-full h-8 bg-teal-600 text-center"
							onClick={() => setNewVersionBanner({ ...newVersionBanner, isOpen: false })}
						>
							A new version of AnalytiKill is available. 
							<a className="px-1 text-blue-600 underline" onClick={() => window.location.reload()}>Click here to update</a> or refresh the page!
							<AiOutlineCloseCircle className="float-right mr-4" size="1.5em" />
						</button>
					)}
					{!closeNotificationBanner && enableFeature && (
						<button
							className="w-full h-8 bg-teal-600 text-center"
							onClick={() => setCloseNotificationBanner("true")}
						>
							Need a retake server to warm-up on match days? Request a server (beta){" "}
							<Link className="hover:underline text-white font-bold hover:text-sky-400" to="/servers">
								here.
							</Link>
							<AiOutlineCloseCircle className="float-right mr-4" size="1.5em" />
						</button>
					)}
					<ErrorBoundary>
						<ArticleRoutes base={`/articles`} />						
							<Switch>					
								{routes.map(route => {									
										return <Route key={`route${route.path}`} {...route} />
									})
								}							
								<Route
									key="404, Page not found."
									component={() => (
										<Container>
											<h1>404</h1>
										</Container>
									)}
								/>				
							</Switch>
					</ErrorBoundary>
				</div>
			</Wouter>
		</>
	);
}
