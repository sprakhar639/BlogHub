const express = require("express");
const controller = require("../controllers/blog.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { blogOwnerUser } = require("../middleware/blogOwner.middleware");
const { createValidation, updateValidation } = require("../validation/blog.validation");
const router = express.Router();

router.get("/", controller.getAllBlogs);
router.get("/mine", authMiddleware, controller.getMyBlogs);
router.get("/:id", controller.getBlogById);
router.post("/", authMiddleware, createValidation, controller.createBlog);
router.put("/:id", authMiddleware, updateValidation, blogOwnerUser, controller.updateBlogById);
router.delete("/:id", authMiddleware, blogOwnerUser, controller.deleteBlogById);
module.exports = router;
