'use client'

import React, { Suspense, useEffect } from 'react'
import Loader from '@/components/Loader'
import { getCookie } from '@/utils/cookies'
import { useSearchParams } from 'next/navigation'

const Page = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <Redirect />
    </Suspense>
  )
}

const Redirect = () => {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')

  useEffect(() => {
    const imput_origin = getCookie('imput_origin')
    console.log({ imput_origin, token })
  }, [])

  return <Loader>Redirecting...</Loader>
}

export default Page
