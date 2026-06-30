import http from 'http'

const SUCCESS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tide — Connected</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; align-items: center;
           justify-content: center; height: 100vh; margin: 0; background: #f9fafb; color: #111; }
    .card { text-align: center; padding: 48px; background: white; border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 400px; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p { color: #6b7280; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Gmail connected</h1>
    <p>You can close this tab and return to Tide.</p>
  </div>
</body>
</html>
`

export function startOAuthServer(port = 54321) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${port}`)
      const code = url.searchParams.get('code')
      const error = url.searchParams.get('error')

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(SUCCESS_HTML)
      server.close()

      if (error) {
        reject(new Error(`OAuth error: ${error}`))
      } else if (code) {
        resolve(code)
      } else {
        reject(new Error('No code in OAuth callback'))
      }
    })

    server.on('error', reject)
    server.listen(port, '127.0.0.1')
  })
}
