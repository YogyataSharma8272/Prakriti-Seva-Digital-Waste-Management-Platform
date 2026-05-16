const mongoose = require("mongoose");
const Reward = require("../models/reward");
const Redemption = require("../models/redemption");
const User = require("../models/user");
const { sendMail } = require("../utils/mailer"); // ✅ NEW
const { isDemoMode, demoRewards, demoRedemptions } = require("../utils/demoMode");

// GET /api/rewards
exports.getRewards = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoRewards());
    }
    const rewards = await Reward.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: "Rewards fetch error", error: err.message });
  }
};

// POST /api/rewards/redeem/:id
exports.redeemReward = async (req, res) => {
  const session = await mongoose.startSession();

  // ✅ we keep these outside so we can email after commit
  let updatedUser = null;
  let reward = null;
  let redemptionDoc = null;

  try {
    session.startTransaction();

    const userId = req.user.id;
    const rewardId = req.params.id;

    reward = await Reward.findById(rewardId).session(session);
    if (!reward || reward.isActive === false) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Reward not available ❌" });
    }

    if (reward.stock <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Out of stock ❌" });
    }

    // Deduct points only if user has enough points
    updatedUser = await User.findOneAndUpdate(
      { _id: userId, points: { $gte: reward.pointsRequired } },
      { $inc: { points: -reward.pointsRequired } },
      { new: true, session }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Not enough points ❌" });
    }

    // Reduce stock
    reward.stock -= 1;
    await reward.save({ session });

    // Create redemption record
    const redemption = await Redemption.create(
      [{ user: userId, reward: rewardId, pointsSpent: reward.pointsRequired }],
      { session }
    );

    redemptionDoc = redemption[0];

    await session.commitTransaction();

    // ✅ EMAIL (after successful commit)
    // If email fails, redemption still remains (good)
    try {
      await sendMail({
        to: updatedUser.email,
        subject: "Reward Redeem Requested ✅",
        text: `Your redemption request is created.\nReward: ${reward.name}\nStatus: requested\nPoints spent: ${reward.pointsRequired}\nRemaining points: ${updatedUser.points}`
      });
    } catch (mailErr) {
      console.log("Email send failed (redeem):", mailErr.message);
    }

    res.status(201).json({
      message: "Redeem request created ✅",
      remainingPoints: updatedUser.points,
      redemption: redemptionDoc
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Redeem error", error: err.message });
  } finally {
    session.endSession();
  }
};

// USER: GET /api/rewards/me/redemptions
exports.myRedemptions = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoRedemptions().filter((item) => item.user.email === req.user.email));
    }
    const list = await Redemption.find({ user: req.user.id })
      .populate("reward", "name pointsRequired")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "My redemptions error", error: err.message });
  }
};

// ADMIN: POST /api/rewards (create reward)
exports.createReward = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.status(201).json({ message: "Reward created ✅", reward: { _id: `demo-reward-${Date.now()}`, ...req.body } });
    }
    const { name, pointsRequired, stock, isActive } = req.body;
    const reward = await Reward.create({ name, pointsRequired, stock, isActive });
    res.status(201).json({ message: "Reward created ✅", reward });
  } catch (err) {
    res.status(400).json({ message: "Create reward error", error: err.message });
  }
};

// ADMIN: PUT /api/rewards/:id (update reward)
exports.updateReward = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Reward updated ✅", updated: { _id: req.params.id, ...req.body } });
    }
    const updated = await Reward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Reward not found" });

    res.json({ message: "Reward updated ✅", updated });
  } catch (err) {
    res.status(400).json({ message: "Update reward error", error: err.message });
  }
};

// ADMIN: DELETE /api/rewards/:id
exports.deleteReward = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Reward deleted ✅" });
    }
    const deleted = await Reward.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reward not found" });

    res.json({ message: "Reward deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Delete reward error", error: err.message });
  }
};

// ADMIN: GET /api/rewards/admin/redemptions
exports.allRedemptions = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoRedemptions());
    }
    const list = await Redemption.find({})
      .populate("user", "name email temple")
      .populate("reward", "name pointsRequired")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "All redemptions error", error: err.message });
  }
};

// ADMIN: PUT /api/rewards/admin/redemptions/:id (status update)
exports.updateRedemptionStatus = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Redemption status updated ✅", updated: { _id: req.params.id, status: req.body.status || 'requested' } });
    }
    const { status } = req.body;

    const updated = await Redemption.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Redemption not found" });

    // ✅ OPTIONAL: status update email (recommended)
    // If you want email here too, we need user email + reward name:
    try {
      const full = await Redemption.findById(updated._id)
        .populate("user", "email name")
        .populate("reward", "name pointsRequired");

      if (full?.user?.email) {
        await sendMail({
          to: full.user.email,
          subject: "Redemption Status Updated ✅",
          text: `Your redemption status is now: ${full.status}\nReward: ${full.reward?.name || "Reward"}`
        });
      }
    } catch (mailErr) {
      console.log("Email send failed (status update):", mailErr.message);
    }

    res.json({ message: "Redemption status updated ✅", updated });
  } catch (err) {
    res.status(400).json({ message: "Update status error", error: err.message });
  }
};