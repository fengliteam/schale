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
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      throw new Error('No access_token in response');
    }

    // 返回 HTML 页面，通过 postMessage 传递 token
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>OAuth Callback</title>
</head>
<body>
  <script>
    (function() {
      const token = '${access_token}';
      if (window.opener) {
        try {
          window.opener.postMessage({
            type: 'authorization:github:success',
            payload: { token: token, provider: 'github' }
          }, 'https://www.xingying.us.kg');
          setTimeout(function() { window.close(); }, 300);
        } catch (e) {
          window.close();
        }
      } else {
        window.location.href = 'https://www.xingying.us.kg/admin/index.html';
      }
    })();
  </script>
  <div style="text-align:center;padding-top:50px;font-family:sans-serif;">
    <h2>✅ 授权成功！</h2>
    <p>正在返回 CMS，请稍候...</p>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('OAuth error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
}