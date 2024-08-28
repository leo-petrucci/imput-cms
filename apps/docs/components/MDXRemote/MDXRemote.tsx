'use client'

import { Components } from '../MdxComponents'
import { MDXRemote as MDXRemotePrimitive } from 'next-mdx-remote/rsc'

const MDXRemote = ({
  source,
  components,
}: {
  source: string
  components?: any
}) => {
  return (
    // @ts-expect-error
    <MDXRemotePrimitive
      source={source}
      components={{ ...Components, ...(components || {}) }}
      options={{}}
    />
  )
}

export { MDXRemote }
