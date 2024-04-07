import React from 'react'
import { useGetGithubImages } from '../../../cms/queries/github'
import { GenericError } from '../../components/atoms/GenericError'
import { Layout } from '../../components/atoms/Layout'
import { H5 } from '@imput/components/Typography'
import { Card } from '@imput/components/Card'
import { Logo } from '../../components/atoms/Logo'
import { Sidebar } from '../../components/organisms/Sidebar'
import { FileCard, FileCardSkeleton } from '../../components/molecules/FileCard'
import ImageUploadButton from '../../components/editor/images/uploadButton/uploadButton'

/**
 * Renders a page with a list of all the files available to Imput
 */
export const FilesPage = () => {
  const { isSuccess, data, isError, isLoading } = useGetGithubImages()

  return (
    <React.Fragment>
      <Layout
        navbar={
          <div className="flex flex-1 justify-between">
            <Logo />
            <ImageUploadButton />
          </div>
        }
      >
        <div className="grid grid-cols-12 flex-1 gap-2">
          <div className="col-span-2 pl-2 pb-2 flex flex-col">
            <Sidebar />
          </div>
          <div className="col-span-10 p-2 border-l border-border gap-4 flex flex-col bg-accent">
            {isError && (
              <GenericError title="Could not find collection.">
                Are you sure your settings are correct?
              </GenericError>
            )}
            <Card className="p-2">
              <div className="grid grid-cols-12">
                <div className="col-span-2 flex items-center">
                  {isSuccess && (
                    <H5 className="text-sm font-medium leading-none">
                      {data.data.tree.length} files found
                    </H5>
                  )}
                </div>
              </div>
            </Card>
            <div className="grid gap-2 grid-cols-3">
              {isSuccess &&
                data.data.tree.map((content) => {
                  return (
                    <FileCard key={content.path} path={content.path || ''} />
                  )
                })}

              {isLoading &&
                Array(9)
                  .fill(0)
                  .map((_x, i) => <FileCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  )
}
