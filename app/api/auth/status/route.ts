import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const TOKEN_PATH = path.join(process.cwd(), 'token.json')

export async function GET() {
  const authenticated = fs.existsSync(TOKEN_PATH)
  return NextResponse.json({ authenticated })
}
