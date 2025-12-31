import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
      return new NextResponse('Authorization code not found', { status: 400 })
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'))
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    const { tokens } = await oAuth2Client.getToken(code)
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))

    return new NextResponse(`
      <html>
        <body>
          <h1>Authentication successful!</h1>
          <p>You can close this window and return to the application.</p>
          <script>window.close()</script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.error('Callback error:', error)
    return new NextResponse('Authentication failed', { status: 500 })
  }
}
