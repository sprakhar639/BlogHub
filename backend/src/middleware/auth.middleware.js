const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    throw error;
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  if (!payload || typeof payload.id !== "string") {
    const error = new Error("Invalid authentication token");
    error.status = 401;
    throw error;
  }
  return payload;
}

async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  try {
    const payload = verifyToken(token);
    // A signed token is not enough: confirm the account still exists.
    const user = await userModel.findById(payload.id).select("_id");
    if (!user) {
      res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
      return res.status(401).json({ message: "Account no longer exists. Please log in again." });
    }
    req.user = { id: user._id.toString() };
    return next();
  } catch (error) {
    if (error.status === 500) return next(error);
    return res.status(401).json({
      message: error.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid authentication token",
    });
  }
}

async function optionalAuthMiddleware(req, _res, next) {
  const token = req.cookies?.token;
  if (!token || !process.env.JWT_SECRET) return next();
  try {
    const payload = verifyToken(token);
    const user = await userModel.findById(payload.id).select("_id");
    if (user) req.user = { id: user._id.toString() };
  } catch (error) {
    
    if (error.status === 500) return next(error);
  }
  return next();
}

module.exports = { authMiddleware, optionalAuthMiddleware };
