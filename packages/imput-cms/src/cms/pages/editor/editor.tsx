import { useCMS } from '../../../cms/contexts/cmsContext/useCMSContext'
import { useGetContent, useSaveMarkdown } from '../../../cms/queries/github'
import { deserialize } from '../../../cms/components/editor'
import React, { useEffect } from 'react'
import matter from 'gray-matter'
import { useForm } from 'react-hook-form'
import Form from '@imput/components/form'
import { Button } from '@imput/components/Button'
import toast from 'react-hot-toast'
import { Widgets } from '../../../cms/contexts/cmsContext/context'
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
import { Descendant } from 'slate'
import { CaretLeft } from '@imput/components/Icon'
import { EditorFields } from '../../components/editor/fields'
import { Preview } from '../../components/Preview'
import { DepthProvider } from '../../components/editor/depthContext'
import { Navbar } from '../../components/atoms/Navbar'

interface EditorPageProps {
  document?: ReturnType<typeof useGetContent>['data']
  slug?: string
}

const EditorPage = ({ document, slug = '{{slug}}' }: EditorPageProps) => {
  const { currentCollection, currentFile, components } = useCMS()

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
      serializedBody: '',
      body: [] as (Descendant & { id: string })[],
      ...defaultValues(),
    },
  })

  const [isInitialized, setIsInitialized] = React.useState(false)
  // initialize default values to the form
  useEffect(() => {
    if (document && !isInitialized) {
      setIsInitialized(true)
      const { content: serializedBody, data: grayMatterObj } = matter(
        document.markdown
      )
      const rawBody = deserialize(serializedBody, components || [])
      form.reset({
        ...grayMatterObj,
        body: rawBody.result,
        serializedBody: serializedBody,
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
    const { body, serializedBody, ...rest } = mergedValues
    const content = matter.stringify(serializedBody, {
      ...rest,
    })
    setMarkdown(content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { cms, collection } = useParams<{ cms: string; collection: string }>()

  if (markdown) {
    return (
      <DepthProvider>
        <Layout
          navbar={
            <Navbar
              leftSlot={
                <Button
                  variant="outline"
                  className="imp-gap-1"
                  onClick={() => {
                    const pathParts = window.location.pathname.split('/')
                    pathParts.pop()
                    const newPath = pathParts.join('/')
                    navigate(newPath)
                  }}
                >
                  <CaretLeft size={16} />
                  Back to {currentCollection.name}
                </Button>
              }
              rightSlot={
                <div className="imp-py-2">
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
            />
          }
        >
          {({ navbarHeight }) => (
            <div className="imp-flex imp-flex-row imp-items-stretch imp-gap-4 imp-flex-1">
              <div
                className="imp-overflow-y-auto imp-p-4 imp-flex-1 imp-border-r imp-border-border"
                style={{
                  maxHeight: `calc(100vh - ${navbarHeight}px)`,
                }}
              >
                <Form
                  id="content-form"
                  form={form}
                  className="imp-mb-[15ch]"
                  // debug
                  onSubmit={() => {
                    const id = toast.loading('Saving content...')
                    const { body, serializedBody, ...rest } =
                      getCorrectedFormValues()
                    const content = matter.stringify(serializedBody, rest)
                    console.log(content)
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
                          queryClient.removeQueries({
                            queryKey: queryKeys.github.collection(
                              currentCollection.folder
                            ).queryKey,
                            exact: false,
                          })

                          // We can get a big UX win here by upating the cache with the data we get back
                          queryClient.removeQueries({
                            queryKey: queryKeys.github.content(
                              currentCollection.folder,
                              filename
                            ).queryKey,
                            exact: false,
                          })

                          // redirect to the file we've just created
                          if (isNewFile) {
                            navigate(`/${cms}/${collection}/${filename}`, {
                              replace: true,
                            })
                          }
                        },
                        onError: (err) => {
                          const error = err as Error
                          toast.error(
                            error?.message
                              ? `${error.message} - Please try again`
                              : `Error - Please try again`,
                            {
                              id,
                            }
                          )
                        },
                      }
                    )
                  }}
                >
                  <div className="imp-flex imp-flex-col imp-gap-2">
                    <EditorFields fields={currentCollection.fields} />
                  </div>
                </Form>
              </div>
              <div
                className="imp-overflow-y-auto imp-flex-1 imp-flex imp-flex-col"
                style={{
                  maxHeight: `calc(100vh - ${navbarHeight}px)`,
                }}
              >
                <Preview formValues={formValues} markdown={markdown} />
              </div>
            </div>
          )}
        </Layout>
      </DepthProvider>
    )
  }

  return <Loader />
}

export default EditorPage
