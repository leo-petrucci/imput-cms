import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetContent } from '../../../cms/queries/github'
import EditorPage from '../../../cms/pages/editor'
import React from 'react'

const ContentPage = () => {
  const { currentCollection, currentFile } = useCMS()

  // find the currently opened file from the collection of all files
  const { data: document, isSuccess } = useGetContent(
    currentCollection.folder,
    currentFile
  )

  if (isSuccess) {
    return <EditorPage document={document} />
  }

  return <>Loading...</>
}

export default ContentPage
