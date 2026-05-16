const mongoose = require("mongoose");

const awarenessSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: {
      type: String,
      enum: ["video", "infographic", "quiz", "story"],
    },
    link: String,
    // Video tutorial specific fields
    thumbnail: String,
    duration: String,
    category: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Awareness", awarenessSchema);