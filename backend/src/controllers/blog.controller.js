const mongoose = require("mongoose");
const blogModel = require("../models/blog.model");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatBlog(blog, userId = null) {
  if (!blog) return blog;

  const result =
    typeof blog.toObject === "function" ? blog.toObject() : { ...blog };

  const likes = result.likes || [];

  result.likesCount = likes.length;
  result.likedByMe = userId
    ? likes.some((id) => id.toString() === userId.toString())
    : false;

  delete result.likes;

  return result;
}

async function createBlog(req, res, next) {
  try {
    const blog = await blogModel.create({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      author: req.user.id,
    });

    await blog.populate("author", "username");

    return res.status(201).json({
      message: "Story published",
      blog: formatBlog(blog, req.user.id),
    });
  } catch (error) {
    return next(error);
  }
}

async function getAllBlogs(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      24,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 9),
    );

    const search = String(req.query.search || "")
      .trim()
      .slice(0, 100);

    const sortOption = req.query.sort === "oldest" ? "oldest" : "newest";

    const filter = {};
    if (search) {
      const searchTerms = search.split(/\s+/).filter(Boolean).map(escapeRegex);

      filter.$and = searchTerms.map((term) => ({
        $or: [
          { title: { $regex: term, $options: "i" } },
          { content: { $regex: term, $options: "i" } },
        ],
      }));
    }
    const [blogs, totalBlogs] = await Promise.all([
      blogModel
        .find(filter)
        .populate("author", "username")
        .select("title content author createdAt updatedAt likes")
        .sort({ createdAt: sortOption === "oldest" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      blogModel.countDocuments(filter),
    ]);

    const formattedBlogs = blogs.map((blog) => formatBlog(blog, req.user?.id));

    const totalPages = Math.max(1, Math.ceil(totalBlogs / limit));

    return res.json({
      blogs: formattedBlogs,
      pagination: {
        currentPage: page,
        limit,
        totalBlogs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getBlogById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Story not found" });
    }

    const blog = await blogModel
      .findById(req.params.id)
      .populate("author", "username");

    if (!blog) {
      return res.status(404).json({ message: "Story not found" });
    }

    return res.json({
      blog: formatBlog(blog, req.user?.id),
    });
  } catch (error) {
    return next(error);
  }
}

async function likeBlog(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Story not found" });
    }

    const blog = await blogModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likes: req.user.id },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate("author", "username");

    if (!blog) {
      return res.status(404).json({ message: "Story not found" });
    }

    return res.json({
      message: "Story liked",
      blog: formatBlog(blog, req.user.id),
    });
  } catch (error) {
    return next(error);
  }
}

async function unlikeBlog(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Story not found" });
    }

    const blog = await blogModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: req.user.id },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .populate("author", "username");

    if (!blog) {
      return res.status(404).json({ message: "Story not found" });
    }

    return res.json({
      message: "Like removed",
      blog: formatBlog(blog, req.user.id),
    });
  } catch (error) {
    return next(error);
  }
}

async function updateBlogById(req, res, next) {
  try {
    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title.trim();
    }

    if (req.body.content !== undefined) {
      updates.content = req.body.content.trim();
    }

    const blog = await blogModel
      .findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
      .populate("author", "username");

    if (!blog) {
      return res.status(404).json({ message: "Story not found" });
    }

    return res.json({
      message: "Story updated",
      blog: formatBlog(blog, req.user.id),
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteBlogById(req, res, next) {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Story not found" });
    }

    return res.json({ message: "Story deleted" });
  } catch (error) {
    return next(error);
  }
}

async function getMyBlogs(req, res, next) {
  try {
    const blogs = await blogModel
      .find({ author: req.user.id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      blogs: blogs.map((blog) => formatBlog(blog, req.user.id)),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  likeBlog,
  unlikeBlog,
  updateBlogById,
  deleteBlogById,
  getMyBlogs,
};
