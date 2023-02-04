import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from 'cms/queries/github'
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import ContentPage from 'cms/pages/content'
import Box from 'cms/components/designSystem/box'
import CollectionSelect from 'cms/components/collections/collectionSelect'
import CollectionCard from 'cms/components/collections/collectionCard'
import { CollectionType } from 'cms/types/collection'
import useMeasure from 'cms/utils/useMeasure'
import Button from 'cms/components/designSystem/button'
import EditorPage from 'cms/pages/editor'

const CollectionPage = () => {
  const { collection } = useParams<{
    collection: string
  }>()
  const match = useRouteMatch<{ cms: string }>()
  const history = useHistory()
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
          <Route exact path={`${match.path}/new`}>
            <EditorPage />
          </Route>
          <Route path={`${match.path}/:file`}>
            <ContentPage />
          </Route>
          <Route path={match.path}>
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
                  <Box css={{}}>
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
                          history.push(`${match.url}/new`)
                        }}
                      >
                        Add new
                      </Button>
                    </Box>
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
