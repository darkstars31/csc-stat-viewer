import * as React from 'react';
import {
    Outlet,
    createReactRouter,
    createRouteConfig,
  } from '@tanstack/react-router'
  import { Container } from './common/container';
  import { Header } from './header-nav/header';
  import { Teams } from './pages/teams';
  import { Players } from './pages/players';
  import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';

const BASE_ROUTE = window.location.href.includes("github") ? "/csc-stat-viewer" : "";

const rootRoute = createRouteConfig({
    component: () =>
    <>
        <Header />    
        <Outlet />
    </>
  })
  
  const routes = [
    { path: `${BASE_ROUTE}/`, component: () => <Container><div>Home</div></Container> },
    { path: `${BASE_ROUTE}/teams`, component: () => <Teams request={window.combinePlayerRequest} /> },
    { path: `${BASE_ROUTE}/players`, component: () => <Players request={window.combinePlayerRequest} /> },
    { path: `${BASE_ROUTE}/player`, component: () => <Player request={window.combinePlayerRequest} /> },
    { path: `${BASE_ROUTE}/leaderboards`, component: () => <LeaderBoards request={window.combinePlayerRequest}/> },
    { path: `${BASE_ROUTE}/about`, component: () => <Container><div>About</div></Container> },
  ]
  
  const routeConfig = rootRoute.addChildren(routes.map( route => rootRoute.createRoute( route )));
  export const router = createReactRouter({ routeConfig });