// /api/auth.js (En la raíz del proyecto)

export default async function handler(req, res) {
  const { code } = req.query

  // 1. Redirigir a GitHub si no hay código
  if (!code) {
    const client_id = process.env.OAUTH_GITHUB_CLIENT_ID
    const redirect_uri = `https://${req.headers.host}/api/auth`
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}`
    )
  }

  // 2. Intercambiar el código por el Access Token de GitHub
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const data = await response.json()
    const token = data.access_token

    // Script para enviar el token a Decap CMS y cerrar el popup automáticamente
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autenticando...</title>
        </head>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("Mensaje de origen recibido:", e.origin);
              }
              window.addEventListener("message", receiveMessage, false);

              const token = ${JSON.stringify(token || '')};
              const error = ${JSON.stringify(data.error ? data : null)};

              if (token) {
                const message = "authorization:github:success:" + JSON.stringify({ token: token, provider: "github" });
                window.opener.postMessage(message, "*");
                window.close();
              } else {
                const message = "authorization:github:error:" + JSON.stringify(error);
                window.opener.postMessage(message, "*");
              }
            })();
          </script>
          <p>Autenticación completada. Esta ventana se cerrará automáticamente...</p>
        </body>
      </html>
    `

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).send(html)
  } catch (error) {
    console.error('Error durante la autenticación:', error)
    return res.status(500).json({ error: 'Error interno en el servidor de autenticación' })
  }
}
