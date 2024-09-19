import { auth } from '@/lib/githubAppAuth'
import { NextRequest } from 'next/server'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `https://imput.computer`
    : `http://localhost:3000`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const setup_action = searchParams.get('setup_action')

  console.log({
    code,
    state,
    setup_action,
  })

  if (setup_action === 'install') {
    return Response.redirect(`${BASE_URL}/pages/app-installed`)
  }

  const tokenAuthentication = await auth({
    type: 'oauth-user',
    code: code as string,
  })
  const accessToken = tokenAuthentication.token

  return Response.redirect(
    `${BASE_URL}/pages/managed-auth/callback?token=${accessToken}`
  )
}
