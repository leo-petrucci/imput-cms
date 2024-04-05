import { Analytics } from '@vercel/analytics/react'
import '../styles/globals.css'
import '../styles/tailwind.css'

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <Analytics />
      <Component {...pageProps} />
    </>
  )
}
