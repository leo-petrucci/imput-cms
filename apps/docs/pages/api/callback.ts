import { NextApiRequest, NextApiResponse } from 'next'
import { AuthorizationCode } from 'simple-oauth2'
import { config } from '../../lib/config'

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  const { host } = req.headers
  const url = new URL(`https://${host}/${req.url}`)
  const urlParams = url.searchParams
  const code = urlParams.get('code') as string

  const provider = urlParams.get('provider') as 'github' | 'gitlab'
  const client = new AuthorizationCode(config(provider))
  const tokenParams = {
    code,
    redirect_uri: `https://${host}/api/callback?provider=${provider}`,
  }

  try {
    const accessToken = await client.getToken(tokenParams)
    const token = accessToken.token['access_token']

    res.statusCode = 200

    res.setHeader('Content-Type', 'text/html')
    res.end(`
        <script type="text/javascript">
          if (window.opener) {
              window.opener.postMessage('${JSON.stringify({
                token,
                provider,
              })}', "*");
          }
          window.close();
        </script>
    `)
  } catch (e) {
    res.statusCode = 200
    res.end(renderBody('error', e))
  }
}

function renderBody(status: any, content: any) {
  return `
    <script>
        event.source.postMessage(
            'authorization:${content.provider}:${status}:${JSON.stringify(
    content
  )}',
            message.origin
        );
    </script>
  `
}

export default callback
