import React from 'react'
import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from '../../../cms/queries/github'
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom'
import ContentPage from '../../../cms/pages/content'
import CollectionCard from '../../../cms/components/collections/collectionCard'
import { CollectionType } from '../../../cms/types/collection'
import { Button } from '@meow/components/Button'
import NewPage from '../../../cms/pages/new'
import Loader from '../../components/loader'
import { GenericError } from '../../components/atoms/GenericError'
import { Layout } from '../../components/atoms/Layout'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@meow/components/Collapsible'
// @ts-expect-error
import logo from '../../../assets/imput-logo.svg'
import { FolderNotch, FolderNotchOpen } from '@meow/components/Icon'

const CollectionPage = () => {
  const [isOpen, setIsOpen] = React.useState(true)
  const { collection } = useParams<{
    collection: string
  }>()
  const location = useLocation()
  const { collections } = useCMS()
  const thisCollection = collections.find((c) => c.name === collection)
  const { isSuccess, data, isError, isLoading } = useGetGithubCollection(
    thisCollection!.folder || collections[0].folder
  )

  console.log({ data })

  return (
    <React.Fragment>
      {!isLoading ? (
        <Routes>
          <Route path={`/new`} element={<NewPage />} />
          <Route path={`/:file`} element={<ContentPage />} />
          <Route
            path={'/'}
            element={
              <Layout
                navbar={
                  <div className="flex flex-1 justify-between">
                    <img {...logo} />
                  </div>
                }
              >
                <div className="grid grid-cols-12 flex-1 gap-2">
                  <div className="col-span-2 pl-2 pb-2 flex flex-col">
                    <div className="sticky top-0">
                      <Collapsible
                        className="space-y-1"
                        open={isOpen}
                        onOpenChange={setIsOpen}
                      >
                        <div className="flex items-center justify-between">
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              {isOpen ? (
                                <FolderNotchOpen
                                  className="mr-2 h-4 w-4"
                                  weight="bold"
                                />
                              ) : (
                                <FolderNotch
                                  className="mr-2 h-4 w-4"
                                  weight="bold"
                                />
                              )}
                              Collections
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="flex flex-col gap-1 ml-2">
                          {collections.map((c) => (
                            <Button
                              key={c.name}
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              {c.label}
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                  <div className="col-span-10 p-2 bg-accent border border-border rounded-lg mb-2 mr-2">
                    {isError && (
                      <GenericError title="Could not find collection.">
                        Are you sure your settings are correct?
                      </GenericError>
                    )}

                    <div className="grid gap-2 grid-cols-3">
                      {isSuccess &&
                        data.map((content: CollectionType) => {
                          return (
                            <CollectionCard
                              key={content.slug}
                              {...content}
                              baseUrl={location.pathname}
                            />
                          )
                        })}
                    </div>
                  </div>
                </div>
                <>
                  {/* <div className="flex justify-center items-center">
                    <div
                      className="grid gap-4 grid-cols-6 max-w-screen-xl w-full"
                      style={{
                        padding: `1rem 1rem 1rem 1rem`,
                      }}
                    >
                      <div className="col-span-2	">
                        <CollectionSelect baseUrl={`/${params.cms}`} />
                      </div>
                      <div className="flex flex-col gap-4 col-span-4">
                        <div className="flex justify-between items-center">
                          <H1>{thisCollection?.label}</H1>

                          <Button
                            onClick={() => {
                              navigate(`${location.pathname}/new`)
                            }}
                          >
                            Add new
                          </Button>
                        </div>
                        <div className="grid gap-2 grid-cols-2">
                          {isError && (
                            <GenericError title="Could not find collection.">
                              Are you sure your settings are correct?
                            </GenericError>
                          )}
                          {isSuccess &&
                            data.map((content: CollectionType) => {
                              return (
                                <CollectionCard
                                  key={content.slug}
                                  {...content}
                                  baseUrl={location.pathname}
                                />
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </div> */}
                </>
              </Layout>
            }
          />
        </Routes>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  )
}

export default CollectionPage
