import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { queryKeys } from '../../../cms/queries/keys'
import { Button } from '@imput/components/Button'
import { P } from '@imput/components/Typography'
import path from 'path'
import { getCookie } from '../../queries/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { backend, imput_path } = useCMS()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // by building the url like this we ensure it always has a trailing slash
  const url = new URL(backend.base_url)

  const receiveMessage = (event: any) => {
    if (event.data.includes && !event.data.includes('setImmediate')) {
      const { token, provider } = JSON.parse(event.data) as {
        token: string
        provider: 'github'
      }
      document.cookie = `imput_token=${token}; Max-Age=604800;`
      document.cookie = `token=${token}; Max-Age=604800;`
      document.cookie = `imput_provider=${provider}; Max-Age=604800;`
      // the page on which the login originated
      // only available when using the managed auth
      const imputOrigin = getCookie('imput_origin')
      console.log('imputOrigin', imputOrigin)
      if (imputOrigin) {
        window.location.href = `https://www.dinnerwithevie.com/managed-login?token=${token}&provider=${provider}`
        // window.location.href = getCookie('imput_origin') || ''
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.token.queryKey,
      })
      navigate(`${imput_path}`)
    }
  }

  const openWindow = (address: string) => {
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

    console.log(`${address}?provider=github`)

    window.open(
      `${address}`,
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

  if (!Boolean(backend.auth_endpoint) && backend.disable_imput_auth) {
    return (
      <div className="imp-min-h-screen imp-min-w-screen imp-flex imp-flex-col imp-items-center imp-justify-center imp-gap-2">
        <P>
          You haven't set up your own auth and have disabled Imput's manage
          auth.
        </P>
        <P>You need one or the other to log into Imput.</P>
        <P>
          Read about auth on the{' '}
          <a
            href="https://www.imput.computer/docs/quick-start/choosing-your-backend"
            className="imp-text-primary-600 imp-underline imp-decoration-from-font [text-underline-position:from-font]"
          >
            Imput Docs
          </a>
        </P>
      </div>
    )
  }

  return (
    <div className="imp-min-h-screen imp-min-w-screen imp-flex imp-flex-col imp-items-center imp-justify-center imp-gap-2">
      {Boolean(backend.auth_endpoint) && (
        <Button
          onClick={() =>
            openWindow(`${url.href}${backend.auth_endpoint}?provider=github`)
          }
        >
          Login with Github
        </Button>
      )}
      {!backend.disable_imput_auth && (
        <Button
          onClick={() => {
            openWindow(
              `http://localhost:3000/pages/managed-auth/login?imput_origin=${`https://www.dinnerwithevie.com/imput`}`
            )
          }}
        >
          Login with Imput
        </Button>
      )}
    </div>
  )
}

export default Login
