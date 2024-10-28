import logo from './logo.png';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useState } from 'react';

function App() {

  const [lightMode, setLightMode] = useState(true);

  const updateColorTheme = (isLightMode) => {
    setLightMode(isLightMode);
    if (isLightMode) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      document.querySelector("header").classList.remove("dark-mode");
      document.querySelector("header").classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      document.querySelector("header").classList.remove("light-mode");
      document.querySelector("header").classList.add("dark-mode");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={
            <>
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                  {/* light/dark mode */}
                  <span>
                    Color Theme: {lightMode ? "Light Mode " : "Dark Mode "}
                  </span>
                  {/* Button to toggle Light/Dark Mode */}
                  <button
                    onClick={() => updateColorTheme(!lightMode)}
                  >
                    {lightMode ? "Dark Mode " : "Light Mode "}
                  </button>
                </div>
              </header>
            </>
          }
          />
          {/* post page */}
          <Route
          />
          {/* url not found */}
          <Route 
            path="*"
            element={<><h1>404 Error- Not Found</h1></>}
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
