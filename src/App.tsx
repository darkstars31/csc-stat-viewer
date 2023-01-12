import * as React from 'react';
import "./index.css"
import { Router } from "./Router";
import { DataBootStrap } from './data-bootstrap';
import { Header } from './header-nav/header';

function App() {
  return (
    <>
        {/* <img src={`data:image/svg+xml;utf-8,${logo}`} className="App-logo" alt="logo" /> */}
      <Header />
      <DataBootStrap />
      <Router />
    </>
  );
}

export default App;
