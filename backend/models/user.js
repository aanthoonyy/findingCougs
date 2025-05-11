const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  aboutMe: {
    type: String,
  },
  major: {
    type: String,
  },
  age: {
    type: Number,
  },
  ethnicity: {
    type: String,
  },
});

module.exports = mongoose.model("users", UserSchema);
