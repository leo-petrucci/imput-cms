'use client'

import React, { Suspense, useEffect } from 'react'
import Loader from '@/components/Loader'
import { useSearchParams } from 'next/navigation'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `https://imput.computer`
    : `http://localhost:3000`

const Page = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <Redirect />
    </Suspense>
  )
}

const Redirect = () => {
  const searchParams = useSearchParams()
  const imput_origin = searchParams?.get('imput_origin')

  useEffect(() => {
    document.cookie = `imput_origin=${imput_origin}`
    window.location.href = `${BASE_URL}/api/public/login`
  }, [])

  return <Loader>Logging you in...</Loader>
}

export default Page
