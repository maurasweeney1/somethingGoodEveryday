import MainPage from "./Home.js";
import AddPostsPage from "./AddPosts.js";
import EditPostPage from "./editPosts.js";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "./Register.js";
import SignInPage from "./SignIn.js";
import LandingPage from "./Landing.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [lightMode, setLightMode] = useState(true);
  const [authToken, setAuthTokenState] = useState(
    localStorage.getItem("authToken") || null
  );

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) return;

      try {
        const response = await fetch("http://localhost:5001/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
      // If there's an image file, convert it to base64
      let imageBase64 = null;
      if (newPost.image) {
        imageBase64 = await convertImageToBase64(newPost.image);
      }

      // Prepare post data
      const postData = {
        ...newPost,
        image: imageBase64,
      };

      // Send post to server
      const response = await fetch("http://localhost:5001/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const savedPost = await response.json();

      // Update local state with the saved post from server
      setPosts([...posts, savedPost]);

      return savedPost;
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    }
  };

  const updatePost = async (postId, updatedPost) => {
    try {
      // If there's a new image file, convert it to base64
      let imageBase64 = null;
      if (updatedPost.image instanceof File) {
        imageBase64 = await convertImageToBase64(updatedPost.image);
        updatedPost.image = imageBase64;
      }

      // Send update to server
      const response = await fetch(`http://localhost:5001/edit/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedData = await response.json();

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedData : post))
      );

      return updatedData;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  // Helper function to convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const setAuthToken = (token) => {
    if (token) {
      // Save token to local storage
      localStorage.setItem("authToken", token);
    } else {
      // Remove token from local storage on logout
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
          element={<AddPostsPage addNewPost={addNewPost} />}
        />
        {/* edit post page */}
        <Route
          path="/edit/:postId"
          element={<EditPostPage posts={posts} updatePost={updatePost} />}
        />
        <Route
          path="/register"
          element={<RegisterPage setAuthToken={setAuthToken} />}
        />
        <Route
          path="/signIn"
          element={<SignInPage setAuthToken={setAuthToken} />}
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
