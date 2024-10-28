import logo from './logo.png';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useState } from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={
            <>
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
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
