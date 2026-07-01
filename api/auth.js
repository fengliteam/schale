// api/auth.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method, query } = req;

  // 只处理 GET 请求
  if (method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { code } = query;

  // ===== 第一步：没有 code，发起 GitHub OAuth 授权 =====
  if (!code) {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    // 构建 GitHub 授权 URL，回调地址指向本函数
    const redirectUri = 'https://www.xingying.us.kg/api/auth';
    const scope = query.scope || 'repo'; // Decap 默认要求 repo 权限
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

    // 重定向到 GitHub
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

    // Decap CMS 期望返回 { token: 'xxx' }
    res.status(200).json({ token: access_token });
  } catch (error) {
    console.error('OAuth error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
}