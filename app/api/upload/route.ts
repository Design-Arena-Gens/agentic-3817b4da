import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'

const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

async function getAuthenticatedClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'))
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))
  oAuth2Client.setCredentials(token)

  return oAuth2Client
}

export async function POST(request: NextRequest) {
  try {
    if (!fs.existsSync(TOKEN_PATH)) {
      return NextResponse.json({
        error: 'Not authenticated. Please authenticate first.'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('video') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const tempFilePath = path.join('/tmp', file.name)
    await writeFile(tempFilePath, buffer)

    const auth = await getAuthenticatedClient()
    const youtube = google.youtube({ version: 'v3', auth })

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title || 'Untitled Video',
          description: description || '',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(tempFilePath),
      },
    })

    fs.unlinkSync(tempFilePath)

    return NextResponse.json({
      success: true,
      videoId: response.data.id,
      url: `https://www.youtube.com/watch?v=${response.data.id}`
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to upload video'
    }, { status: 500 })
  }
}
