const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errormiddleware"); // ✅ import error handler
const { startPickupScheduler } = require("./jobs/pickupscheduler");
startPickupScheduler();

// Load environment variables
dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET || "demo-secret-key";

// Connect to MongoDB
const mongoReady = connectDB();

// Initialize app
const app = express();
const isProduction = process.env.NODE_ENV === "production";

/* ================= SECURITY MIDDLEWARE ================= */

// Helmet for security headers
app.use(helmet());

// Enable CORS first (so browser preflight can pass)
app.use(cors());

// Rate Limiting (apply to all /api routes in production)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  skip: (req) => req.method === "OPTIONS",
  message: "Too many requests, please try again later."
});

if (isProduction) {
  app.use("/api", limiter);
}

/* ================= BODY PARSER ================= */
app.use(express.json());

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Prakriti Seva Backend is Running 🌱");
});

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/users", require("./routes/userroutes"));
app.use("/api/pickups", require("./routes/pickuproutes"));
app.use("/api/awareness", require("./routes/awarenessroutes"));
app.use("/api/leaderboard", require("./routes/leaderboardroutes"));
app.use("/api/rewards", require("./routes/rewardroutes"));
app.use("/api/admin", require("./routes/adminroutes"));
app.use("/api/products", require("./routes/products"));
app.use(express.json({ limit: "10kb" }));

/* ================= GLOBAL ERROR HANDLER ================= */
// ⚠ MUST BE AFTER ROUTES
app.use(errorHandler);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5002;

(async () => {
  const dbConnected = await mongoReady;
  if (!dbConnected) {
    console.warn("Backend is running without MongoDB. Demo admin login will be used.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
})();