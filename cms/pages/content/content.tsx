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
import { useController, useForm, useFormContext } from 'react-hook-form'
import { useFormItem } from 'cms/components/forms/form/form'
import Input from 'cms/components/designSystem/input'
import toast from 'react-hot-toast'
import Button from 'cms/components/designSystem/button'
import useMeasure from 'cms/utils/useMeasure'
import ImagePicker from 'cms/components/designSystem/imagePicker/imagePicker'

const ContentPage = () => {
  const { currentCollection, currentFile } = useCMS()

  // this should never be undefined as the route above prevents rendering before the query is finished
  const query = useGetGithubCollection(currentCollection!.folder)

  const { mutate, isLoading } = useSaveMarkdown(currentFile)

  // find the currently opened file from the collection of all files
  const sha = query.data!.data.tree.find(
    (f) => f.path === `${currentFile}.${currentCollection.extension}`
  )!.sha

  // decode it with github
  const { data, isSuccess } = useGetGithubDecodedFile(sha)

  // we need to initialize our empty values from config
  const form = useForm({
    defaultValues: {
      body: '',
      ...Object.fromEntries(currentCollection.fields.map((f) => [f.name, ''])),
    },
  })

  // initialize default values to the form
  useEffect(() => {
    if (isSuccess) {
      setMarkdown(data)
      const { content: body, data: grayMatterObj } = matter(data)
      form.reset({
        ...grayMatterObj,
        body,
      })
    }
  }, [data, form, isSuccess])

  const formValues = form.watch()

  const [markdown, setMarkdown] = React.useState(data)

  // we parse form values into a graymatter string so we can display it
  React.useEffect(() => {
    const { body, ...rest } = formValues
    const content = matter.stringify(body, rest)
    setMarkdown(content)
  }, [formValues])

  const [ref, { height }] = useMeasure()

  if (isSuccess) {
    return (
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
            zIndex: 0,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="submit"
            form="content-form"
            loading={isLoading}
            disabled={isLoading}
          >
            Save
          </Button>
        </Box>

        <Flex direction="row" align="stretch" gap="4">
          <Box
            css={{
              paddingTop: `calc(${height}px + $4)`,
              paddingLeft: '$4',
              paddingRight: '$4',
              paddingBottom: '$4',
              flex: '1 0 0%',
            }}
          >
            <Form<{
              [k: string]: string
              body: string
            }>
              formProps={{ id: 'content-form' }}
              form={form}
              onSubmit={({ body, ...rest }) => {
                const id = toast.loading('Saving content...')
                const content = matter.stringify(body, rest)
                mutate(
                  {
                    markdown: {
                      content,
                      path: `${currentCollection.folder}/${currentFile}.${currentCollection.extension}`,
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success('Content saved!', {
                        id,
                      })
                    },
                  }
                )
              }}
            >
              <Flex direction="column" gap="2">
                {currentCollection.fields.map((f) => {
                  const renderControl = () => {
                    switch (f.widget) {
                      case 'string':
                        return <Input.Controlled />
                      case 'markdown':
                        return <CreateEditor mdx={data} />
                      case 'image':
                        return <ImagePicker.Controlled />
                    }
                  }

                  return (
                    <Form.Item
                      key={f.name}
                      name={f.name}
                      label={f.label}
                      rules={{
                        required: {
                          value: f.required || false,
                          message: `${f.label} is required.`,
                        },
                      }}
                    >
                      {renderControl()}
                    </Form.Item>
                  )
                })}
              </Flex>
            </Form>
          </Box>
          <Box
            css={{
              paddingTop: `calc(${height}px + $4)`,
              whiteSpace: 'pre-wrap',
              flex: '1 0 0%',
            }}
          >
            {markdown}
          </Box>
        </Flex>
      </>
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

  const { content } = matter(mdx)

  const handleChange = React.useCallback(
    (nextValue: any[]) => {
      // serialize slate state to a markdown string
      const serialized = nextValue.map((v) => serialize(v)).join('')
      field.onChange(serialized)
    },
    [field]
  )

  const value = React.useMemo(() => deserialize(content), [content])

  return (
    <DepthProvider>
      <Editor value={value} onChange={(value) => handleChange(value)} />
    </DepthProvider>
  )
}

export default ContentPage
