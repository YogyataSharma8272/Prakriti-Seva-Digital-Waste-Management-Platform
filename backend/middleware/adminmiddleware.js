exports.adminOnly = (req, res, next) => {
  console.log("USER in adminOnly:", req.user); // 👈 add
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only ❌" });
};