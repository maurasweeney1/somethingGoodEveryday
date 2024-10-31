// TODO: edit posts

import logo from "./logo.png";
import likeImage from "./not-liked.svg";
import likedImage from "./like.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage({ setPosts, posts, lightMode, updateColorTheme }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const goToAddPostPage = () => {
    navigate("/add-post");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.searchInput.value.toLowerCase();
    setSearchQuery(query);
  };

  const searchFilteredPosts = posts.filter((post) => {
    if (!searchQuery) {
      // If not searching return all posts
      return true;
    }
    return (
      post.title.toLowerCase().includes(searchQuery) ||
      post.category.toLowerCase().includes(searchQuery) ||
      (post.text && post.text.toLowerCase().includes(searchQuery))
    );
  });

  // TODO: all of this
  // filter on date posted, category
  const updateFilter = () => {};

  const handleLike = (index) => {
    const updatedPosts = posts.map((post, i) => {
      if (i === index) {
        const newLikes = post.liked ? post.likes : post.likes + 1;
        return { ...post, likes: newLikes, liked: true };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <form onSubmit={handleSearch} className="search-bar">
            <input
              style={{ width: "300px" }}
              type="text"
              name="searchInput"
              placeholder="Search..."
              aria-label="Search"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div>
          {/* TODO: make checkboxes instead */}
          <button id="filter-button" onClick={() => updateFilter()}>
            Filter Posts
          </button>
        </div>
        <div>
          {/* light/dark mode */}
          <span>Color Theme: {lightMode ? "Light Mode " : "Dark Mode "}</span>
          {/* Button to toggle Light/Dark Mode */}
          <button
            id="color-theme-button"
            onClick={() => updateColorTheme(!lightMode)}
          >
            {lightMode ? "Dark Mode " : "Light Mode "}
          </button>
        </div>
      </header>
      <main>
        {/* view posts */}
        <section className="post-grid">
          {/* add post */}
          <div className="post-panel">
            <h1>Add A Post</h1>
            <button className="add-post-button" onClick={goToAddPostPage}>
              +
            </button>
          </div>

          {posts.length > 0 ? (
            searchFilteredPosts.map((post, index) => (
              <div key={index} className="post-panel">
                <h1 className="panel-header">{post.title}</h1>
                <h3>{post.category}</h3>
                {post.text && post.text.trim() !== "" && <p>{post.text}</p>}
                {post.image && (
                  <img
                    src={URL.createObjectURL(post.image)}
                    alt="Post"
                    style={{ width: "150px", height: "auto" }}
                  />
                )}
                {post.link && post.link.trim() !== "" && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    {post.link}
                  </a>
                )}
                <button
                  onClick={() => handleLike(index)}
                  style={{
                    border: "none",
                    padding: 0,
                    backgroundColor: "white",
                  }}
                >
                  <p>Likes: {post.likes}</p>
                  <img
                    src={post.liked ? likedImage : likeImage}
                    alt="Like Button"
                    style={{
                      width: "20px",
                      height: "20px",
                      padding: "10px",
                    }}
                  />
                </button>
                <p>
                  Posted on: {new Date(post.datePosted).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </section>
      </main>
    </div>
  );
}

export default MainPage;
