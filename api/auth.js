// /api/auth.js (En la raíz del proyecto)

export default async function handler(req, res) {
  const { code } = req.query

  // 1. Redirección inicial a GitHub si no hay código
  if (!code) {
    const client_id = process.env.OAUTH_GITHUB_CLIENT_ID
    const host = req.headers.host
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const redirect_uri = `${protocol}://${host}/api/auth`

    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}`
    )
  }

  // 2. Intercambio de código por el Access Token de GitHub
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

    const content = token
      ? `authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`
      : `authorization:github:error:${JSON.stringify(data)}`

    // Script con comunicación bidireccional estricta para Decap CMS
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
                console.log("Origen recibido:", e.origin);
                // Enviamos el token en respuesta al mensaje handshake del CMS
                window.opener.postMessage(${JSON.stringify(content)}, "*");
              }

              window.addEventListener("message", receiveMessage, false);

              // 1. Notificar al CMS que la autorización ha comenzado
              window.opener.postMessage("authorizing:github", "*");

              // 2. Enviar el resultado directamente por si el handshake ya se produjo
              setTimeout(function() {
                window.opener.postMessage(${JSON.stringify(content)}, "*");
              }, 1000);
            })();
          </script>
          <p style="font-family: sans-serif; text-align: center; margin-top: 20px;">
            Autenticación completada. Cargando panel de administración...
          </p>
        </body>
      </html>
    `

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).send(html)
  } catch (error) {
    return res.status(500).json({ error: 'Error al procesar la autenticación' })
  }
}
