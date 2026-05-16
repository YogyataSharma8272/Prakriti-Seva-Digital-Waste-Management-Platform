const User = require("../models/user");
const Pickup = require("../models/pickup");
const Reward = require("../models/reward");
const Redemption = require("../models/redemption");
const Awareness = require("../models/Awareness");
const { isDemoMode, demoUsers, demoPickups, demoRewards, demoAwareness, demoRedemptions } = require("../utils/demoMode");

/* ───── USERS ───── */

exports.getAllUsers = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoUsers());
    }
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Demo user deleted ✅" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: `Role updated to ${req.body.role} ✅`, user: { _id: req.params.id, role: req.body.role } });
    }
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `Role updated to ${role} ✅`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ───── STATS ───── */

exports.getStats = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({
        users: demoUsers().length,
        pickups: demoPickups().length,
        pendingPickups: demoPickups().filter((p) => p.status === "Pending").length,
        rewards: demoRewards().length,
        awareness: demoAwareness().length,
        redemptions: demoRedemptions().length,
        pendingRedemptions: demoRedemptions().filter((r) => r.status === "requested").length,
        activeToday: 1,
        newThisWeek: demoUsers().length,
      });
    }
    const [users, pickups, rewards, awareness, redemptions, activeToday, newThisWeek] = await Promise.all([
      User.countDocuments(),
      Pickup.countDocuments(),
      Reward.countDocuments(),
      Awareness.countDocuments(),
      Redemption.countDocuments(),
      User.countDocuments({
        lastLoginAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);
    const pendingPickups = await Pickup.countDocuments({ status: "Pending" });
    const pendingRedemptions = await Redemption.countDocuments({ status: "requested" });
    res.json({ users, pickups, pendingPickups, rewards, awareness, redemptions, pendingRedemptions, activeToday, newThisWeek });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};