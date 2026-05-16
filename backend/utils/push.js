let admin = null;
let initialized = false;

try {
  admin = require("firebase-admin");
  const path = require("path");
  const fs = require("fs");

  const servicePath = path.join(__dirname, "../config/firebaseServiceAccount.json");

  if (fs.existsSync(servicePath)) {
    const serviceAccount = require(servicePath);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    initialized = true;
    console.log("✅ FCM initialized");
  } else {
    console.log("⚠️ firebaseServiceAccount.json not found — push disabled");
  }
} catch (e) {
  console.log("⚠️ firebase-admin not available — push disabled");
}

const User = require("../models/user");

// ✅ Safe function: if not configured, it will just skip
exports.sendPushToUser = async (userId, { title, body, data = {} }) => {
  if (!initialized || !admin) return;

  const user = await User.findById(userId).select("fcmTokens");
  if (!user || !user.fcmTokens || user.fcmTokens.length === 0) return;

  const message = {
    notification: { title, body },
    data,
    tokens: user.fcmTokens
  };

  const resp = await admin.messaging().sendEachForMulticast(message);

  // remove invalid tokens
  const badTokens = [];
  resp.responses.forEach((r, idx) => {
    if (!r.success) badTokens.push(user.fcmTokens[idx]);
  });

  if (badTokens.length) {
    user.fcmTokens = user.fcmTokens.filter((t) => !badTokens.includes(t));
    await user.save();
  }

  return resp;
};