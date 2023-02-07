import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'

/**
 * Will redirect user to the first collection in their settings.
 *
 * If there are no collections, display a landing page of some sort?
 */
const HomePage = () => {
  const { collections } = useCMS()
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    if (collections.length) {
      navigate(`${location.pathname}/${collections[0].name}`, { replace: true })
    }
  }, [collections, history, location.pathname])

  return <>Loading...</>
}

export default HomePage
