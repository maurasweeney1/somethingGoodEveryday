import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import logo from "./logo.png";
import "./postPage.css";

function AddPostPage({ addNewPost, userId }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
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
    // Character limit = 200
    if (e.target.value.length <= 200) {
      setText(e.target.value);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxFileSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload a JPEG, JPG, or PNG image."
      );
      return;
    }
    if (file.size > maxFileSize) {
      setError("File size exceeds the limit of 10MB.");
      return;
    }
    setImage({ file, previewUrl: URL.createObjectURL(file) });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = "";

    const finalCategory = category === "" ? "General" : category;

    if (title.trim().length === 0) {
      error += "Title is required\n";
    }

    if (text.trim().length === 0 && !image && link.trim().length === 0) {
      error += "Post content is required\n";
    }

    if (error) {
      setError(error.trim());
      return; // exit if there are errors
    }

    const newPost = {
      id: uuidv4(),
      category: finalCategory,
      title,
      text,
      image: image ? image.file : null,
      link,
      likes: 0,
      likedBy: [],
      datePosted: new Date().toISOString(),
      user: userId,
    };

    addNewPost(newPost);
    navigate("/home");
  };

  return (
    <div>
      <header className="new-post-header">
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
      <div className="new-post">
        <h1>Add a New Post</h1>
        {/* add a post */}
        <form onSubmit={handleSubmit}>
          <p>
            <label>
              Choose a Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
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
              <input type="file" accept="image/*" onChange={handleImage} />
            </label>
          </p>
          <p>
            {image && image.previewUrl && (
              <img
                src={image.previewUrl}
                alt="Preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </p>
          <button type="submit">Submit Post</button>

          {error && (
            <p style={{ color: "red", whiteSpace: "pre-line" }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddPostPage;
