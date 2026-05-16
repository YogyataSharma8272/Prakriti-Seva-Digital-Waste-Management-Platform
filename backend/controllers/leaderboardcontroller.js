const User = require("../models/user");

exports.getLeaderboard = async (req, res) => {
  const users = await User.find()
    .sort({ points: -1 })
    .select("name points temple");

  res.json(users);
};