import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextCMSContext } from '../contexts/cmsContext/context'
import { CMSProvider } from '../contexts/cmsContext/useCMSContext'
import { UserProvider } from '../contexts/userContext/userContext'
import HomePage from '../pages/home'
import CollectionPage from '../pages/collection'
import ContentPage from '../pages/content'
import { ImagesProvider } from '../contexts/imageContext/useImageContext'
import Box from 'cms/components/designSystem/box'
import React from 'react'

import 'node_modules/modern-normalize/modern-normalize.css'
import { Octokit } from 'octokit'
import { getToken } from 'cms/queries/auth'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * Central routing point for all of our private CMS pages
 */
const NextCMSPrivateRoutes: NextPage = () => {
  const { query } = useRouter()

  /**
   * If query does not exist then we're on the index page, if it does we're on one of the other routes.
   */
  const queryLength = query.nextcms !== undefined ? query.nextcms.length : 0
  switch (queryLength) {
    // index
    case 0:
      return <HomePage />
    // viewing a single category
    case 1:
      return <CollectionPage />
    // viewing a file in a category
    case 2:
      return <ContentPage />
  }

  return <>Cms fallback</>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

/**
 * NextCMS wrapper. Checks for login status, sets up contexts, etc.
 */
const NextCMSRoutes = (props: { settings: NextCMSContext['settings'] }) => {
  React.useEffect(() => {
    const get = async () => {
      const octokit = new Octokit({
        auth: getToken(),
      })
      console.log(await octokit.request('GET /rate_limit'))
    }
    get()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* CMS settings and such */}
      <CMSProvider settings={props.settings}>
        {/* Github user info */}
        <UserProvider>
          {/* All images to be used in the CMS */}
          <ImagesProvider>
            <Box
              css={{
                fontSize: 16,
              }}
            >
              <NextCMSPrivateRoutes />
            </Box>
          </ImagesProvider>
        </UserProvider>
      </CMSProvider>
    </QueryClientProvider>
  )
}

export default NextCMSRoutes
