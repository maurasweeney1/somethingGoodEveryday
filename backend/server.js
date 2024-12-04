const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Validator = require("validatorjs");
const router = express.Router();
const jwt = require("jwt-simple");
// for converting images
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  storage,
});

require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const sanitizer = (input) => {
  if (input && typeof input === "object") {
    for (let key in input) {
      if (typeof input[key] === "string") {
        // remove any mongodb query operators
        input[key] = input[key].replace(/^\$/, "").replace(/\.\./g, "");
      } else if (typeof input[key] === "object") {
        // sanitize nested objects
        sanitizer(input[key]);
      }
    }
  }
  return input;
};

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
mongoose.connect(MONGO_URI);

// Post Schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true } || "General",
  text: String,
  link: String,
  image: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  datePosted: { type: Date, default: Date.now },
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

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.decode(token, process.env.SECRET);

    const user = await User.findOne({ username: payload.username });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // get user
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Routes
// GET all posts
app.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // authenticated only
      try {
        jwt.decode(token, process.env.SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// POST new post
app.post(
  "/add-post",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    const { category, title, text, link, datePosted } = sanitizer(req.body);

    try {
      const image = req.file ? `/uploads/${req.file.filename}` : null;
      const newPost = new Post({
        category,
        title,
        text,
        link,
        image,
        datePosted,
        likes: 0,
        likedBy: [],
        user: req.user._id,
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// POST update like
app.post("/like", authenticateUser, async (req, res) => {
  try {
    const { postId } = sanitizer(req.body);
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If already liked post, unlike it
    if (post.likedBy.includes(userId)) {
      post.likedBy.pull(userId);
      post.likes -= 1;
    } else {
      // like the post
      post.likedBy.push(userId);
      post.likes += 1;
    }

    const savedPost = await post.save();

    res.json({
      likes: savedPost.likes,
      liked: post.likedBy.includes(userId),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const username = sanitizer(req.body.username);
  const password = sanitizer(req.body.password);

  let data = {
    username: username,
    password: password,
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
      // Create a more readable error message
      let errors = [];
      if (validation.errors.get("username")) {
        errors.push(`Username ${validation.errors.first("username")}`);
      }
      if (validation.errors.get("password")) {
        errors.push(`Password ${validation.errors.first("password")}`);
      }

      return res.status(400).json({
        message: errors.join(", "),
      });
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
  const { username, password } = sanitizer(req.body);

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
  res.status(200).json({
    message: "Authentication successful",
    token,
    username: user.username,
    userId: user._id,
  });
});

router.get("/status", async (req, res) => {
  const token = sanitizer(req.query.token);

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
app.get("/edit/:postId", authenticateUser, async (req, res) => {
  const { postId } = sanitizer(req.params);

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, {
      new: true,
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

app.put(
  "/edit/:postId",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    const { postId } = sanitizer(req.params);
    const { category, title, text, link, datePosted } = sanitizer(req.body);

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Update post details with validation
      post.category = category || post.category || "General";
      post.title = title || post.title;
      post.text = text || post.text || "";
      post.link = link || post.link || "";

      // Ensure valid date
      post.datePosted = datePosted
        ? new Date(datePosted)
        : post.datePosted || new Date();

      // Handle image upload if a new file is present
      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }

      // Validate and save
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (error) {
      console.error("Server-side error:", error);
      res.status(400).json({
        message: "Error updating post",
        details: error.message,
      });
    }
  }
);

// DELETE post
app.delete("/delete/:postId", authenticateUser, async (req, res) => {
  const { postId } = sanitizer(req.params);
  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // check user is authorized to delete
    if (!post.user.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mount router
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
