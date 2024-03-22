import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetContent, useSaveMarkdown } from '../../../cms/queries/github'
import { DepthProvider } from '../../../cms/components/editor/depthContext'
import Editor, { deserialize, serialize } from '../../../cms/components/editor'
import React, { useEffect } from 'react'
import matter from 'gray-matter'
import { useController, useForm, useFormContext } from 'react-hook-form'
import { useFormItem, Form, ErrorBoundary } from '@meow/components'
import { SwitchControlled } from '@meow/components/Switch'
import { ComboBox } from '@meow/components/Combobox/Controlled'
import { Button } from '@meow/components/Button'
import toast from 'react-hot-toast'
import ImagePicker from '../../components/imagePicker'
import { Widgets } from '../../../cms/contexts/cmsContext/context'
import Relation from '../../components/relation'
import merge from 'lodash/merge'
// @ts-expect-error
import * as Handlebars from 'handlebars/dist/handlebars'
import { slugify } from '../../../cms/utils/slugify'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../cms/queries/keys'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/loader'
import { Layout } from '../../components/atoms/Layout'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import { Input } from '@meow/components/Input/Controlled'
import { MdxRenderer } from '../../../MeowRenderer'
import { Descendant } from 'slate'
import { CaretLeft } from '@meow/components/Icon'

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
    defaultValues: {
      body: '',
      rawBody: [] as (Descendant & { id: string })[],
      ...defaultValues(),
    },
  })

  // initialize default values to the form
  useEffect(() => {
    if (document) {
      const { content: body, data: grayMatterObj } = matter(document.markdown)
      const rawBody = deserialize(body)
      form.reset({
        ...grayMatterObj,
        body,
        rawBody: rawBody.result,
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

      // slugify each property in the current schema so that it can be used to construct our slug.
      const slugifiedRest = cloneDeep(rest)
      Object.keys(slugifiedRest).forEach((key) => {
        slugifiedRest[key] = slugify(String(slugifiedRest[key]))
      })

      return template({
        ...slugifiedRest,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown])

  const { mutate, isLoading } = useSaveMarkdown(filename)

  // we parse form values into a graymatter string so we can display it
  React.useEffect(() => {
    const mergedValues = getCorrectedFormValues()
    const { body, rawBody, ...rest } = mergedValues
    const content = matter.stringify(body, {
      ...rest,
    })
    setMarkdown(content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { cms, collection } = useParams<{ cms: string; collection: string }>()

  /**
   * Renders a custom MDX preview or just the plain markdown
   */
  const renderPreview = () => {
    return (
      <>
        {currentCollection.preview?.components ? (
          <MdxRenderer
            descendants={formValues.rawBody}
            components={currentCollection.preview?.components}
          />
        ) : (
          markdown
        )}
      </>
    )
  }

  if (markdown) {
    return (
      <Layout
        navbar={
          <div className="flex flex-1 justify-between">
            <Button
              variant="secondary"
              className="gap-1"
              onClick={() => {
                navigate(-1)
              }}
            >
              <CaretLeft size={16} />
              Back to {currentCollection.name}
            </Button>
            <Button
              type="submit"
              form="content-form"
              // loading={isLoading}
              disabled={isLoading}
            >
              {isNewFile ? 'Publish' : 'Update'}
            </Button>
          </div>
        }
      >
        {({ navbarHeight }) => (
          <div className="flex flex-row items-stretch gap-4">
            <div
              className="overflow-y-auto p-4 flex-1"
              style={{
                maxHeight: `calc(100vh - ${navbarHeight}px)`,
              }}
            >
              <Form
                id="content-form"
                form={form}
                debug
                onSubmit={() => {
                  const id = toast.loading('Saving content...')
                  const { body, ...rest } = getCorrectedFormValues()
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
                <div className="flex flex-col gap-2">
                  {currentCollection.fields.map((f) => {
                    const renderControl = () => {
                      switch (f.widget) {
                        case 'string':
                          return <Input />
                        case 'date':
                          return <Input type="date" />
                        case 'datetime':
                          return <Input type="datetime-local" />
                        case 'markdown':
                          return <CreateEditor />
                        case 'image':
                          return <ImagePicker.Controlled />
                        case 'boolean':
                          return <SwitchControlled />
                        case 'select':
                          if (f.multiple) {
                            return (
                              <ComboBox.Multi
                                options={f.options.map((o) => ({
                                  value: o,
                                  label: o,
                                }))}
                              />
                            )
                          }

                          return (
                            <ComboBox
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
                        rules={f.rules}
                      >
                        {renderControl()}
                      </Form.Item>
                    )
                  })}
                </div>
              </Form>
            </div>
            <div
              className="overflow-y-auto flex-1"
              style={{
                maxHeight: `calc(100vh - ${navbarHeight}px)`,
              }}
            >
              {currentCollection.preview?.header?.({
                ...omit(formValues, ['rawBody']),
              })}
              {currentCollection.preview?.wrapper?.({
                children: renderPreview(),
              }) || renderPreview()}
              {currentCollection.preview?.footer?.({
                ...omit(formValues, ['rawBody']),
              })}
            </div>
          </div>
        )}
      </Layout>
    )
  }

  return <Loader />
}

const CreateEditor = () => {
  const { name, rules } = useFormItem()
  const { control, setValue } = useFormContext()

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

      // if this is the main body we save the raw slate array to form
      if (name === 'body') {
        setValue('rawBody', nextValue)
      }
    },
    [field]
  )

  const value = React.useMemo(
    () => {
      const deserialized = deserialize(content || 'My markdown content')

      return deserialized.result
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <DepthProvider>
      <Editor value={value} onChange={(value) => handleChange(value)} />
    </DepthProvider>
  )
}

type ExcludeExceptionKey<T extends string | number | symbol> =
  `${string & {}}` extends `${infer U}` ? (U extends T ? never : U) : never

export default EditorPage
