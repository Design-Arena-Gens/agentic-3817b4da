import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

export async function GET() {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      return NextResponse.json({
        error: 'credentials.json not found. Please follow setup instructions.'
      }, { status: 400 })
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'))
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({
      error: 'Failed to generate auth URL'
    }, { status: 500 })
  }
}
