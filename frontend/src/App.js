import MainPage from "./Main.js";
import AddPostsPage from "./AddPosts.js";
import EditPostPage from "./editPosts.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [lightMode, setLightMode] = useState(true);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5001/");
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

  return (
    <BrowserRouter>
      <Routes>
        {/* main page */}
        <Route
          path="/"
          element={
            <MainPage
              setPosts={setPosts}
              posts={posts}
              lightMode={lightMode}
              updateColorTheme={updateColorTheme}
            />
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
