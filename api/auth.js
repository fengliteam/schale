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

  // ============================================================
  // 第一步：没有 code，发起 GitHub OAuth 授权
  // ============================================================
  if (!code) {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    // 这个 redirect_uri 必须与 GitHub OAuth App 中设置的回调 URL 完全一致
    const redirectUri = 'https://www.xingying.us.kg/api/auth';
    const scope = query.scope || 'repo';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

    console.log('Redirecting to GitHub:', authUrl);
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  // ============================================================
  // 第二步：有 code，交换 access_token
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

    // ============================================================
    // 第三步：关键！返回 HTML 页面，通过 postMessage 传递 token
    // ============================================================
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
      // 从 URL 中提取 token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // 关键：通过 postMessage 将 token 发送给父窗口（CMS 主页面）
        if (window.opener) {
          window.opener.postMessage({
            type: 'authorization:github:success',
            payload: {
              token: token,
              provider: 'github'
            }
          }, 'https://www.xingying.us.kg'); // 必须指定为你的 CMS 域名
          console.log('✅ postMessage sent to opener');
          // 延迟关闭窗口，确保消息已发送
          setTimeout(function() {
            window.close();
          }, 300);
        } else {
          console.warn('⚠️ No opener found');
          // 如果没有父窗口，直接跳转到 CMS 页面
          window.location.href = 'https://www.xingying.us.kg/admin/index.html';
        }
      } else {
        console.error('❌ No token found in URL');
        window.location.href = 'https://www.xingying.us.kg/admin/index.html';
      }
    })();
  </script>
  <div style="text-align: center; padding-top: 50px; font-family: sans-serif;">
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