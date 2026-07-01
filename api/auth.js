// api/auth.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method, query, url } = req;

  if (method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { code } = query;

  // ============================================================
  // 路由1: /auth - 发起 GitHub OAuth 授权
  // ============================================================
  if (!code) {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const redirectUri = 'https://www.xingying.us.kg/api/auth/callback';
    const scope = query.scope || 'repo';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

    console.log('Redirecting to GitHub:', authUrl);
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  // ============================================================
  // 路由2: /callback - 处理 GitHub 回调，通过 postMessage 传递 token
  // ============================================================
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

    // ===== 官方标准方式：通过 postMessage 将 token 传回主窗口 =====
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
      console.log('🔑 OAuth callback received, token:', token);

      if (window.opener) {
        try {
          // 官方标准格式：发送给 Decap CMS 的 message 监听器
          window.opener.postMessage({
            type: 'authorization:github:success',
            payload: {
              token: token,
              provider: 'github'
            }
          }, 'https://www.xingying.us.kg');
          console.log('✅ postMessage sent to opener');
          // 延迟关闭窗口
          setTimeout(function() {
            window.close();
          }, 300);
        } catch (e) {
          console.error('❌ postMessage error:', e);
          window.close();
        }
      } else {
        console.warn('⚠️ No opener found');
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
    if (error.response) {
      console.error('GitHub API error data:', error.response.data);
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
}