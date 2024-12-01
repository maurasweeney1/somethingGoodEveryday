const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Validator = require("validatorjs");
const router = express.Router();
const jwt = require("jwt-simple");
// for converting images
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGO_URI);

// Post Schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  text: String,
  link: String,
  image: String,
  datePosted: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  liked: { type: Boolean, default: false },
});

// User Schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
const User = mongoose.model("User", UserSchema);

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
app.post("/add-post", upload.single("image"), async (req, res) => {
  try {
    const { category, title, text, link, datePosted } = req.body;
    // Convert image to base64
    const image = req.file ? req.file.buffer.toString("base64") : null;

    const newPost = new Post({
      category,
      title,
      text,
      link,
      image,
      datePosted,
      likes: 0,
      liked: false,
    });

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
router.post("/register", async (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
  };

  const rules = {
    username: "required|string|min:3|max:20",
    password: "required|string|min:6",
  };

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username: data.username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    const validation = new Validator(data, rules);

    if (validation.fails()) {
      let message = `
            username: ${validation.errors.first("username")}, 
            password: ${validation.errors.first("password")}, 
        `;
      return res.status(400).json({ message: `Validation error: ${message}` });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      username: data.username,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({
      message: "Registration successful! You can now log in.",
      token: null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unknown Error!" });
  }
});

router.post("/signIn", async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.encode({ username: user.username }, process.env.SECRET);
  res.status(200).json({ message: "Authentication successful", token });
});

router.get("/status", async (req, res) => {
  const token = req.query.token;

  try {
    const payload = jwt.decode(token, process.env.SECRET);
    const user = await User.findOne({ username: payload.username });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid token." });
    }

    res.status(200).json({
      message: "Token validated successfully",
      username: user.username,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

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

// Mount router
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
