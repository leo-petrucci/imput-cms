import axios from 'axios'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from '@/components/MDXRemote/MDXRemote'

export const revalidate = 60 // revalidate this page every 60 seconds

const Page = async () => {
  const mdx = await axios.get('http://localhost:3000/content/homepage.mdx')
  const serialized = await serialize(mdx.data, {
    parseFrontmatter: true,
    mdxOptions: {
      development: process.env.NODE_ENV === 'development',
    },
  })

  return <MDXRemote serialized={serialized} />
}

export default Page
