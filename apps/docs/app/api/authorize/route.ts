import { AuthorizationCode } from 'simple-oauth2'
import { randomBytes } from 'crypto'
import { config } from '../../../lib/config'
import { scopes } from '../../../lib/scopes'

const randomString = () => randomBytes(4).toString('hex')

export async function GET(request: Request) {
  const host = request.headers.get('host')
  const protocol =
    process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
  const url = new URL(`https://${host}/${request.url}`)
  const urlParams = url.searchParams
  const provider = urlParams.get('provider') as 'github' | 'gitlab'

  const client = new AuthorizationCode(config(provider))

  console.log('host', host)
  console.log('provider', provider)

  console.log(`${protocol}${host}/api/callback?provider=${provider}`)

  const authorizationUri = client.authorizeURL({
    redirect_uri: `${protocol}${host}/api/callback?provider=${provider}`,
    scope: scopes[provider],
    state: randomString(),
  })

  return Response.redirect(authorizationUri)
}
