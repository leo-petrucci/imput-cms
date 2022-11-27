import { useRouter } from 'next/router'
import { useCMS } from '../../contexts/cmsContext/useCMSContext'
import {
  useGetGithubCollection,
  useGetGithubDecodedFile,
} from '../../queries/github'
import Form from 'cms/components/forms/form'
import Flex from 'cms/components/designSystem/flex'
import Box from 'cms/components/designSystem/box'
import { DepthProvider } from 'cms/components/editor/depthContext'
import Editor, { deserialize, serialize } from 'cms/components/editor'
import React from 'react'
import matter from 'gray-matter'
import { useImages } from 'cms/contexts/imageContext/useImageContext'

const ContentPage = () => {
  const router = useRouter()
  const { collections } = useCMS()
  const [collection, file] = router.query.nextcms as string[]
  const thisCollection =
    collections.find((c) => c.name === collection) || collections[0]

  const query = useGetGithubCollection(thisCollection!.folder)

  const contentCache = [
    {
      mode: '100644',

      path: 'test.md',

      sha: '0fb8d413ef659d2776446ae08ad0ec8d4208deb8',

      size: 163,

      type: 'blob',

      url: 'https://api.github.com/repos/creativiii/meow-cms/git/blobs/0fb8d413ef659d2776446ae08ad0ec8d4208deb8',
    },
  ]

  const sha = query.isSuccess
    ? query.data.data.tree.find(
        (f) => f.path === `${file}.${thisCollection.extension}`
      )!.sha
    : undefined

  const { data, isSuccess } = useGetGithubDecodedFile(sha)

  if (isSuccess) {
    return (
      <Form onSubmit={(d) => console.log(d)}>
        <button type="submit">Save</button>
        <Form.Item name="body" label="Body">
          <CreateEditor mdx={data} />
        </Form.Item>
      </Form>
    )
  }

  return <>Loading...</>
}

const CreateEditor = ({ mdx }: { mdx: string }) => {
  const { loadImages } = useImages()
  const { content } = matter(mdx)
  const [markdown, setMarkdown] = React.useState(content)
  const handleChange = React.useCallback((nextValue: any[]) => {
    // serialize slate state to a markdown string
    setMarkdown(nextValue.map((v) => serialize(v)).join(''))
  }, [])

  const value = React.useMemo(() => deserialize(content), [])

  React.useEffect(() => {
    loadImages(mdx)
  }, [mdx])

  return (
    <Flex direction="row" align="stretch" gap="4">
      <Box
        css={{
          flex: '1 0 0%',
        }}
      >
        <DepthProvider>
          <Editor value={value} onChange={(value) => handleChange(value)} />
        </DepthProvider>
      </Box>
      <Box
        css={{
          whiteSpace: 'pre-wrap',
          flex: '1 0 0%',
        }}
      >
        {markdown}
      </Box>
    </Flex>
  )
}

export default ContentPage
