import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'

/**
 * Will redirect user to the first collection in their settings.
 *
 * If there are no collections, display a landing page of some sort?
 */
const HomePage = () => {
  const { collections } = useCMS()
  const history = useHistory()
  const match = useRouteMatch()

  React.useEffect(() => {
    if (collections.length) {
      history.replace(`${match.path}/${collections[0].name}`)
    }
  }, [collections, history, match.path])

  return <>Loading...</>
}

export default HomePage
