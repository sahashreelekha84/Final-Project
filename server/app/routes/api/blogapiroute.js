const express = require('express');
const router = express.Router();
const BlogController = require('../../controller/api/BlogController');
const Blogimageupload = require('../../helper/Blogimageupload');
const { Authcheck, checkRole } = require('../../middleware/AuthCheck'); // middleware for authentication & role check


router.post(
  '/create/blog',
  Authcheck, // ensure user is logged in
  Blogimageupload.single("image"), // handle image upload
  BlogController.createBlog
);

// List all blogs - usually admin only
router.get(
  '/blog/list',
  Authcheck,
   // only admin can access
  BlogController.getAllBlogs
);
router.post(
  '/blog/:id/comment',
  Authcheck,
   // only admin can access
  BlogController.commentcreate
);
router.get(
  '/blog/:id/comments',
  Authcheck,
   // only admin can access
  BlogController.commentlist
);
// List single author's blogs - both user (author) and admin can see
router.get(
  '/blog/:id',
  Authcheck,
  BlogController.getBlogById
);



// Update blog - accessible by both
router.post(
  '/updateblog/:id',
  Authcheck,
  Blogimageupload.single("image"),
  BlogController.updateBlog
);

// Delete blog - accessible by both
router.delete(
  '/deleteblog/:id',
  Authcheck,
  BlogController.deleteBlog
);

module.exports = router;
