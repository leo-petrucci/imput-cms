import { MdxProvider } from '../ImputProvider'
import { useMDXComponents } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { evaluate } from '@mdx-js/mdx'
import React, { useEffect } from 'react'
import { Descendant } from 'slate'
import { serialize } from '../cms/components/editor'
import { WarningCircle } from '@imput/components/Icon'
import { Badge } from '@imput/components/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@imput/components/Tooltip'
import { useFrame } from 'react-frame-component'
import ErrorBoundary from '@imput/components/errorBoundary'
import { useCMS } from '../cms/contexts/cmsContext/useCMSContext'

const MdxRenderer = ({
  descendants,
  components,
}: {
  descendants: (Descendant & {
    id: string
  })[]
  components?: React.ComponentProps<typeof MdxProvider>['components']
}) => {
  const { document } = useFrame()
  const { currentCollection } = useCMS()

  /**
   * We fetch all the styles associated with the collection
   * and insert them into our preview iFrame
   */
  useEffect(() => {
    const getStyles = async () => {
      const fetchPromises = currentCollection.preview?.styles?.map((path) =>
        fetch(path)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.text()
          })
          .catch((error) => {
            console.error(`Failed to fetch ${path}: ${error.message}`)
            return null
          })
      )

      if (!fetchPromises) {
        return
      }
      const results = await Promise.allSettled(fetchPromises)

      const styles = results
        .filter((result) => result.status === 'fulfilled')
        // @ts-expect-error promises types are silly
        .map((r) => r.value)
      for (const style of styles) {
        document?.head.insertAdjacentHTML(
          'beforeend',
          `<style>${style}</style>`
        )
      }
    }
    getStyles()
  }, [])

  return (
    <MdxProvider components={components}>
      {descendants.map((d) => (
        <InternalRenderer descendant={d} key={d.id} />
      ))}
    </MdxProvider>
  )
}

/**
 * Parses and compiles MDX on the fly returning React code to be displayed.
 * In case of errors it waits until the next successful compile to update.
 * @param mdx - the mdx to parse
 * @returns
 */
function useMDX(mdx: string) {
  const [exports, setExports] = React.useState<{ default: any }>({
    // @ts-ignore
    default: runtime.Fragment,
  })

  const [errored, setErrored] = React.useState(false)

  React.useEffect(() => {
    // @ts-ignore
    evaluate(mdx, {
      ...runtime,
      useMDXComponents: useMDXComponents,
    })
      .then((exports: any) => {
        setExports(exports)
        setErrored(false)
      })
      .catch(() => {
        console.log('errored, not updating')
        setErrored(true)
      })
  }, [mdx])

  return { exports, errored }
}

const InternalRenderer = ({ descendant }: { descendant: Descendant }) => {
  const mdx = React.useMemo(() => {
    return serialize(descendant as any) || ''
  }, [descendant])

  const { exports, errored } = useMDX(mdx)
  const Content = exports.default

  return (
    <>
      <span className="imp-relative">
        {errored && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="imp-absolute imp-right-2 imp-top-2">
                <Badge variant="destructive" className="imp-flex imp-gap-1">
                  <WarningCircle size={16} weight="bold" /> Error
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="imp-max-w-sm">
                This doesn't necessarily mean there's an error with your
                Markdown, it just means we can't display this block!
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <ErrorBoundary>
          <Content />
        </ErrorBoundary>
      </span>
    </>
  )
}

export { MdxRenderer }
