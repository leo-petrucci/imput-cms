import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetContent, useSaveMarkdown } from '../../../cms/queries/github'
import Form from '../../../cms/components/forms/form'
import Flex from '../../../cms/components/designSystem/flex'
import Box from '../../../cms/components/designSystem/box'
import { DepthProvider } from '../../../cms/components/editor/depthContext'
import Editor, { deserialize, serialize } from '../../../cms/components/editor'
import React, { useEffect } from 'react'
import matter from 'gray-matter'
import { useController, useForm, useFormContext } from 'react-hook-form'
import { useFormItem } from '../../../cms/components/forms/form/form'
import Input from '../../../cms/components/designSystem/input'
import toast from 'react-hot-toast'
import Button from '../../../cms/components/designSystem/button'
import useMeasure from '../../../cms/utils/useMeasure'
import ImagePicker from '../../../cms/components/designSystem/imagePicker'
import Switch from '../../../cms/components/designSystem/switch'
import Select from '../../../cms/components/designSystem/select/select'
import { Widgets } from '../../../cms/contexts/cmsContext/context'
import Relation from '../../../cms/components/designSystem/select/relation'
import ErrorBoundary from '../../../cms/components/designSystem/errorBoundary/errorBoundary'
import merge from 'lodash/merge'
// @ts-expect-error
import * as Handlebars from 'handlebars/dist/handlebars'
import { slugify } from '../../../cms/utils/slugify'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../cms/queries/keys'
import { useNavigate, useParams } from 'react-router-dom'

interface EditorPageProps {
  document?: ReturnType<typeof useGetContent>['data']
  slug?: string
}

const EditorPage = ({ document, slug = '{{slug}}' }: EditorPageProps) => {
  const { currentCollection, currentFile } = useCMS()

  // used to correctly initialize the form values
  const returnDefaultValue = (widgetType: Widgets['widget']) => {
    switch (widgetType) {
      default:
        return ''
      case 'boolean':
        return false
    }
  }

  const defaultValues = () => {
    const defaultValues = Object.fromEntries(
      currentCollection.fields
        .filter((f) => f.name !== 'body')
        .map((f) => [f.name, f.default || returnDefaultValue(f.widget)])
    )
    return {
      ...defaultValues,
    }
  }

  // we need to initialize our empty values from config
  const form = useForm({
    // define body explicitly here even if it's going to be overwritten later for types
    defaultValues: { body: '', ...defaultValues() },
  })

  // initialize default values to the form
  useEffect(() => {
    if (document) {
      const { content: body, data: grayMatterObj } = matter(document.markdown)
      form.reset({
        ...grayMatterObj,
        body,
      })
      setMarkdown(document.markdown)
    }
  }, [document, form])

  const formValues = form.watch()

  const [markdown, setMarkdown] = React.useState<string | undefined>(undefined)

  // at times, our gray matter might have some undefined values
  // in those cases we need to merge our form values with a generated object of default values
  // if any undefined properties are passed to gray-matter it will blow up 🤦‍♂️
  const getCorrectedFormValues = () => {
    return merge(defaultValues(), formValues)
  }

  const isNewFile = currentFile === ''

  /**
   * If the file already exists, filename will be the original filename
   * if it doesn't, we'll instead generate it via handlebars
   */
  const filename = React.useMemo(() => {
    if (isNewFile && slug) {
      const date = new Date()
      const template = Handlebars.compile(slug)
      const { body, ...rest } = getCorrectedFormValues()

      if (slug.includes('slug') && rest.title === undefined) {
        console.warn(
          `Your slug is ${slug}, which by default is a "slugified" version of the "title" field. However, this document does not have a title field. This will cause issues when saving.`
        )
      }

      return template({
        ...rest,
        slug: slugify(String(rest.title)),
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        seconds: date.getSeconds(),
        uuid: uuidv4(),
      })
    } else {
      return currentFile
    }
  }, [markdown])

  const { mutate, isLoading } = useSaveMarkdown(filename)

  // we parse form values into a graymatter string so we can display it
  React.useEffect(() => {
    const mergedValues = getCorrectedFormValues()
    const { body, ...rest } = mergedValues
    const content = matter.stringify(body, {
      ...rest,
    })
    setMarkdown(content)
  }, [formValues])

  const [ref, { height }] = useMeasure()

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { cms, collection } = useParams<{ cms: string; collection: string }>()

  if (markdown) {
    return (
      <>
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
              body: string
              [k: string]: string
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
                      path: `${currentCollection.folder}/${filename}.${currentCollection.extension}`,
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success('Content saved!', {
                        id,
                      })

                      // We can get a big UX win here by upating the cache with the data we get back
                      queryClient.removeQueries(
                        queryKeys.github.collection(currentCollection.folder)
                          .queryKey
                      )

                      // redirect to the file we've just created
                      if (isNewFile) {
                        navigate(`/${cms}/${collection}/${filename}`, {
                          replace: true,
                        })
                      }
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
                      case 'date':
                        return <Input.Controlled type="date" />
                      case 'datetime':
                        return <Input.Controlled type="datetime-local" />
                      case 'markdown':
                        return <CreateEditor />
                      case 'image':
                        return <ImagePicker.Controlled />
                      case 'boolean':
                        return <Switch.Controlled />
                      case 'select':
                        return (
                          <Select.Controlled
                            isMulti={f.multiple || false}
                            options={f.options.map((o) => ({
                              value: o,
                              label: o,
                            }))}
                          />
                        )
                      case 'relation':
                        return (
                          <ErrorBoundary>
                            <Relation.Controlled
                              collection={f.collection}
                              value_field={f.value_field}
                              display_fields={f.display_fields}
                              isMulti={f.multiple || false}
                            />
                          </ErrorBoundary>
                        )
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
            {isNewFile ? 'Publish' : 'Update'}
          </Button>
        </Box>
      </>
    )
  }

  return <>Loading...</>
}

const CreateEditor = () => {
  const { name, rules } = useFormItem()
  const { control } = useFormContext()

  const { field } = useController({
    name,
    control,
    rules,
  })

  const { content } = matter(field.value)

  const handleChange = React.useCallback(
    (nextValue: any[]) => {
      // serialize slate state to a markdown string
      const serialized = nextValue.map((v) => serialize(v)).join('')
      field.onChange(serialized)
    },
    [field]
  )

  const value = React.useMemo(
    () => deserialize(content || 'My markdown content'),
    [content]
  )

  return (
    <DepthProvider>
      <Editor value={value} onChange={(value) => handleChange(value)} />
    </DepthProvider>
  )
}

export default EditorPage
