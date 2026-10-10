const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ createdAt: -1 });


blogSchema.index({ author: 1, createdAt: -1 });

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;