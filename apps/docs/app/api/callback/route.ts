import { AuthorizationCode } from 'simple-oauth2'
import { config } from '../../../lib/config'

export async function GET(request: Request) {
  const host = request.headers.get('host')
  const protocol =
    process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
  const url = new URL(`https://${host}/${request.url}`)
  const urlParams = url.searchParams

  const code = urlParams.get('code') as string

  const provider = urlParams.get('provider') as 'github' | 'gitlab'
  const client = new AuthorizationCode(config(provider))
  const tokenParams = {
    code,
    redirect_uri: `${protocol}${host}/api/callback?provider=${provider}`,
  }

  try {
    const accessToken = await client.getToken(tokenParams)
    const token = accessToken.token['access_token']

    console.log({
      url: request.url,
      code,
      token,
      provider,
    })

    return new Response(
      `
        <script type="text/javascript">
        if (window.opener) {
            window.opener.postMessage('${JSON.stringify({
              token,
              provider,
            })}', "*");
        }
        window.close();
        </script>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (e) {
    const error = e as any
    return new Response(
      `
        <script>
            event.source.postMessage(
                'authorization:${error.provider}:error:${JSON.stringify(
                  error
                )}',
                message.origin
            );
        </script>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  }
}
