const User = require("../models/user");
const Pickup = require("../models/pickup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isDemoMode, demoAdminUser } = require("../utils/demoMode");

// ==================== REGISTER ====================
exports.register = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.status(201).json({
        message: "Demo mode is active. Use the demo admin login instead.",
        token: jwt.sign({ id: demoAdminUser().id, role: 'admin', email: demoAdminUser().email, name: demoAdminUser().name }, process.env.JWT_SECRET || 'demo-secret-key', { expiresIn: '7d' }),
        user: { id: demoAdminUser().id, name: demoAdminUser().name, email: demoAdminUser().email, role: 'admin' },
      });
    }
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contributions: 0,
      activities: 0,
      points: 0,
      badges: [],
      role: "user",
    });

    const token = jwt.sign({ id: user._id }, "secretkey", {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== LOGIN ====================
exports.login = async (req, res) => {
  try {
    if (isDemoMode()) {
      const demo = demoAdminUser();
      return res.status(200).json({
        message: "Demo admin login successful ✅",
        token: jwt.sign({ id: demo.id, role: 'admin', email: demo.email, name: demo.name }, process.env.JWT_SECRET || 'demo-secret-key', { expiresIn: '7d' }),
        user: { id: demo.id, name: demo.name, email: demo.email, role: 'admin' },
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },           // ✅ role add
      process.env.JWT_SECRET,                      // ✅ same secret everywhere
      { expiresIn: "7d" }                          // (optional) longer
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,                           // ✅ role in response
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== GET USER PROFILE ====================
exports.getUserProfile = async (req, res) => {
  try {
    if (isDemoMode()) {
      const demo = demoAdminUser();
      return res.json({ ...demo, id: demo.id });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== UPDATE USER PROFILE ====================
exports.updateUserProfile = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Profile updated ✅", user: { ...demoAdminUser(), id: demoAdminUser().id } });
    }
    const { name, temple, phone, profileImage, avatarColor } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (temple) user.temple = temple;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (avatarColor !== undefined) user.avatarColor = avatarColor;

    if (typeof profileImage === "string" && profileImage.length > 1_500_000) {
      return res.status(400).json({ message: "Profile image is too large ❌" });
    }

    await user.save();

    const safeUser = await User.findById(req.user.id).select("-password");
    res.json({ message: "Profile updated ✅", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== DASHBOARD ====================
exports.getDashboard = async (req, res) => {
  try {
    if (isDemoMode()) {
      const demo = demoAdminUser();
      return res.json({
        name: demo.name,
        temple: demo.temple,
        contributions: 80,
        activities: 40,
        points: 120,
        badges: ["Eco Warrior", "Green Champion"],
        totalPickups: 2,
      });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalPickups = await Pickup.countDocuments({
      createdBy: req.user.id,
    });

    res.json({
      name: user.name,
      temple: user.temple,
      contributions: user.contributions,
      activities: user.activities,
      points: user.points,
      badges: user.badges,
      totalPickups,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ==================== UPDATE CONTRIBUTION + BADGES ====================
exports.updateContribution = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Contribution updated ✅", points: 120, badges: ["Eco Warrior", "Green Champion"] });
    }
    const { contribution } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const contributionValue = Number(contribution) || 0;

    user.contributions += contributionValue;
    user.points = user.contributions + user.activities;

    // 🏆 Badge Logic
    if (user.points >= 50 && !user.badges.includes("Eco Warrior")) {
      user.badges.push("Eco Warrior");
    }

    if (user.points >= 100 && !user.badges.includes("Green Champion")) {
      user.badges.push("Green Champion");
    }

    await user.save();

    res.json({
      message: "Contribution updated ✅",
      points: user.points,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
};

exports.updateFcmToken = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "FCM token saved ✅" });
    }
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token required ❌" });

    const user = await User.findById(req.user.id);
    if (!user.fcmTokens.includes(token)) user.fcmTokens.push(token);
    await user.save();

    res.json({ message: "FCM token saved ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};