import logo from './logo.png';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
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

  function MainPage() {
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

  function AddPostPage({ addNewPost }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");

    const handleTitle = (e) => {
      if (e.target.value.length > 0) {
        setTitle(e.target.value);
      }
    };

    const handleText = (e) => {
      if (e.target.value.length <= 200) { // Character limit = 200
        setText(e.target.value);
      }
    };


    const handleImage = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file); 
      }
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      let error = "";
      
      if (title.length === 0) {
        error += "Title is required\n";
      }
      
      if (text.length === 0 && image === null && link === "") {
        error += "Post content is required\n";
      }
      
      if (error) {
        setError(error.trim());
        return; // exit if there are errors
      }
    
      const newPost = {
        title,
        text,
        image,
        link,
      };
    
      addNewPost(newPost);
      navigate("/");
    };
    

    return (
      <div className="new-post">
        <h1>Add a New Post</h1>
        {/* add a post */}
        <form onSubmit={handleSubmit}>
          <p>
            <label>
              <textarea
                value={title}
                onChange={handleTitle}
                rows="2"
                cols="50"
                placeholder="Add title..."
              />
            </label>
          </p>
          <p>
            <label>
              Write Your Post (Max 200 characters):
              <textarea
                value={text}
                onChange={handleText}
                rows="6"
                cols="50"
                placeholder="Type your text here..."
              />
            </label>
          </p>
          <p>
            <label>
            Add a Link: 
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
              />
            </label>
          </p>
          <p>
            <label>
            Add an Image: 
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </p>
          <p>
            {image && <img src={image} alt="Image Preview" style={{ width: '200px', marginTop: '10px' }} />}
          </p>
          <button type="submit">Submit Post</button>

          {error && <p style={{ color: 'red', whiteSpace: 'pre-line' }}>{error}</p>}
        </form>
      </div>
    );
  }


  return (
    <BrowserRouter>
      <Routes>
        {/* main page */}
        <Route 
          path="/" 
          element={<MainPage />}
          />
        {/* post page */}
        <Route 
          path="/add-post" 
          element={<AddPostPage addNewPost={addNewPost} />}
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