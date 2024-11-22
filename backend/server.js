const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/someGoodPosts");

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