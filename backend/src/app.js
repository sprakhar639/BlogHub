const connectDB = require("./db/db");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const blogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-hub-liart.vercel.app",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const authAttempts = new Map();
function authRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 30;
  let entry = authAttempts.get(key);
  if (!entry || now - entry.start >= windowMs) {
    entry = { start: now, count: 0 };
    authAttempts.set(key, entry);
  }
  entry.count += 1;
  if (entry.count > maxAttempts) {
    res.set(
      "Retry-After",
      String(Math.ceil((windowMs - (now - entry.start)) / 1000)),
    );
    return res.status(429).json({
      message: "Too many authentication attempts. Please try again later.",
    });
  }
  // Keep the map bounded and remove expired entries occasionally.
  if (authAttempts.size > 5000) {
    for (const [ip, item] of authAttempts) {
      if (now - item.start >= windowMs) authAttempts.delete(ip);
    }
  }
  return next();
}
app.use("/api/auth/login", authRateLimit);
app.use("/api/auth/register", authRateLimit);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "BlogHub API" }),
);

let dbConnectionPromise;

app.use(async (req, res, next) => {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB().catch((error) => {
        dbConnectionPromise = null;
        throw error;
      });
    }

    await dbConnectionPromise;
    next();
  } catch (error) {
    console.error("Database initialization failed:", error.message);

    res.status(503).json({
      message: "Database temporarily unavailable",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/user", userRoutes);
app.use(errorHandler);
module.exports = app;
