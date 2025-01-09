import MainPage from "./Home.js";
import AddPostsPage from "./AddPosts.js";
import EditPostPage from "./editPosts.js";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "./Register.js";
import SignInPage from "./SignIn.js";
import LandingPage from "./Landing.js";
import config from "./config";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [lightMode, setLightMode] = useState(true);
  const [authToken, setAuthTokenState] = useState(
    localStorage.getItem("authToken") || null
  );
  const [userId, setUserId] = useState(null);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!authToken) {
        console.log("no token");
        return;
      }

      try {
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(`${config.apiUrl}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log("No valid token, please log in");
            return;
          }
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [authToken]);

  const updateColorTheme = (isLightMode) => {
    setLightMode(isLightMode);
    if (isLightMode) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      document.querySelector("header").classList.remove("dark-mode");
      document.querySelector("header").classList.add("light-mode");
      document.querySelector("footer").classList.remove("dark-mode");
      document.querySelector("footer").classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      document.querySelector("header").classList.remove("light-mode");
      document.querySelector("header").classList.add("dark-mode");
      document.querySelector("footer").classList.remove("light-mode");
      document.querySelector("footer").classList.add("dark-mode");
    }
  };

  const addNewPost = async (newPost) => {
    try {
      const formData = new FormData();

      // Append all text fields
      formData.append("category", newPost.category);
      formData.append("title", newPost.title);
      formData.append("text", newPost.text);
      formData.append("link", newPost.link);
      formData.append("datePosted", newPost.datePosted);

      // Append image file if exists
      if (newPost.image instanceof File) {
        formData.append("image", newPost.image);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`${config.apiUrl}/add-post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Server response:", errorBody);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }
      const savedPost = await response.json();

      setPosts([...posts, savedPost]);
      return savedPost;
    } catch (error) {
      console.error("Detailed error adding post:", error);
      throw error;
    }
  };

  const updatePost = async (postId, updatedPost, token) => {
    try {
      const response = await fetch(`${config.apiUrl}/edit/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updatedPost,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const savedPost = await response.json();

      setPosts(posts.map((post) => (post._id === postId ? savedPost : post)));

      return savedPost;
    } catch (error) {
      console.error("Detailed error updating post:", error);
      throw error;
    }
  };

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
    setAuthTokenState(token);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route path="/" element={<LandingPage />} />
        {/* main page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainPage
                setPosts={setPosts}
                posts={posts}
                lightMode={lightMode}
                updateColorTheme={updateColorTheme}
              />
            </ProtectedRoute>
          }
        />
        {/* add post page */}
        <Route
          path="/add-post"
          element={<AddPostsPage addNewPost={addNewPost} userId={userId} />}
        />
        {/* edit post page */}
        <Route
          path="/edit/:postId"
          element={
            <EditPostPage
              posts={posts}
              updatePost={updatePost}
              token={authToken}
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/signIn"
          element={
            <SignInPage setAuthToken={setAuthToken} setUserId={setUserId} />
          }
        />
        {/* url not found */}
        <Route
          path="*"
          element={
            <>
              <h1>404 Error- Not Found</h1>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
