import * as React from 'react';
import { Router as Wouter, Route, Switch, useLocation } from 'wouter';
import { Container } from './common/components/container';
import { Home } from './pages/home';
import { Franchises } from './pages/franchises';
import { Players } from './pages/players';
import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';
import { TeamBuilder } from './pages/teamBuilder';
import { Playground } from './pages/playground';
import { useDataContext } from './DataContext';
import { Charts } from './pages/charts';
import { Team } from './pages/team';
import { Franchise } from './pages/franchise';
import { TeamStandings } from './pages/teamStandings';
import { ProgressBar } from './common/components/progress';
import ReactGA from 'react-ga4';
import { ErrorBoundary } from './common/components/errorBoundary';
import { LoginCallBack } from './pages/cb';
import { discordFetchUser } from './dao/oAuth';
import cookie from 'js-cookie';

const routes = [
  { path: `/`, component: () => <Charts /> },
  { path: `/charts`, component: () => <Charts />},
  { path: `/standings`, component: () => <TeamStandings />},
  { path: `/franchises`, component: () => <Franchises /> },
  { path: `/franchises/:franchise`, component: () => <Franchise /> },
  { path: `/franchises/:franchise/:team`, component: () => <Team />},
  { path: `/players`, component: () => <Players /> },
  { path: `/players/:tier/:id`, component: () => <Player /> },
  { path: `/team-builder`, component: () => <TeamBuilder /> },
  { path: `/leaderboards`, component: () => <LeaderBoards /> },
  { path: `/about`, component: () => <Home /> },
  { path: `/playground`, component: () => <Playground /> },
  { path: `/cb`, component: () => <LoginCallBack /> }
];

export function Router(){
  const { loading, discordUser, setDiscordUser } = useDataContext();
  const BASE_ROUTE = "";
  const [ location ] = useLocation();

  React.useEffect( () => {
    const fetchUser = async () => {
		const accessToken = cookie.get( "access_token" );
			if( accessToken && discordUser === null ){
				const user = await discordFetchUser( accessToken );
				if( user ){
					setDiscordUser( user );
				}
		  }
    }

	fetchUser();
  }, [ discordUser, setDiscordUser] );
  
  ReactGA.send({ hitType: "pageview", page: location, title: 'Page View' });

  return (
    <>
      { loading.isLoadingCscPlayers && <ProgressBar />}
      <Wouter base={BASE_ROUTE}>
        <div>
            <ErrorBoundary>
              <Switch>
                { routes.map( route => <Route key={`route${route.path}`} { ...route} /> ) }
                <Route key="404, Page not found." component={ () => <Container><h1>404</h1></Container>} />
              </Switch>
            </ErrorBoundary>
          </div>
      </Wouter>
    </>
  );
}