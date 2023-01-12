import * as React from 'react';
import "./index.css"
import { Router } from "./Router";
import { DataContextProvider } from './DataContext';
import { Header } from './header-nav/header';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Header />
      <QueryClientProvider client={queryClient}>
        <DataContextProvider >
          <Router />
        </DataContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
