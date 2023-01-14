import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { useGetGithubCollection } from 'cms/queries/github'
import Flex from 'cms/components/designSystem/flex'
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import ContentPage from 'cms/pages/content'

const CollectionPage = () => {
  const { collection } = useParams<{
    collection: string
  }>()
  const match = useRouteMatch()
  const { collections } = useCMS()
  const thisCollection = collections.find((c) => c.name === collection)
  const { isSuccess, data } = useGetGithubCollection(
    thisCollection!.folder || collections[0].folder
  )

  return (
    <>
      {isSuccess ? (
        <Switch>
          <Route path={`${match.path}/:file`}>
            <ContentPage />
          </Route>
          <Route path="/">
            <Flex direction="column" gap="2">
              {isSuccess &&
                data!.data.tree
                  .filter((content) =>
                    content.path!.includes(thisCollection!.extension)
                  )
                  .map((content) => {
                    const pathWithoutExtension = content.path!.replace(
                      `.${thisCollection!.extension}`,
                      ''
                    )
                    return (
                      <Link
                        key={content.path}
                        to={`${match.url}/${pathWithoutExtension}`}
                      >
                        {pathWithoutExtension}
                      </Link>
                    )
                  })}
            </Flex>
          </Route>
        </Switch>
      ) : (
        <>Loading...</>
      )}
    </>
  )
}

export default CollectionPage
