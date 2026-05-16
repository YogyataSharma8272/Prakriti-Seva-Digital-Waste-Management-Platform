const Awareness = require("../models/Awareness");
const { isDemoMode, demoAwareness } = require("../utils/demoMode");

// Create awareness
exports.createAwareness = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.status(201).json({
        message: "Awareness created ✅",
        content: { _id: `demo-awareness-${Date.now()}`, ...req.body, createdBy: req.user.id },
      });
    }
    const content = await Awareness.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({
      message: "Awareness created ✅",
      content
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all awareness
exports.getAwareness = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoAwareness());
    }
    const data = await Awareness.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete awareness
exports.deleteAwareness = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Awareness deleted ✅" });
    }
    await Awareness.findByIdAndDelete(req.params.id);
    res.json({ message: "Awareness deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
