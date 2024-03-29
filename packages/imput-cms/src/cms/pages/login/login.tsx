import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { queryKeys } from '../../../cms/queries/keys'
import { Button } from '@imput/components/Button'

const Login = () => {
  const { backend } = useCMS()
  const queryClient = useQueryClient()

  const receiveMessage = (event: any) => {
    if (event.data.includes && !event.data.includes('setImmediate')) {
      const { token, provider } = JSON.parse(event.data) as {
        token: string
        provider: 'github'
      }
      document.cookie = `token=${token}; Max-Age=604800;`
      document.cookie = `provider=${provider}; Max-Age=604800;`
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.token.queryKey,
      })
    }
  }

  const openWindow = () => {
    const w = 700
    const h = 700
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop

    // by building the url like this we ensure it always has a trailing slash
    const url = new URL(backend.base_url)

    console.log(`${url.href}${backend.auth_endpoint}?provider=github`)

    window.open(
      `${url.href}${backend.auth_endpoint}?provider=github`,
      'Login',
      `
        height=${h},
        width=${w},
        top=${top / 2},
        left=${left}
      `
    )
  }

  React.useEffect(() => {
    window.addEventListener('message', receiveMessage, false)
    // return window.removeEventListener('message', receiveMessage)
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button onClick={openWindow}>Login with Github</Button>
    </div>
  )
}

export default Login
