'use client'

import { Components } from '../MdxComponents'
import { MDXRemote as MDXRemotePrimitive } from 'next-mdx-remote'

const MDXRemote = ({ serialized }: any) => {
  return <MDXRemotePrimitive {...serialized!} components={Components} />
}

export { MDXRemote }
