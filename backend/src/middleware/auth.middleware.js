const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Authentication required. Please log in." });
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: error.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid authentication token" });
  }
}
module.exports = { authMiddleware };
