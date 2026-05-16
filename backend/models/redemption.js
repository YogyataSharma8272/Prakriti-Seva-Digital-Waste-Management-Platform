const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: "Reward", required: true },
    pointsSpent: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "delivered"],
      default: "requested"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Redemption", redemptionSchema);