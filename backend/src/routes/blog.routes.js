const express = require("express");

const controller = require("../controllers/blog.controller");

const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth.middleware");

const { blogOwnerUser } = require("../middleware/blogOwner.middleware");

const {
  createValidation,
  updateValidation,
} = require("../validation/blog.validation");

const router = express.Router();

router.get("/", optionalAuthMiddleware, controller.getAllBlogs);

router.get("/mine", authMiddleware, controller.getMyBlogs);

router.get("/:id", optionalAuthMiddleware, controller.getBlogById);

// Like and unlike require authentication.
router.post("/:id/like", authMiddleware, controller.likeBlog);

router.delete("/:id/like", authMiddleware, controller.unlikeBlog);

router.post("/", authMiddleware, createValidation, controller.createBlog);

router.put(
  "/:id",
  authMiddleware,
  updateValidation,
  blogOwnerUser,
  controller.updateBlogById,
);

router.delete("/:id", authMiddleware, blogOwnerUser, controller.deleteBlogById);

module.exports = router;
