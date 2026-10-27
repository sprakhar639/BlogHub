const blogModel = require("../models/blog.model");
const mongoose = require("mongoose");

async function blogOwnerUser(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Story not found" });
    const blog = await blogModel.findById(req.params.id).select("author");
    if (!blog) return res.status(404).json({ message: "Story not found" });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "You can only change stories you wrote" });
    req.blog = blog;
    return next();
  } catch (error) { return next(error); }
}
module.exports = { blogOwnerUser };
