const mongoose = require("mongoose");
const blogModel = require("../models/blog.model");
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

async function createBlog(req, res, next) {
  try {
    const blog = await blogModel.create({ title: req.body.title.trim(), content: req.body.content.trim(), author: req.user.id });
    await blog.populate("author", "username");
    return res.status(201).json({ message: "Story published", blog });
  } catch (error) { return next(error); }
}
async function getAllBlogs(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, Number.parseInt(req.query.limit, 10) || 9));
    const search = String(req.query.search || "").trim().slice(0, 100);
    const sortOption = req.query.sort === "oldest" ? "oldest" : "newest";
    const filter = {};
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [{ title: { $regex: safe, $options: "i" } }, { content: { $regex: safe, $options: "i" } }];
    }
    const [blogs, totalBlogs] = await Promise.all([
      blogModel.find(filter).populate("author", "username").select("title content author createdAt updatedAt")
        .sort({ createdAt: sortOption === "oldest" ? 1 : -1 }).skip((page - 1) * limit).limit(limit).lean(),
      blogModel.countDocuments(filter),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalBlogs / limit));
    return res.json({ blogs, pagination: { currentPage: page, limit, totalBlogs, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 } });
  } catch (error) { return next(error); }
}
async function getBlogById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Story not found" });
    const blog = await blogModel.findById(req.params.id).populate("author", "username");
    if (!blog) return res.status(404).json({ message: "Story not found" });
    return res.json({ blog });
  } catch (error) { return next(error); }
}
async function updateBlogById(req, res, next) {
  try {
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title.trim();
    if (req.body.content !== undefined) updates.content = req.body.content.trim();
    const blog = await blogModel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate("author", "username");
    if (!blog) return res.status(404).json({ message: "Story not found" });
    return res.json({ message: "Story updated", blog });
  } catch (error) { return next(error); }
}
async function deleteBlogById(req, res, next) {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Story not found" });
    return res.json({ message: "Story deleted" });
  } catch (error) { return next(error); }
}
async function getMyBlogs(req, res, next) {
  try {
    const blogs = await blogModel.find({ author: req.user.id }).populate("author", "username").sort({ createdAt: -1 }).lean();
    return res.json({ blogs });
  } catch (error) { return next(error); }
}
module.exports = { createBlog, getAllBlogs, getBlogById, updateBlogById, deleteBlogById, getMyBlogs };
