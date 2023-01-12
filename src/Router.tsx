import * as React from 'react';
import { Router as Wouter, Route } from 'wouter';
import { Container } from './common/container';
import { Teams } from './pages/teams';
import { Players } from './pages/players';
import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';
  
const routes = [
  { path: `/`, component: () => <Container><div>Home</div></Container> },
  { path: `/teams`, component: () => <Teams request={window.combinePlayerRequest} /> },
  { path: `/players`, component: () => <Players request={window.combinePlayerRequest} /> },
  { path: `/players/player/:tier/:id`, component: () => <Player request={window.combinePlayerRequest} /> },
  { path: `/leaderboards`, component: () => <LeaderBoards request={window.combinePlayerRequest}/> },
  { path: `/about`, component: () => <Container><div>About</div></Container> },
];

export function Router(){
  const BASE_ROUTE = window.location.href.includes("github.io") ? "/csc-stat-viewer" : "";
  return (
    <Wouter base={BASE_ROUTE}>
      { routes.map( route => <Route { ...route} /> ) }
    </Wouter>
  );
}