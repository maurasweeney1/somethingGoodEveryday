import MainPage from './Main.js'
import AddPostsPage from './AddPosts.js'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
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

  const addNewPost = (newPost) => {
    setPosts([...posts, newPost]); 
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* main page */}
        <Route 
          path="/" 
          element={<MainPage posts={posts} lightMode={lightMode} updateColorTheme={updateColorTheme} />}
          />
        {/* post page */}
        <Route 
          path="/add-post" 
          element={<AddPostsPage addNewPost={addNewPost} />}
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