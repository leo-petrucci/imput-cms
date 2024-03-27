import { MDXProvider } from '@mdx-js/react'
import React from 'react'

/**
 * This component will replace JSX with actual components.
 * We use it both in the editor and in the frontend when rendering articles.
 */
const MdxProvider = (props: React.ComponentProps<typeof MDXProvider>) => {
  return <MDXProvider {...props} />
}

export { MdxProvider }
