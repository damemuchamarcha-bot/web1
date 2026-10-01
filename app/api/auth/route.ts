import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    const client_id = process.env.OAUTH_GITHUB_CLIENT_ID
    const redirect_uri = 'https://damemarcha.com/api/auth'
    return NextResponse.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}`
    )
  }

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

    const postMessageContent = token
      ? `authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`
      : `authorization:github:error:${JSON.stringify(data)}`

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                window.opener.postMessage("${postMessageContent}", e.origin);
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })();
          </script>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al autenticar' }, { status: 500 })
  }
}
