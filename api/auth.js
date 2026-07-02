// api/auth.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { code } = query;

  // ===== 第一步：没有 code，发起 GitHub OAuth 授权 =====
  if (!code) {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const redirectUri = 'https://www.xingying.us.kg/api/auth';
    const scope = query.scope || 'repo';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

    console.log('Redirecting to GitHub:', authUrl);
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  // ===== 第二步：有 code，交换 access_token =====
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

    // ===== 第三步：重定向到 CMS 页面，并在 URL 中携带 token =====
    const redirectUrl = `https://www.xingying.us.kg/admin/index.html?token=${access_token}`;
    console.log('✅ Token obtained, redirecting to:', redirectUrl);
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (error) {
    console.error('OAuth error:', error.message);
    if (error.response) {
      console.error('GitHub API error data:', error.response.data);
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
}