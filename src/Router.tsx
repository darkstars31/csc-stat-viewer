import * as React from 'react';
import { Router as Wouter, Route } from 'wouter';
import { Container } from './common/components/container';
import { Dashboard } from './pages/dashboard';
import { Teams } from './pages/teams';
import { Players } from './pages/players';
import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';
import { Header } from './header-nav/header';
  
const routes = [
  { path: `/`, component: () => <Dashboard /> },
  { path: `/teams`, component: () => <Teams /> },
  { path: `/players`, component: () => <Players /> },
  { path: `/players/:tier/:id`, component: () => <Player /> },
  { path: `/leaderboards`, component: () => <LeaderBoards /> },
  { path: `/about`, component: () => <Container><div>About</div></Container> },
];

export function Router(){
  const env : string = process.env.NODE_ENV!;
  const BASE_ROUTE = env.includes("production") ? "/csc-stat-viewer" : "";

  return (
    <Wouter base={BASE_ROUTE}>
      <Header />
      { routes.map( route => <Route key={`route${route.path}`} { ...route} /> ) }
    </Wouter>
  );
}