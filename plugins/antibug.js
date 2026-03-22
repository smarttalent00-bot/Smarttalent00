const MAX_TEXT = 5000; // large suspicious message
const spamTracker = new Map();

function isSpam(user) {
  const now = Date.now();
  const last = spamTracker.get(user) || 0;

  if (now - last < 1000) return true; // too fast
  spamTracker.set(user, now);
  return false;
}

module.exports = async function antibug(sock, msg, { isOwner }) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      "";

    // 🚫 Block huge / malformed messages
    if (text.length > MAX_TEXT) {
      await sock.sendMessage(from, {
        text: "🚫 Suspicious message blocked (anti-bug protection)"
      });
      return true;
    }

    // 🚫 Detect spam flood
    if (isSpam(sender)) {
      await sock.sendMessage(from, {
        text: "⚠️ Slow down! Spam detected."
      });
      return true;
    }

    // 🚫 Detect repeated forwarded messages
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    if (ctx?.isForwarded && ctx?.forwardingScore > 10) {
      await sock.sendMessage(from, {
        text: "🚫 Suspicious forwarded message blocked"
      });
      return true;
    }

    return false;
  } catch (e) {
    console.error("AntiBug Error:", e);
    return false;
  }
};
