const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
