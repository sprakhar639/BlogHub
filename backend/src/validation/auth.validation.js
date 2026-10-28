function validationRegister(req, res, next) {
  const { username, email, password } = req.body || {};
  if (typeof username !== "string" || username.trim().length < 3 || username.trim().length > 24 || !/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return res.status(400).json({ message: "Username must be 3–24 characters (letters, numbers, underscores)" });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ message: "Enter a valid email address" });
  if (typeof password !== "string" || password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
  return next();
}
function validationLogin(req, res, next) {
  const identifier = req.body?.email || req.body?.username;
  if (typeof identifier !== "string" || !identifier.trim() || typeof req.body?.password !== "string" || !req.body.password) {
    return res.status(400).json({ message: "Enter your username/email and password" });
  }
  return next();
}
module.exports = { validationRegister, validationLogin };
