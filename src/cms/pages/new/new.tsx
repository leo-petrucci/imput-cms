import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import React from 'react'
import EditorPage from 'cms/pages/editor'

const NewPage = () => {
  const { currentCollection } = useCMS()
  return <EditorPage slug={currentCollection.slug} />
}

export default NewPage
