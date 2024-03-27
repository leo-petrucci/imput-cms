import { MdxProvider } from '../ImputProvider'
import { useMDXComponents } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { evaluate } from '@mdx-js/mdx'
import React from 'react'
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
import ErrorBoundary from '@imput/components/errorBoundary'

const MdxRenderer = ({
  descendants,
  components,
}: {
  descendants: (Descendant & {
    id: string
  })[]
  components?: React.ComponentProps<typeof MdxProvider>['components']
}) => {
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
    <div className="relative min-h-12">
      {errored && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute right-2 top-2">
              <Badge variant="destructive" className="flex gap-1">
                <WarningCircle size={16} weight="bold" /> Error
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              This doesn't necessarily mean there's an error with your Markdown,
              it just means we can't display this block!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <ErrorBoundary>
        <Content />
      </ErrorBoundary>
    </div>
  )
}

export { MdxRenderer }
