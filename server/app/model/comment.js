// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    user: { type: String, default: "Anonymous" }, // you can link to User model later
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
