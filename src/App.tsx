// src/App.tsx
import React from "react";
// import WaitingPage from './routes/WaitingPage';
import LandingPage from "./routes/LandingPage";
import SendPage from "./routes/Send";
import { HashRouter, Routes, Route } from "react-router-dom";
import { StateProvider } from "./StateContext";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#FACC15',
          100: '#FACC1500',
          200: '#FACC15',
          300: '#FACC15',
          400: '#FACC15',
          500: '#FACC15',
          600: '#FACC15',
          700: '#FACC15',
          800: '#FACC15',
          900: '#FACC15',
        },
      },
    },
  },

});

const App: React.FC = () => {
  return (
    <div className="App">
      <CssVarsProvider theme={theme}>
        <StateProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/send" element={<SendPage />} />
            </Routes>
          </HashRouter>
        </StateProvider>
      </CssVarsProvider>
    </div>
  );
};

export default App;
