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
import Box from '../../../cms/components/designSystem/box'
import CollectionSelect from '../../../cms/components/collections/collectionSelect'
import CollectionCard from '../../../cms/components/collections/collectionCard'
import { CollectionType } from '../../../cms/types/collection'
import useMeasure from '../../../cms/utils/useMeasure'
import Button from '../../../cms/components/designSystem/button'
import NewPage from '../../../cms/pages/new'

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
                <Box
                  // @ts-expect-error
                  ref={ref}
                  css={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '$4',
                    background: 'white',
                    borderBottom: '1px solid $gray-200',
                    zIndex: '$10',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                ></Box>
                <Box
                  css={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    css={{
                      padding: `calc(${height}px + $4) $4 $4 $4`,

                      display: 'grid',
                      gap: '$4',
                      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                      maxWidth: '$screen-xl',
                      width: '100%',
                    }}
                  >
                    <Box
                      css={{
                        gridColumn: 'span 2 / span 2',
                      }}
                    >
                      <CollectionSelect baseUrl={`/${params.cms}`} />
                    </Box>
                    <Box
                      css={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '$4',
                        gridColumn: 'span 4 / span 4',
                      }}
                    >
                      <Box
                        css={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',

                          '& > h1': {
                            fontSize: '$3xl',
                            fontWeight: '$semibold',
                          },
                        }}
                      >
                        <h1>{thisCollection?.label}</h1>
                        <Button
                          onClick={() => {
                            navigate(`${location.pathname}/new`)
                          }}
                        >
                          Add new
                        </Button>
                      </Box>
                      <Box
                        css={{
                          display: 'grid',
                          gap: '$2',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        }}
                      >
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
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            }
          />
        </Routes>
      ) : (
        <>Loading...</>
      )}
    </React.Fragment>
  )
}

export default CollectionPage
