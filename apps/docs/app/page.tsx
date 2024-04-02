import axios from 'axios'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from '@/components/MDXRemote/MDXRemote'
import { config } from '@/docs.config'

export const revalidate = 60 // revalidate this page every 60 seconds

const Page = async () => {
  try {
    const mdx = await axios.get(`${config.baseUrl}/content/homepage.mdx`)
    const serialized = await serialize(mdx.data, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })

    return <MDXRemote serialized={serialized} />
  } catch (err) {
    return <></>
  }
}

export default Page
