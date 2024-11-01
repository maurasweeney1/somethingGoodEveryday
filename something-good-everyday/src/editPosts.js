import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage({ posts, updatePost }) {
  // get postid from the route
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = posts.find((thisPost) => thisPost.id === postId);

  const [category, setCategory] = useState(post.category);
  const [title, setTitle] = useState(post.title);
  const [text, setText] = useState(post.text);
  const [link, setLink] = useState(post.link);
  const [image, setImage] = useState(post.image);
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

    updatePost(post.id, updatedPost);
    navigate("/");
  };

  return (
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
              src={image}
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
  );
}

export default EditPostPage;
