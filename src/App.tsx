// src/App.tsx
import React from 'react';
// import WaitingPage from './routes/WaitingPage';
import LandingPage from './routes/LandingPage';
import SendPage from './routes/Send';
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
  // {
  //   path: "/waiting",
  //   element: <WaitingPage />
  // },
  {
    path: "/send",
    element: <SendPage />
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

