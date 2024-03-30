import { AuthorizationCode } from 'simple-oauth2'
import { randomBytes } from 'crypto'
import { config } from '../../lib/config'
import { scopes } from '../../lib/scopes'

export const randomString = () => randomBytes(4).toString('hex')

const auth = async (req: any, res: any) => {
  const { host } = req.headers
  const protocol =
    process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
  const url = new URL(`https://${host}/${req.url}`)
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

  res.writeHead(302, { Location: authorizationUri })
  res.end()
}

export default auth
