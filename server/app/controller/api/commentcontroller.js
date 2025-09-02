// controllers/commentController.js
const Comment = require("../models/Comment");
class commentcontroller{
async getComments   (req, res)  {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ blogId: id }).sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// Post a new comment
async createComment(req, res)  {
  try {
    const { id } = req.params;
    const { comment, user } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = await Comment.create({
      blogId: id,
      user: user || "Anonymous",
      comment,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error });
  }
};
}


module.exports= new commentcontroller()