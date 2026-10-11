const userModel = require("../models/user.model");

async function getMyProfile(req, res, next) {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyProfile,
};