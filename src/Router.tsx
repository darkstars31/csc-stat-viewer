import * as React from 'react';
import { Router as Wouter, Route, Switch } from 'wouter';
import { Container } from './common/components/container';
import { Dashboard } from './pages/dashboard';
import { Teams } from './pages/teams';
import { Players } from './pages/players';
import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';
import { Header } from './header-nav/header';
import { PlayerCompare } from './pages/compare';
  
const routes = [
  { path: `/`, component: () => <Dashboard /> },
  { path: `/teams`, component: () => <Teams /> },
  { path: `/players`, component: () => <Players /> },
  { path: `/players/:tier/:id`, component: () => <Player /> },
  { path: `/players/compare`, component: () => <PlayerCompare /> },
  { path: `/leaderboards`, component: () => <LeaderBoards /> },
  { path: `/about`, component: () => <Container><div>About</div></Container> },
  { path: `/playground`, component: () => <Container><div>Play Ground</div></Container> },
];

export function Router(){
  const env : string = process.env.NODE_ENV!;
  const BASE_ROUTE = env.includes("production") ? "/csc-stat-viewer" : "";

  return (
    <Wouter base={BASE_ROUTE}>
      <div className="sticky top-0">
        <Header />
      </div>
      <div className="overflow-auto">
        <Switch>
          { routes.map( route => <Route key={`route${route.path}`} { ...route} /> ) }
          <Route key="404, Page not found." component={ () => <Container><h1>404</h1></Container>} />
        </Switch>
      </div>
    </Wouter>
  );
}