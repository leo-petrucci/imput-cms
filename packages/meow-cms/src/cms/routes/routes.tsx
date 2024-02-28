import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextCMSContext } from '../../cms/contexts/cmsContext/context'
import { CMSProvider } from '../../cms/contexts/cmsContext/useCMSContext'
import { UserProvider } from '../../cms/contexts/userContext/userContext'
import HomePage from '../../cms/pages/home'
import CollectionPage from '../../cms/pages/collection'
import { ImagesProvider } from '../../cms/contexts/imageContext/useImageContext'
import React from 'react'
import { Octokit } from 'octokit'
import { getToken } from '../../cms/queries/auth'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

/**
 * Central routing point for all of our private CMS pages
 */
const NextCMSPrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/:cms/:collection/*" element={<CollectionPage />} />
      <Route path="/:cms" element={<HomePage />} />
    </Routes>
  )
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
    <Router>
      <QueryClientProvider client={queryClient}>
        {/* CMS settings and such */}
        <CMSProvider settings={props.settings}>
          {/* Github user info */}
          <UserProvider>
            {/* All images to be used in the CMS */}
            <ImagesProvider>
              <div className="text-base">
                <Toaster
                  containerStyle={{
                    zIndex: 99999,
                  }}
                />
                <NextCMSPrivateRoutes />
              </div>
            </ImagesProvider>
          </UserProvider>
        </CMSProvider>
      </QueryClientProvider>
    </Router>
  )
}

export default NextCMSRoutes
