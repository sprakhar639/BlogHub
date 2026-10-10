const blogModel = require("../models/blog.model");

async function createBlog(req, res, next) {
  try {
    const { title, content } = req.body;
    const author = req.user.id;

    const blog = await blogModel.create({
      title,
      content,
      author,
    });

    res.status(201).json({
      message: "Blog Created Successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllBlogs(req, res, next) {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Prevent invalid values
    if (page < 1) {
      page = 1;
    }

   
    if (limit < 1) {
      limit = 10;
    }

    if (limit > 50) {
      limit = 50;
    }

    const skip = (page - 1) * limit;

    const [blogs, totalBlogs] = await Promise.all([
      blogModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      blogModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      message: "All blogs fetched successfully",
      blogs,
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
    next(error);
  }
}

async function getBlogById(req, res, next) {
  try {
    const { id } = req.params;

    const blog = await blogModel
      .findById(id)
      .populate("author", "username");

    if (!blog) {
      return res.status(404).json({
        message: "Cannot find blog",
      });
    }

    res.status(200).json({
      message: "Blog by id fetched successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
}

async function updateBlogById(req, res, next) {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    const blog = await blogModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
      },
      {
        new: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog Updated Successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteBlogById(req, res, next) {
  try {
    const { id } = req.params;

    const blog = await blogModel.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogById,
  deleteBlogById,
};