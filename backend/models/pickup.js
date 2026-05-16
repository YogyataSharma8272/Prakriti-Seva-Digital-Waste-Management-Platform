const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    temple: { type: String, required: true },
    address: { type: String, required: true },
    wasteType: { type: String, required: true },
    scheduleDate: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    quantity: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "InTransit", "Completed"],
      default: "Pending"
    },

    assignedVolunteer: { type: String, default: "" },
    vehicleNumber: { type: String, default: "" },
    estimatedArrival: { type: String, default: "" },
    trackingNote: { type: String, default: "" },
    currentLocation: { type: String, default: "" },
    mapQuery: { type: String, default: "" },

    // ✅ Scheduler fields (to avoid sending reminder multiple times)
    reminderSent: { type: Boolean, default: false },
    reminderSentAt: { type: Date, default: null },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);