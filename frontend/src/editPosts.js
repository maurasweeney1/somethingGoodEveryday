import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./postPage.css";

function EditPostPage({ posts, updatePost, token }) {
  // get postid from the route
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = posts.find((thisPost) => thisPost._id === postId);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5001/edit/${postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const post = await response.json();

        setCategory(post.category);
        setTitle(post.title);
        setText(post.text);
        setLink(post.link);
        setImage(post.image);
      } catch (err) {
        console.error(err);
        setError("Failed to load post data");
      }
    };

    fetchPost();
  }, [postId, token, navigate]);

  const handleTitle = (e) => {
    if (e.target.value.length > 0) {
      setTitle(e.target.value);
    }
  };

  const handleText = (e) => {
    // Character limit = 200
    if (e.target.value.length <= 200) {
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

    const updatedPost = {
      ...post,
      category,
      title,
      text,
      link,
      image,
      datePosted: new Date().toISOString(),
    };

    updatePost(post._id, updatedPost, token);
    navigate("/home");
  };

  return (
    <div>
      <header className="edit-post-header">
        <div>
          <button className="home-button" onClick={() => navigate("/home")}>
            ←
          </button>
        </div>
        <div className="title">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div>
            <h3>Something Good Everyday</h3>
          </div>
        </div>
      </header>
      <div className="edit-post">
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit}>
          <p>
            <label>
              Choose a Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">Select a category</option>
                <option value="General">General</option>
                <option value="Quotes">Quotes</option>
                <option value="Stories">Stories</option>
                <option value="Advice">Advice</option>
                <option value="Images">Images</option>
              </select>
            </label>
          </p>
          <p>
            <label>
              <textarea
                value={title}
                onChange={handleTitle}
                rows="2"
                cols="50"
                placeholder="Edit title..."
              />
            </label>
          </p>
          <p>
            <label>
              Edit Your Post (Max 200 characters):
              <textarea
                value={text}
                onChange={handleText}
                rows="6"
                cols="50"
                placeholder="Edit your text here..."
              />
            </label>
          </p>
          <p>
            <label>
              Edit the Link:
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
              Change the Image:
              <input type="file" accept="image/*" onChange={handleImage} />
            </label>
          </p>
          <p>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </p>
          <button type="submit">Save Changes</button>
          {error && (
            <p style={{ color: "red", whiteSpace: "pre-line" }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditPostPage;
