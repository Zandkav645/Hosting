import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const {
    name,
    password,
    telegramId
  } = req.body;

  const botToken = process.env.BOT_TOKEN;
  const panelUrl = process.env.PANEL_DOMAIN;
  const ownerId = process.env.OWNER_ID;

  const message = `🛡️ *Admin Panel Dibuat*\n\n👤 Name: \`${name}\`\n🔑 Password: \`${password}\`\n🆔 Telegram ID: \`${telegramId}\`\n🌐 Panel: ${panelUrl}/admin`;

  try {
    // Kirim ke user
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    // Kirim ke owner
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ownerId,
        text: `📥 *History Admin Panel:*\n${message}`,
        parse_mode: "Markdown"
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengirim data', details: err.message });
  }
}
