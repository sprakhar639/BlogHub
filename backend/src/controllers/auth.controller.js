const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});
function createToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
function safeUser(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}
async function registerUser(req, res, next) {
  try {
    const username = req.body.username.trim();
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;
    const existing = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: existing.username === username ? "Username already exists" : "Email already exists" });
    const user = await userModel.create({ username, email, password: await bcrypt.hash(password, 12) });
    res.cookie("token", createToken(user._id), cookieOptions());
    return res.status(201).json({ message: "Account created successfully", user: safeUser(user) });
  } catch (error) { return next(error); }
}
async function loginUser(req, res, next) {
  try {
    const identifier = String(req.body.email || req.body.username || "").trim();
    const query = identifier.includes("@") ? { email: identifier.toLowerCase() } : { username: identifier };
    const user = await userModel.findOne(query).select("+password");
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }
    res.cookie("token", createToken(user._id), cookieOptions());
    return res.json({ message: "Welcome back", user: safeUser(user) });
  } catch (error) { return next(error); }
}
function logOutUser(_req, res) {
  res.clearCookie("token", { ...cookieOptions(), maxAge: undefined });
  return res.json({ message: "Logged out successfully" });
}
async function getCurrentUser(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(401).json({ message: "Account not found" });
    return res.json({ user });
  } catch (error) { return next(error); }
}
module.exports = { registerUser, loginUser, logOutUser, getCurrentUser };
