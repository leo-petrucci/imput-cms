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
import CollectionSelect from '../../../cms/components/collections/collectionSelect'
import CollectionCard from '../../../cms/components/collections/collectionCard'
import { CollectionType } from '../../../cms/types/collection'
import { useMeasure } from '@meow/utils'
import { Button } from '@meow/components/src/Button'
import NewPage from '../../../cms/pages/new'
import Loader from '../../components/loader'
import { H1 } from '@meow/components/src/Typography'

const CollectionPage = () => {
  const { collection } = useParams<{
    collection: string
  }>()
  const location = useLocation()
  const params = useParams<{ cms: string }>()
  const navigate = useNavigate()
  const { collections } = useCMS()
  const thisCollection = collections.find((c) => c.name === collection)
  const { isSuccess, data } = useGetGithubCollection(
    thisCollection!.folder || collections[0].folder
  )

  const [ref, { height }] = useMeasure()

  return (
    <React.Fragment>
      {isSuccess ? (
        <Routes>
          <Route path={`/new`} element={<NewPage />} />
          <Route path={`/:file`} element={<ContentPage />} />
          <Route
            path={'/'}
            element={
              <>
                <div
                  // @ts-ignore
                  ref={ref}
                  className="fixed top-0 right-0 left-0 p-4 bg-white border-b border-border z-10 flex justify-end"
                ></div>
                <div className="flex justify-center items-center">
                  <div
                    className="grid gap-4 grid-cols-6 max-w-screen-xl w-full"
                    style={{
                      padding: `calc(${height}px + 1rem) 1rem 1rem 1rem`,
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
                </div>
              </>
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
