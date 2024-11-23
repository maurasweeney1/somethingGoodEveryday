const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI);

// Post Schema
const PostSchema = new mongoose.Schema({
  title: String,
  category: String,
  text: String,
  link: String,
  image: String,
  datePosted: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  liked: { type: Boolean, default: false },
});

const Post = mongoose.model("Post", PostSchema);

// Routes
// GET all posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new post
app.post("/add-post", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST update like
app.post("/like", async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Initialize likes if it doesn't exist
    if (typeof post.likes !== "number") {
      post.likes = 0;
    }

    // Initialize liked if it doesn't exist
    if (typeof post.liked !== "boolean") {
      post.liked = false;
    }

    // Toggle the liked status
    post.liked = !post.liked;
    post.likes = post.liked ? post.likes + 1 : Math.max(0, post.likes - 1);

    const savedPost = await post.save();
    console.log("Saved post:", savedPost);

    res.json({
      likes: post.likes,
      liked: post.liked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO: need to make users sign in so they can only delete THEIR posts

// UPDATE post
// app.put("/edit/:postId", async (req, res) => {
//   try {
//     const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(updatedPost);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// DELETE post
// app.delete("/delete/:id", async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Post deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
