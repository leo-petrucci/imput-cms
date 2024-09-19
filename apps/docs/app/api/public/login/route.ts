import { GITHUB_CLIENT_ID } from '@/lib/githubAppAuth'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const state = crypto.randomBytes(16).toString('hex')
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&state=${state}`
  return NextResponse.redirect(url)
}
