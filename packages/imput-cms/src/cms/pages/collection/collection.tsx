import React from 'react'
import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from '../../../cms/queries/github'
import {
  Route,
  Routes,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import ContentPage from '../../../cms/pages/content'
import CollectionCard from '../../../cms/components/collections/collectionCard'
import { CollectionType } from '../../../cms/types/collection'
import { Button } from '@imput/components/Button'
import NewPage from '../../../cms/pages/new'
import Loader from '../../components/loader'
import { GenericError } from '../../components/atoms/GenericError'
import { Layout } from '../../components/atoms/Layout'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@imput/components/Collapsible'
import {
  FolderNotch,
  FolderNotchOpen,
  PlusCircle,
} from '@imput/components/Icon'
import { H5 } from '@imput/components/Typography'
import { SortBy } from '../../components/molecules/SortBy'
import { Card } from '@imput/components/Card'
import { Logo } from '../../components/atoms/Logo'

const CollectionPage = () => {
  const navigate = useNavigate()
  const params = useParams<{ cms: string }>()
  const [isOpen, setIsOpen] = React.useState(true)
  const { collection } = useParams<{
    collection: string
  }>()
  const location = useLocation()
  const { collections } = useCMS()
  const thisCollection = collections.find((c) => c.name === collection)
  const {
    isSuccess,
    data,
    isError,
    isLoading,
    sorting: { sortBy, setSortBy, options, sortDirection, setSortDirection },
  } = useGetGithubCollection(thisCollection!.folder || collections[0].folder)

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
                    <Logo />
                    <Button
                      onClick={() => {
                        navigate(`/${params.cms}/${thisCollection?.name}/new`)
                      }}
                    >
                      <PlusCircle size={16} className="w-4 h-4 mr-1" />
                      New {thisCollection?.label}
                    </Button>
                  </div>
                }
              >
                <div className="grid grid-cols-12 flex-1 gap-2">
                  <div className="col-span-2 pl-2 pb-2 flex flex-col">
                    <div className="sticky top-0 pt-2">
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
                              className={`w-full justify-start ${location.pathname === `/${params.cms}/${c.name}` ? 'bg-accent' : ''}`}
                              onClick={() => {
                                navigate(`/${params.cms}/${c.name}`)
                              }}
                            >
                              {c.label}
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
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
                              {data.length} posts found
                            </H5>
                          )}
                        </div>
                        <div className="col-span-4 col-start-9 flex justify-end">
                          <SortBy
                            values={{
                              sortBy,
                              direction: sortDirection,
                            }}
                            options={options}
                            onChange={(val) => {
                              if (val.sortBy) setSortBy(val.sortBy)
                              if (val.direction) setSortDirection(val.direction)
                            }}
                          />
                        </div>
                      </div>
                    </Card>
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
