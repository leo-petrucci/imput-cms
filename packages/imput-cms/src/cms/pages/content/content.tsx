import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetContent } from '../../../cms/queries/github'
import EditorPage from '../../../cms/pages/editor'
import React from 'react'
import Loader from '../../components/loader'

const ContentPage = () => {
  const { currentCollection, currentFile } = useCMS()

  // find the currently opened file from the collection of all files
  const {
    data: document,
    isLoading,
    isError,
    collectionIsError,
  } = useGetContent(currentCollection.folder, currentFile)

  if (isLoading) return <Loader />

  if (isError || collectionIsError)
    return <>Something went wrong while loading your content.</>

  return <EditorPage document={document} />
}

export default ContentPage
