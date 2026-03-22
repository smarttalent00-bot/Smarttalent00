const attackTracker = new Map();

function trackActivity(group) {
  const now = Date.now();
  const data = attackTracker.get(group) || [];

  data.push(now);

  // keep last 10 seconds
  const filtered = data.filter(t => now - t < 10000);

  attackTracker.set(group, filtered);

  return filtered.length;
}

module.exports = async function lockdown(sock, msg, { isOwner }) {
  const from = msg.key.remoteJid;

  // only groups
  if (!from.endsWith("@g.us")) return false;

  const count = trackActivity(from);

  // 🚨 ATTACK DETECTED
  if (count > 15) {
    console.log("🚨 Attack detected in:", from);

    // 🔒 LOCK GROUP
    await sock.groupSettingUpdate(from, "announcement");

    await sock.sendMessage(from, {
      text: "🚨 *ATTACK DETECTED*\n🔒 Group locked temporarily!"
    });

    // 👑 ALERT OWNER
    await sock.sendMessage("2348147991524@s.whatsapp.net", {
      text: `🚨 NexaBot Alert:\nGroup under attack: ${from}`
    });

    // 🔄 AUTO UNLOCK AFTER 30s
    setTimeout(async () => {
      await sock.groupSettingUpdate(from, "not_announcement");

      await sock.sendMessage(from, {
        text: "✅ Group unlocked. Stay safe!"
      });
    }, 30000);

    return true;
  }

  return false;
};
