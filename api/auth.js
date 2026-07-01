// api/auth.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { code } = query;

  if (!code) {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const redirectUri = 'https://www.xingying.us.kg/api/auth';
    const scope = query.scope || 'repo';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing OAuth env vars');
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      throw new Error('No access_token in response');
    }

    // 重定向到 CMS 页面，携带 token
    const redirectUrl = `https://www.xingying.us.kg/admin/index.html?token=${access_token}`;
    console.log('✅ Token obtained, redirecting to:', redirectUrl);
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (error) {
    console.error('OAuth error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
}