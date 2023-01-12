import * as React from 'react';
import { Router as Wouter, Route } from 'wouter';
import { Container } from './common/components/container';
import { Dashboard } from './pages/dashboard';
import { Teams } from './pages/teams';
import { Players } from './pages/players';
import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';
import { useWindowLocation } from './common/hooks/window';
  
const routes = [
  { path: `/`, component: () => <Dashboard /> },
  { path: `/teams`, component: () => <Teams /> },
  { path: `/players`, component: () => <Players /> },
  { path: `/players/:tier/:id`, component: () => <Player /> },
  { path: `/leaderboards`, component: () => <LeaderBoards /> },
  { path: `/about`, component: () => <Container><div>About</div></Container> },
];

export function Router(){
  const windowLocation = useWindowLocation();
  const BASE_ROUTE = windowLocation.href.includes("github.io") ? "/csc-stat-viewer" : "";

  return (
    <Wouter base={BASE_ROUTE}>
      { routes.map( route => <Route key={`route${route.path}`} { ...route} /> ) }
    </Wouter>
  );
}