function createValidation(req, res, next) {
  const { title, content } = req.body || {};
  if (typeof title !== "string" || title.trim().length < 5) return res.status(400).json({ message: "Title must be at least 5 characters" });
  if (title.trim().length > 200) return res.status(400).json({ message: "Title must be 200 characters or fewer" });
  if (typeof content !== "string" || content.trim().length < 10) return res.status(400).json({ message: "Story must be at least 10 characters" });
  return next();
}
function updateValidation(req, res, next) {
  const { title, content } = req.body || {};
  if (title !== undefined && (typeof title !== "string" || title.trim().length < 5 || title.trim().length > 200)) return res.status(400).json({ message: "Title must be 5–200 characters" });
  if (content !== undefined && (typeof content !== "string" || content.trim().length < 10)) return res.status(400).json({ message: "Story must be at least 10 characters" });
  if (title === undefined && content === undefined) return res.status(400).json({ message: "Provide a title or story to update" });
  return next();
}
module.exports = { createValidation, updateValidation };
