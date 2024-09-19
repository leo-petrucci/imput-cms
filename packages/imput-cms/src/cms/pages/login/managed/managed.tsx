import { useEffect } from 'react'
import Loader from '../../../components/loader'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'
import path from 'path'

export const ManagedLoginPage = () => {
  const { backend, imput_path } = useCMS()
  const searchParams = new URLSearchParams(window.location.href)
  const token = searchParams?.get('token')
  const provider = searchParams?.get('provider')

  useEffect(() => {
    document.cookie = `imput_token=${token}; Max-Age=604800;`
    document.cookie = `token=${token}; Max-Age=604800;`
    document.cookie = `imput_provider=${provider}; Max-Age=604800;`

    // window.location.href = `${path.join(backend.base_url, imput_path)}`
  }, [])

  return <Loader>Logging you in...</Loader>
}
