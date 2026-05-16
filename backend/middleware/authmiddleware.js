const jwt = require("jsonwebtoken");
const User = require("../models/user"); // path check: user model ka exact naam
const mongoose = require("mongoose");
const jwtSecret = process.env.JWT_SECRET || "demo-secret-key";

const isMongoReady = () => mongoose.connection.readyState === 1;

// 🔐 Protect Middleware (Login required)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Token from header: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token ❌" });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    if (!isMongoReady()) {
      req.user = {
        id: decoded.id,
        _id: decoded.id,
        role: decoded.role || "user",
        email: decoded.email || "",
        name: decoded.name || ""
      };
      return next();
    }

    // Attach user to request
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found ❌" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized ❌",
      error: err.message
    });
  }
};

// 👑 Admin Only Middleware
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only ❌" });
};