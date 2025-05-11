const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notification = require("../models/notification");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    // Check if all required fields are present
    if (!email || !password || !name || !username) {
      return res.status(400).json({
        success: false,
        error: "Email, password, name, and username are required",
      });
    }

    // Check if user with email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      username,
      followers: [],
      following: [],
      posts: [],
    });

    const savedUser = await user.save();
    res.json({
      success: true,
      user: savedUser,
    });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({
      success: false,
      error: "Something went wrong during registration",
    });
  }
});

// POST
router.post("/api/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    text: req.body.text,
  };
  posts.push(newPost);
  res.json(newPost);
});

// GET ALL USERS (for testing)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// Create a new post for a specific user
router.post("/users/:userId/posts", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { text } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.posts.push({ text });
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// Get all posts for a specific user
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// follow
router.post("/users/:userId/follow/:targetId", async (req, res) => {
  try {
    const { userId, targetId } = req.params;

    // Find both users
    const user = await User.findById(userId).populate("following");
    const target = await User.findById(targetId);

    if (!user || !target) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if already following
    const alreadyFollowing = user.following.some(
      (followedUser) => followedUser._id.toString() === targetId
    );

    if (alreadyFollowing) {
      return res.json({
        success: true,
        user: await User.findById(userId)
          .populate("followers", "name username")
          .populate("following", "name username"),
      });
    }

    // Update both users using findByIdAndUpdate to avoid validation issues
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: targetId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      targetId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    // Create a notification for the target user
    const notification = new Notification({
      recipient: target._id,
      sender: user._id,
      type: "follow",
    });
    await notification.save();

    // Return updated user with populated followers/following
    const updatedUser = await User.findById(userId)
      .populate("followers", "name username")
      .populate("following", "name username");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error following user:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/users/:userId/feed", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userIds = [user._id, ...user.following];

    const users = await User.find(
      { _id: { $in: userIds } },
      { posts: 1, username: 1, name: 1 }
    );

    res.json(users);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).send("Something Went Wrong");
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name username")
      .populate("following", "name username");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Something Went Wrong");
  }
});

// In routes/userRoutes.js
router.delete("/users/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

//handle new user information
router.post("/users/:userId/aboutme", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { aboutMe, major, age, ethnicity } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only update fields that are not null
    if (aboutMe !== null) {
      user.aboutMe = aboutMe;
    }
    if (major !== null) {
      user.major = major;
    }
    if (age !== null) {
      // Validate age is a reasonable number
      if (typeof age !== "number" || age < 0 || age > 150) {
        return res.status(400).json({ error: "Invalid age value" });
      }
      user.age = age;
    }
    if (ethnicity !== null) {
      user.ethnicity = ethnicity;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error updating user information:", err);
    res
      .status(500)
      .json({ error: "Something went wrong while updating information" });
  }
});

module.exports = router;
