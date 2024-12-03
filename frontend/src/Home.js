import logo from "./logo.png";
import likeImage from "./not-liked.svg";
import likedImage from "./like.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage({ setPosts, posts, lightMode, updateColorTheme }) {
  const userId = localStorage.getItem("userId");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState(""); // date posted or category
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const goToAddPostPage = () => {
    navigate("/add-post");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.searchInput.value.toLowerCase();
    setSearchQuery(query);
  };

  // for search and filter
  const filteredPosts = posts.filter((post) => {
    // search feature
    const search =
      post.link.toLowerCase().includes(searchQuery) ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.category.toLowerCase().includes(searchQuery) ||
      (post.text && post.text.toLowerCase().includes(searchQuery));

    // filter feature- date posted
    const date = () => {
      if (filterType === "date" && dateRange.startDate && dateRange.endDate) {
        const datePosted = new Date(post.datePosted);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999); // End of the day
        end.setDate(end.getDate() + 1);
        start.setDate(start.getDate() + 1);

        const result = datePosted >= start && datePosted <= end;
        return result;
      }
      return true; // if not date filter, show post
    };

    // filter feature- category
    const category = () => {
      if (filterType === "category" && selectedCategory) {
        return post.category === selectedCategory;
      }
      return true; // if not category filter, show post
    };
    return search && date() && category();
  });

  const handleLike = async (index) => {
    try {
      const postId = posts[index]._id;

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Please sign in to like posts");
        return;
      }

      const response = await fetch("http://localhost:5001/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const updatedPosts = posts.map((post, i) => {
        if (i === index) {
          return {
            ...post,
            likes: data.likes,
            liked: data.liked,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating like:", error);
      const originalPosts = [...posts];
      setPosts(originalPosts);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5001/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <div>
      <header className="App-header">
        <div className="title">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div>
            <h3>Something Good Everyday</h3>
          </div>
        </div>
        <div class="search-container">
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
        <div className="filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Select filter type</option>
            <option value="date">Date Posted</option>
            <option value="category">Category</option>
          </select>

          {/* if they chose date posted */}
          {filterType === "date" && (
            <div>
              <p>
                <label>Start Date: </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </p>
              <p>
                <label>End Date: </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </p>
            </div>
          )}

          {/* if they chose category */}
          {filterType === "category" && (
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="General">General</option>
                <option value="Quotes">Quotes</option>
                <option value="Stories">Stories</option>
                <option value="Advice">Advice</option>
                <option value="Images">Images</option>
              </select>
            </div>
          )}
        </div>

        {/* light/dark mode */}
        <span className="color-theme">
          Color Theme: {lightMode ? "Light Mode " : "Dark Mode "}
        </span>
        <button
          id="color-theme-button"
          onClick={() => updateColorTheme(!lightMode)}
        >
          {lightMode ? "Dark Mode " : "Light Mode "}
        </button>
        <button className="sign-out-button" onClick={() => navigate("/signIn")}>
          Sign Out
        </button>
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
            filteredPosts.map((post, index) => (
              <div key={index} className="post-panel">
                <h1 className="panel-header">{post.title}</h1>
                <h3>{post.category}</h3>
                <p>{post.text && post.text.trim() !== "" && post.text}</p>
                <p>
                  {post.image && (
                    <img
                      src={`http://localhost:5001${post.image}`}
                      alt="Post"
                      style={{ width: "150px", height: "auto" }}
                    />
                  )}
                </p>
                <p>
                  {post.link && post.link.trim() !== "" && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.link}
                    </a>
                  )}
                </p>
                <button
                  className="like-button"
                  onClick={() => handleLike(index)}
                  style={{
                    border: "none",
                    padding: 0,
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
                  Posted on: {new Date(post.datePosted).toLocaleDateString()}{" "}
                </p>
                {/* Only show the Edit/Delete buttons if the current user owns the post */}
                {post.user === userId && (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/edit/${post._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p></p>
          )}
        </section>
      </main>
      <footer>
        <div>
          <p
            className="info-text"
            style={{
              textAlign: "center",
            }}
          >
            Welcome to Something Good Everyday-- a source for positivity and
            inspiration. Add an anonymous post about anything you want (an idea,
            quote, link to a story, image, ...)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
