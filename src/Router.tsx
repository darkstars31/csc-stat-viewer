import * as React from 'react';
import {
    Outlet,
    createReactRouter,
    createRouteConfig,
  } from '@tanstack/react-router'
  import { Container } from './common/container';
  import { Header } from './header-nav/header';
  import { Players } from './pages/players';
  import { Player } from './pages/player';
import { LeaderBoards } from './pages/leaderboards';

const rootRoute = createRouteConfig({
    component: () =>
    <>
        <Header />    
        <Outlet />
    </>
  })
  
  const routes = [
    { path: `/`, component: () => <Container><div>Home</div></Container> },
    { path: `/teams`, component: () => <Container><div>Teams</div></Container> },
    { path: `/players`, component: () => <Players request={window.combinePlayerRequest} /> },
    { path: `/player`, component: () => <Player request={window.combinePlayerRequest} /> },
    { path: `/leaderboards`, component: () => <LeaderBoards request={window.combinePlayerRequest}/> },
    { path: `/about`, component: () => <Container><div>About</div></Container> },
  ]
  
  const routeConfig = rootRoute.addChildren(routes.map( route => rootRoute.createRoute( route )));
  export const router = createReactRouter({ routeConfig });