import * as React from "react";
import { Router as Wouter, Route, Switch, useLocation, Link, useSearch } from "wouter";
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
	GraphicsPlayer,
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
import { useDataContext } from "./DataContext";
import { ProgressBar } from "./common/components/progress";
import { FullWidthBanner } from "./common/components/fullWidthBanner";
import ReactGA from "react-ga4";
import { ErrorBoundary } from "./common/components/errorBoundary";
import { discordFetchUser } from "./dao/oAuth";
import cookie from "js-cookie";
import { useEnableFeature } from "./common/hooks/enableFeature";
import { useFetchGithubRepoBranchJson } from "./dao/githubRepo";
import { Posts } from "./pages/articles/posts";
import { Post } from "./pages/articles/post";
import { CreatePost } from "./pages/articles/create";
import { Submitted } from "./pages/articles/submitted";
import { Pickems } from "./pages/pickems";
import { GMPanel } from "./pages/gmPanel";
import { Draft } from "./pages/draft";
import { PickemsExplorer } from "./pages/pickems/PickemsExplorer";
import { TeamBuilder } from "./pages/teamBuilder";

export function Router() {

	const { isLoading, discordUser, setDiscordUser, loggedinUser, isOffSeason } = useDataContext();
	const [baselineCommitHash, setBaselineCommitHash] = React.useState<string | undefined>(undefined);
	const { data: githubBranch, isLoading: isLoadingGithubBranch } = useFetchGithubRepoBranchJson();
	const BASE_ROUTE = "";
	const [location] = useLocation();
	const params = useSearch();
	const enableFeature = useEnableFeature("canRequestServers");

	React.useEffect(() => {
		if (!isLoadingGithubBranch && baselineCommitHash === undefined) {
			setBaselineCommitHash(githubBranch?.commit?.sha);
		}
	}, [baselineCommitHash, githubBranch?.commit?.sha, isLoadingGithubBranch]);

	// const Player = React.lazy(() => import("./pages/player").then(module => { return { default: module.Player } }) );
	// const Franchises = React.lazy(() => import("./pages/franchises").then(module => { return { default: module.Franchises } }) );
	// const Franchise = React.lazy(() => import("./pages/franchise").then(module => { return { default: module.Franchise } }) );
	// const Team = React.lazy(() => import("./pages/team").then(module => { return { default: module.Team } }) );
	// const LeaderBoards = React.lazy(() => import("./pages/leaderboards").then(module => { return { default: module.LeaderBoards } }) );
	// const TeamStandings = React.lazy(() => import("./pages/teamStandings").then(module => { return { default: module.TeamStandings } }) );
	// const PlayerComparison = React.lazy(() => import("./pages/playerComparison").then(module => { return { default: module.PlayerComparison } }) );
	// const Charts = React.lazy(() => import("./pages/charts").then(module => { return { default: module.Charts } }) );
	// const About = React.lazy(() => import("./pages/about").then(module => { return { default: module.About } }) );

	const articleRoutes = [
		{ path: `/articles`, component: () => <Posts /> },
		{ path: `/articles/create`, component: () => <CreatePost /> },
		{ path: `/articles/submitted`, component: () => <Submitted /> },
		{ path: `/articles/:id`, component: () => <Post /> },
	]

	const routes = [
		{ path: `/`, component: () => <Players /> },
		{ path: `/about`, component: () => <About /> },
		{ path: `/cb`, component: () => <LoginCallBack /> },
		{ path: `/charts`, component: () => <Charts /> },
		{ path: `/export`, component: () => <ExportData /> },
		{ path: `/franchises`, component: () => <Franchises /> },
		{ path: `/franchises/:franchise`, component: () => <Franchise /> },
		{ path: `/franchises/:franchise/:team`, component: () => <Team /> },
		{ path: `/graphics/players/:id`, component: () => <GraphicsPlayer /> },
		{ path: `/players`, component: () => <Players /> },
		{ path: `/players/:id`, component: () => <Player /> },
		{ path: `/player-compare`, component: () => <PlayerComparison /> },
		{ path: `/team-builder`, component: () => <TeamBuilder /> },
		{ path: `/leaderboards`, component: () => <LeaderBoards /> },
		{ path: `/playground`, component: () => <Playground /> },
		{ path: `/profile`, component: () => <Profile /> },
		{ path: `/standings`, component: () => <TeamStandings /> },
		{ path: `/servers`, component: () => <Servers /> },
		{ path: `/pickems`, component: () => <Pickems /> },
		{ path: `/pickems/explorer`, component: () => <PickemsExplorer /> },
		{ path: `/pickems/explorer/:id`, component: () => <PickemsExplorer /> },

		{ path: `/draft`, component: () => <Draft /> },
		{ path: `/admin`, component: () => <Admin /> },
		{ path: `/gm`, component: () => <GMPanel /> },
		{ path: `/franchiseManagement`, component: () => <FranchiseManagement /> },
	].concat(articleRoutes);

	React.useEffect(() => {
		const fetchUser = async () => {
			// const refreshtoken = cookie.get("refresh_token");
			// if (refreshtoken) {
			// 	await discordRefreshToken();
			// }
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

	React.useEffect(() => {
		document.title = `${location.split('/').at(-1)}${params ? `?${params}` : ""} - AnalytiKill`;
		ReactGA.send({
			hitType: "pageview",
			page: `${location}${params ? `?${params}` : ""}`,
			title: document.title,
		});		
	}, [location, params]);

	let ga: Record<string, string> = { hitType: "pageview", page: location, title: document.title };
	if( loggedinUser?.discordId && loggedinUser?.name ) {
		ga = { ...ga, discordId: loggedinUser.discordId, user_id: loggedinUser.name };
		ReactGA.gtag('config',`G-EZ2R1EHT34`, { discordId: loggedinUser?.discordId, user: loggedinUser?.name });
	}

	const hasNewVersion = Boolean(
		baselineCommitHash && githubBranch?.commit?.sha && baselineCommitHash !== githubBranch.commit.sha,
	);

	return (
		<>
			{isLoading && <ProgressBar />}
			<Wouter base={BASE_ROUTE}>
				<FullWidthBanner show={isOffSeason}>
					Looks like it's the off-season! Check back when the season starts for the latest stats and updates.
				</FullWidthBanner>
				<FullWidthBanner show={hasNewVersion} resetKey={githubBranch?.commit?.sha}>
					A new version of AnalytiKill is available.
					<button
						type="button"
						className="px-1 text-blue-200 underline hover:text-white"
						onClick={() => window.location.reload()}
					>
						Click here to update
					</button>
					or refresh the page!
				</FullWidthBanner>
				<FullWidthBanner show={enableFeature} persistKey="closeNotificationBannerRequestAServer">
					Need a retake server to warm-up on match days? Request a server (beta){" "}
					<Link className="font-bold text-white underline hover:text-sky-200" to="/servers">
						here.
					</Link>
				</FullWidthBanner>
				<ErrorBoundary>					
					<Switch>
						{routes.map(route => <Route key={`route${route.path}`} {...route} />)}
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
			</Wouter>
		</>
	);
}
