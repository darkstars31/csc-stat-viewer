import * as React from 'react';
import { Router as Wouter, Route, Switch, useLocation } from 'wouter';
import { Container } from './common/components/container';
import { Home } from './pages/home';
import { Franchises } from './pages/franchises';
import { Players } from './pages/players';
import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';
import { Header } from './header-nav/header';
import { TeamBuilder } from './pages/teamBuilder';
import { Playground } from './pages/playground';
import { useDataContext } from './DataContext';
import { Charts } from './pages/charts';
import { Team } from './pages/team';
import { Franchise } from './pages/franchise';
import { TeamStandings } from './pages/teamStandings';
import { ProgressBar } from './common/components/progress';
import { useLocalStorage } from './common/hooks/localStorage';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ReactGA from 'react-ga4';
import { ErrorBoundary } from './common/components/errorBoundary';

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
];

export function Router(){
  const { loading } = useDataContext();
  //const env : string = process.env.NODE_ENV!;
  const BASE_ROUTE = "";
  const [ closeNotificationBanner, setCloseNotificationBanner ] = useLocalStorage("closeNotificationBanner", "");
  const [ location ] = useLocation();
  
  ReactGA.send({ hitType: "pageview", page: location, title: 'Page View' });

  return (
    <Wouter base={BASE_ROUTE}>
        <div className="sticky top-0 z-10">
          <Header />
          { loading.isLoadingCscPlayers && <ProgressBar />}
        </div>
        <div className="overflow-auto">
        { !closeNotificationBanner && 
            <button className='w-full h-8 bg-teal-600 text-center' onClick={() => setCloseNotificationBanner("true")}>
              analytikill.com is the new home of CSC Stat Viewer. 
              <AiOutlineCloseCircle className='float-right mr-4' size="1.5em"/>
            </button>
          }
          <ErrorBoundary>
            <Switch>
              { routes.map( route => <Route key={`route${route.path}`} { ...route} /> ) }
              <Route key="404, Page not found." component={ () => <Container><h1>404</h1></Container>} />
            </Switch>
          </ErrorBoundary>
        </div>
    </Wouter>
  );
}