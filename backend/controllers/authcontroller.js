const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");
const User = require("../models/user");
const { sendMail } = require("../utils/mailer");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwtSecret = process.env.JWT_SECRET || "demo-secret-key";
const isMongoReady = () => mongoose.connection.readyState === 1;
const demoAdminEmail = process.env.ADMIN_DEMO_EMAIL || "admin@prakriti.seva";
const demoAdminPassword = process.env.ADMIN_DEMO_PASSWORD || "admin123";

const getRequestMeta = (req) => ({
  ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "",
  userAgent: req.headers["user-agent"] || ""
});

const trackAuthEvent = async (user, req, event, provider = "local") => {
  const { ip, userAgent } = getRequestMeta(req);
  user.authProvider = provider;
  user.lastLoginAt = new Date();
  user.lastLoginIp = ip;
  user.loginCount = (user.loginCount || 0) + 1;
  user.loginHistory = [
    {
      at: new Date(),
      provider,
      event,
      ip,
      userAgent
    },
    ...(user.loginHistory || [])
  ].slice(0, 20);
  await user.save();
};

const buildAuthResponse = (user, message) => {
  const token = jwt.sign(
    { id: user._id || user.id || "demo-admin", role: user.role, email: user.email, name: user.name },
    jwtSecret,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      temple: user.temple,
      role: user.role,
      authProvider: user.authProvider,
      profileImage: user.profileImage,
      loginCount: user.loginCount,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    }
  };
};

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const saveOtp = async (user, purpose) => {
  const otp = generateOtp();
  user.otpCode = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.otpPurpose = purpose;
  await user.save();
  return otp;
};

const clearOtp = async (user) => {
  user.otpCode = null;
  user.otpExpiresAt = null;
  user.otpPurpose = null;
  await user.save();
};

const sendOtpEmail = async ({ user, otp, purpose }) => {
  const actionText = purpose === "login" ? "sign in" : "reset your password";
  try {
    await sendMail({
      to: user.email,
      subject: `Prakriti Seva ${purpose === "login" ? "Login OTP" : "Password Reset OTP"}`,
      text: `Your OTP to ${actionText} is ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:16px;border:1px solid #e5e7eb;">
          <h2 style="margin:0 0 12px;color:#166534;">Prakriti Seva</h2>
          <p style="color:#374151;font-size:15px;">Use this OTP to ${actionText}:</p>
          <div style="font-size:32px;letter-spacing:8px;font-weight:700;color:#ea580c;background:#fff;padding:18px 20px;border-radius:12px;border:1px dashed #fdba74;text-align:center;">${otp}</div>
          <p style="margin-top:16px;color:#6b7280;font-size:13px;">This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });
  } catch (error) {
    console.log(`Email failed (${purpose} otp):`, error.message);
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password, temple, phone } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters ❌" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (!existing.password) {
      existing.name = name || existing.name;
      existing.phone = phone || existing.phone;
      existing.temple = temple || existing.temple;
      existing.password = await bcrypt.hash(password, 10);
      existing.authProvider = "local";
      await trackAuthEvent(existing, req, "signup", "local");
      return res.status(200).json(buildAuthResponse(existing, "Account upgraded with password ✅"));
    }
    return res.status(400).json({ message: "User already exists. Please sign in ❌" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    temple,
    phone,
    authProvider: "local"
  });

  await trackAuthEvent(user, req, "signup", "local");

  res.status(201).json(buildAuthResponse(user, "Registered ✅"));
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!isMongoReady()) {
    const demoLoginMatches = email === demoAdminEmail && password === demoAdminPassword;
    if (!demoLoginMatches) {
      return res.status(400).json({ message: "Invalid ❌" });
    }

    const demoUser = {
      _id: "demo-admin",
      name: process.env.ADMIN_DEMO_NAME || "Admin",
      email: demoAdminEmail,
      phone: "",
      temple: "",
      role: "admin",
      authProvider: "local",
      profileImage: "",
      loginCount: 1,
      lastLoginAt: new Date(),
      createdAt: new Date()
    };

    return res.json(buildAuthResponse(demoUser, "Demo admin login successful ✅"));
  }

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid ❌" });

  if (!user.password) {
    return res.status(400).json({ message: "Use Google sign-in for this account ❌" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ message: "Invalid ❌" });

  await trackAuthEvent(user, req, "login", user.authProvider || "local");

  res.json(buildAuthResponse(user, "Login successful ✅"));
};

exports.googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId || String(googleClientId).includes("your_google_oauth_client_id")) {
      return res.status(500).json({
        message: "Google sign-in is not configured. Add a real GOOGLE_CLIENT_ID in backend .env ❌"
      });
    }

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required ❌" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: "Google account email not available ❌" });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        googleId: payload.sub,
        authProvider: "google",
        profileImage: payload.picture || "",
        password: null
      });
      await trackAuthEvent(user, req, "signup", "google");
      return res.status(201).json(buildAuthResponse(user, "Google account connected ✅"));
    }

    user.googleId = payload.sub;
    user.authProvider = "google";
    if (payload.picture) user.profileImage = payload.picture;
    await trackAuthEvent(user, req, "login", "google");

    return res.json(buildAuthResponse(user, "Google sign-in successful ✅"));
  } catch (error) {
    return res.status(401).json({ message: "Google sign-in failed ❌", error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    const otp = await saveOtp(user, "login");
    await sendOtpEmail({ user, otp, purpose: "login" });

    res.json({ success: true, message: "Login OTP sent successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send login OTP ❌" });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otpCode || user.otpPurpose !== "login" || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP invalid or expired ❌" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otpCode);
    if (!isValidOtp) {
      return res.status(400).json({ message: "OTP invalid or expired ❌" });
    }

    await clearOtp(user);
    await trackAuthEvent(user, req, "login", user.authProvider || "local");

    res.json(buildAuthResponse(user, "OTP login successful ✅"));
  } catch (error) {
    res.status(500).json({ message: error.message || "OTP verification failed ❌" });
  }
};

exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    const otp = await saveOtp(user, "reset");
    await sendOtpEmail({ user, otp, purpose: "reset" });

    res.json({ success: true, message: "Password reset OTP sent successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send reset OTP ❌" });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otpCode || user.otpPurpose !== "reset" || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP invalid or expired ❌" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otpCode);
    if (!isValidOtp) {
      return res.status(400).json({ message: "OTP invalid or expired ❌" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.authProvider = "local";
    await clearOtp(user);

    res.json({ success: true, message: "Password reset successful ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Password reset failed ❌" });
  }
};