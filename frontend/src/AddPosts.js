import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function AddPostPage({ addNewPost }) {
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
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = "";

    const finalCategory = category === "" ? "General" : category;

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
      id: uuidv4(),
      category: finalCategory,
      title,
      text,
      image,
      link,
      likes: 0,
      liked: false,
      datePosted: new Date().toISOString(),
    };
    console.log(finalCategory);

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
          {image && (
            <img
              src={URL.createObjectURL(image)}
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
  );
}

export default AddPostPage;
