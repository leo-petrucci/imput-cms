import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from 'cms/queries/github'
import Flex from 'cms/components/designSystem/flex'
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import ContentPage from 'cms/pages/content'
import Box from 'cms/components/designSystem/box'
import CollectionSelect from 'cms/components/collections/collectionSelect/collectionSelect'
import CollectionCard from 'cms/components/collections/collectionCard/collectionCard'
import { CollectionType } from 'cms/types/collection'
import useMeasure from 'cms/utils/useMeasure'

const CollectionPage = () => {
  const { collection } = useParams<{
    collection: string
  }>()
  const match = useRouteMatch<{ cms: string }>()
  const { collections } = useCMS()
  const thisCollection = collections.find((c) => c.name === collection)
  const { isSuccess, data } = useGetGithubCollection(
    thisCollection!.folder || collections[0].folder
  )

  const [ref, { height }] = useMeasure()

  return (
    <>
      {isSuccess ? (
        <Switch>
          <Route path={`${match.path}/:file`}>
            <ContentPage />
          </Route>
          <Route path="/">
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
                zIndex: 0,
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
                  <CollectionSelect baseUrl={`/${match.params.cms}`} />
                </Box>
                <Box
                  css={{
                    gridColumn: 'span 4 / span 4',
                  }}
                >
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
                            baseUrl={match.url}
                          />
                        )
                      })}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Route>
        </Switch>
      ) : (
        <>Loading...</>
      )}
    </>
  )
}

export default CollectionPage
