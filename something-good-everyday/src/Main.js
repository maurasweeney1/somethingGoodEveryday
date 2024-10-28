import logo from './logo.png';
import React from 'react';
import { useNavigate } from 'react-router-dom'

function MainPage({ posts, lightMode, updateColorTheme }) {
    const navigate = useNavigate();
    const goToAddPostPage = () => {
      navigate("/add-post");
    };

    return (
      <div>
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
              posts.map((post, index) => (
                <div key={index} className="post-panel">
                  <h1>{post.title}</h1>
                  {post.text && post.text.trim() !== "" && <p>{post.text}</p>}
                  {post.image && (
                    <img 
                      src={URL.createObjectURL(post.image)} 
                      alt="Post" 
                      style={{ width: '150px', height: 'auto' }}
                      />
                  )}
                  {post.link && post.link.trim() !== "" && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer">
                      {post.link}
                    </a>
                  )}
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