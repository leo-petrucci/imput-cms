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
import {
  CollectionCard,
  CollectionCardSkeleton,
} from '../../../cms/components/molecules/CollectionCard'
import { CollectionType } from '../../../cms/types/collection'
import { Button } from '@imput/components/Button'
import NewPage from '../../../cms/pages/new'
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
import { Navbar } from '../../components/atoms/Navbar'

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
      <Routes>
        <Route path={`/new`} element={<NewPage />} />
        <Route path={`/:file`} element={<ContentPage />} />
        <Route
          path={'/'}
          element={
            <Layout
              navbar={
                <Navbar
                  leftSlot={<Logo />}
                  rightSlot={
                    <div className="imp-py-2">
                      <Button
                        onClick={() => {
                          navigate(`/${params.cms}/${thisCollection?.name}/new`)
                        }}
                      >
                        <PlusCircle
                          size={16}
                          className="imp-w-4 imp-h-4 imp-mr-1"
                        />
                        New {thisCollection?.label}
                      </Button>
                    </div>
                  }
                />
              }
            >
              <div className="imp-grid imp-grid-cols-12 imp-flex-1 imp-gap-2">
                <div className="imp-col-span-2 imp-pl-2 imp-pb-2 imp-flex imp-flex-col">
                  <div className="imp-sticky imp-top-0 imp-pt-2">
                    <Collapsible
                      className="imp-space-y-1"
                      open={isOpen}
                      onOpenChange={setIsOpen}
                    >
                      <div className="imp-flex imp-items-center imp-justify-between">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="imp-w-full !imp-justify-start"
                          >
                            {isOpen ? (
                              <FolderNotchOpen
                                className="imp-mr-2 imp-h-4 imp-w-4"
                                weight="bold"
                              />
                            ) : (
                              <FolderNotch
                                className="imp-mr-2 imp-h-4 imp-w-4"
                                weight="bold"
                              />
                            )}
                            Collections
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="imp-flex imp-flex-col imp-gap-1 imp-ml-2">
                        {collections.map((c) => (
                          <Button
                            key={c.name}
                            variant="ghost"
                            className={`imp-w-full !imp-justify-start ${location.pathname === `/${params.cms}/${c.name}` ? 'imp-bg-accent' : ''}`}
                            onClick={() => {
                              navigate(`/${params.cms}/${c.name}`)
                            }}
                            style={{
                              justifyContent: 'flex-start',
                            }}
                          >
                            {c.label}
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
                <div className="imp-col-span-10 imp-p-2 imp-border-l imp-border-border imp-gap-4 imp-flex imp-flex-col imp-bg-accent">
                  {isError && (
                    <GenericError title="Could not find collection.">
                      Are you sure your settings are correct?
                    </GenericError>
                  )}
                  <Card className="imp-p-2">
                    <div className="imp-grid imp-grid-cols-12">
                      <div className="imp-col-span-2 imp-flex imp-items-center">
                        {isSuccess && (
                          <H5 className="imp-text-sm imp-font-medium imp-leading-none">
                            {data.length} posts found
                          </H5>
                        )}
                      </div>
                      <div className="imp-col-span-4 imp-col-start-9 imp-flex imp-justify-end">
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
                  <div className="imp-grid imp-gap-2 imp-grid-cols-3">
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
                    {isLoading &&
                      Array(9)
                        .fill(0)
                        .map((_x, i) => <CollectionCardSkeleton key={i} />)}
                  </div>
                </div>
              </div>
            </Layout>
          }
        />
      </Routes>
    </React.Fragment>
  )
}

export default CollectionPage
