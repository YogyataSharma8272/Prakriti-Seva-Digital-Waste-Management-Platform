const cron = require("node-cron");
const Pickup = require("../models/pickup");
const User = require("../models/user");
const { sendMail } = require("../utils/mailer");
const { isDemoMode } = require("../utils/demoMode");

// Runs every 10 minutes
exports.startPickupScheduler = () => {
  if (isDemoMode()) {
    console.log("Pickup Scheduler skipped in demo auth mode.");
    return;
  }

  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();

      // Next 24 hours window
      const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Pickups scheduled within next 24 hours & reminder not sent
      const duePickups = await Pickup.find({
        scheduleDate: { $gte: now, $lte: next24h },
        status: { $in: ["Pending", "Approved"] }, // ✅ your schema enum
        reminderSent: false
      });

      for (const pickup of duePickups) {
        const user = await User.findById(pickup.createdBy).select("email name");

        // ✅ Email reminder
        if (user?.email) {
          try {
            await sendMail({
              to: user.email,
              subject: "Pickup Reminder ✅",
              text: `Hi ${user.name || "User"},\nYour pickup is scheduled soon.\nTemple: ${
                pickup.temple
              }\nDate: ${new Date(pickup.scheduleDate).toLocaleString()}\nStatus: ${
                pickup.status
              }`
            });
          } catch (e) {
            console.log("Email reminder failed:", e.message);
          }
        }

        // ✅ Push notifications disabled for now (frontend connect later)
        // Later you can add sendPushToUser here

        // mark reminder sent
        pickup.reminderSent = true;
        pickup.reminderSentAt = new Date();
        await pickup.save();
      }
    } catch (err) {
      console.log("Scheduler error:", err.message);
    }
  });

  console.log("✅ Pickup Scheduler started (Email reminders only)");
};