import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const {
    username,
    password,
    ram,
    telegramId
  } = req.body;

  const apiKey = process.env.API_KEY_PLTA;
  const panelUrl = process.env.PANEL_DOMAIN;
  const eggId = 20;
  const locationId = 1;
  const ownerId = process.env.OWNER_ID;
  const botToken = process.env.BOT_TOKEN;

  try {
    const userRes = await fetch(`${panelUrl}/api/application/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      },
      body: JSON.stringify({
        username,
        email: `${username}@mail.com`,
        first_name: username,
        last_name: "Panel",
        password
      })
    });

    const userData = await userRes.json();
    const userId = userData.attributes.id;

    await fetch(`${panelUrl}/api/application/servers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      },
      body: JSON.stringify({
        name: `${username}-server`,
        user: userId,
        egg: eggId,
        docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
        startup: "npm start",
        limits: {
          memory: ram === "unli" ? 0 : parseInt(ram),
          swap: 0,
          disk: 1000,
          io: 500,
          cpu: 100
        },
        feature_limits: {
          databases: 1,
          backups: 1,
          allocations: 1
        },
        environment: {
          STARTUP_CMD: "npm start"
        },
        allocation: {
          default: 1
        },
        deploy: {
          locations: [locationId],
          dedicated_ip: false,
          port_range: []
        }
      })
    });

    const message = `🟦 *Panel Baru Telah Dibuat*\n\n👤 Username: \`${username}\`\n🔑 Password: \`${password}\`\n🌐 Login: ${panelUrl}`;
    
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
        text: `📥 *History Panel User:*\n${message}`,
        parse_mode: "Markdown"
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat panel', details: err.message });
  }
}
