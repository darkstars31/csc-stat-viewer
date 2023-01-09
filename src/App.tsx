import * as React from 'react';
import { logo } from './logo';
import "./index.css"
import { router } from "./Router";
import { DataBootStrap } from './data-bootstrap';

import {
  RouterProvider,
} from '@tanstack/react-router'

function App() {
  return (
    <>
        {/* <img src={`data:image/svg+xml;utf-8,${logo}`} className="App-logo" alt="logo" /> */}
      <DataBootStrap />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
