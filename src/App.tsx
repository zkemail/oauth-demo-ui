// src/App.tsx
import React from 'react';
import LandingPage from './routes/LandingPage';
import WaitingPage from './routes/WaitingPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { StateProvider } from './StateContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/waiting",
    element: <WaitingPage />
  }
]);

const App: React.FC = () => {
  return (
    <div className="App">
      <StateProvider>
        <RouterProvider router={router} />
      </StateProvider>
    </div>
  );
}

export default App;