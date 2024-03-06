import { MdxProvider } from '../MeowProvider'
import { useMDXComponents } from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { evaluate } from '@mdx-js/mdx'
import React from 'react'
import { Descendant } from 'slate'
import { serialize } from '../cms/components/editor'
import { WarningCircle } from '@meow/components/Icon'
import { Badge } from '@meow/components/Badge'

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
    <div className="relative">
      {errored && (
        <Badge
          variant="destructive"
          className="absolute right-2 top-2 flex gap-1"
        >
          <WarningCircle size={16} weight="bold" /> Error
        </Badge>
      )}
      <Content />
    </div>
  )
}

export { MdxRenderer }
