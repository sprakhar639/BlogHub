function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ message: "That username or email is already in use" });
  if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
  if (error.name === "CastError") return res.status(404).json({ message: "Resource not found" });
  return res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Something went wrong" : (error.message || "Internal server error") });
}
module.exports = { errorHandler };
