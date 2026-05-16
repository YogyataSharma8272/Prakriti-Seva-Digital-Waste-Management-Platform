const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      default: null
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    profileImage: {
      type: String,
      default: ""
    },
    avatarColor: {
      type: String,
      default: "#16a34a"
    },
    temple: {
      type: String
    },
    contributions: {
      type: Number,
      default: 0
    },
    activities: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    badges: {
      type: [String],
      default: []
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    loginCount: {
      type: Number,
      default: 0
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    lastLoginIp: {
      type: String,
      default: ""
    },
    loginHistory: {
      type: [
        {
          at: {
            type: Date,
            default: Date.now
          },
          provider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
          },
          event: {
            type: String,
            enum: ["signup", "login"],
            required: true
          },
          ip: {
            type: String,
            default: ""
          },
          userAgent: {
            type: String,
            default: ""
          }
        }
      ],
      default: []
    },
    otpCode: {
      type: String,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null
    },
    otpPurpose: {
      type: String,
      enum: ["login", "reset", null],
      default: null
    },

    // ✅ Push notification device tokens (FCM)
    fcmTokens: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);