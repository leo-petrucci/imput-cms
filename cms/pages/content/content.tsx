import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import {
  useGetGithubCollection,
  useGetGithubDecodedFile,
  useSaveMarkdown,
} from 'cms/queries/github'
import Form from 'cms/components/forms/form'
import Flex from 'cms/components/designSystem/flex'
import Box from 'cms/components/designSystem/box'
import { DepthProvider } from 'cms/components/editor/depthContext'
import Editor, { deserialize, serialize } from 'cms/components/editor'
import React, { useEffect } from 'react'
import matter from 'gray-matter'
import { useImages } from 'cms/contexts/imageContext/useImageContext'
import { useController, useForm, useFormContext } from 'react-hook-form'
import { useFormItem } from 'cms/components/forms/form/form'
import Input from 'cms/components/designSystem/input'

const ContentPage = () => {
  const { currentCollection, currentFile } = useCMS()
  const { images } = useImages()

  // this should never be undefined as the route above prevents rendering before the query is finished
  const query = useGetGithubCollection(currentCollection!.folder)
  const { mutate } = useSaveMarkdown(currentCollection!.folder)

  // find the currently opened file from the collection of all files
  const sha = query.data!.data.tree.find(
    (f) => f.path === `${currentFile}.${currentCollection.extension}`
  )!.sha

  // decode it with github
  const { data, isSuccess } = useGetGithubDecodedFile(sha)

  const form = useForm({
    defaultValues: {
      grayMatter: '',
      body: '',
    },
  })

  useEffect(() => {
    if (isSuccess) {
      const { content: body, data: grayMatterObj } = matter(data)
      form.reset({
        grayMatter: matter.stringify('', grayMatterObj),
        body,
      })
    }
  }, [data, form, isSuccess])

  if (isSuccess) {
    return (
      <Form<{
        grayMatter: string
        body: string
      }>
        form={form}
        onSubmit={({ grayMatter, body }) =>
          mutate({
            markdown: {
              content: `${grayMatter}${body}`,
              path: `${currentCollection.folder}/${currentFile}.${currentCollection.extension}`,
            },
            images,
          })
        }
      >
        <button type="submit">Save</button>
        <Form.Item name="grayMatter" label="Gray matter">
          <Input.Controlled name="grayMatter" />
        </Form.Item>
        <Form.Item name="body" label="Body">
          <CreateEditor mdx={data} />
        </Form.Item>
      </Form>
    )
  }

  return <>Loading...</>
}

const CreateEditor = ({ mdx }: { mdx: string }) => {
  const { name, rules } = useFormItem()
  const { control } = useFormContext()

  const { field } = useController({
    name,
    control,
    rules,
  })

  const { loadImages } = useImages()
  const { content } = matter(mdx)
  const [markdown, setMarkdown] = React.useState(content)
  const handleChange = React.useCallback(
    (nextValue: any[]) => {
      // serialize slate state to a markdown string
      const serialized = nextValue.map((v) => serialize(v)).join('')
      setMarkdown(serialized)
      field.onChange(serialized)
    },
    [field]
  )

  const value = React.useMemo(() => deserialize(content), [content])

  React.useEffect(() => {
    loadImages(mdx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mdx])

  return (
    <Flex direction="row" align="stretch" gap="4">
      <Box
        css={{
          flex: '1 0 0%',
          padding: '$4',
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
