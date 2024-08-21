import axios from 'axios'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from '@/components/MDXRemote/MDXRemote'
import { config } from '@/docs.config'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const mdx = await axios.get(`${config.baseUrl}/content/homepage.mdx`)
    console.log('mdx found', mdx.data)
    const serialized = await serialize<
      any,
      {
        title: string
        description: string
      }
    >(mdx.data, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })

    console.log('returning metadata')

    return {
      metadataBase: new URL('https://imput.computer'),
      title: serialized.frontmatter.title,
      description: serialized.frontmatter.description,
      openGraph: {
        title: serialized.frontmatter.title,
        description: serialized.frontmatter.description,
        images: ['/homepage-open-graph.png'],
      },
    }
  } catch (err) {
    console.log("Couldn't get metadata", err)
    return {}
  }
}

export const revalidate = 60 // revalidate this page every 60 seconds

const Page = async () => {
  try {
    const mdx = await axios.get(`${config.baseUrl}/content/homepage.mdx`)
    console.log('mdx found', mdx.data)
    const serialized = await serialize(mdx.data, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })
    console.log('successfully serialized')

    return <MDXRemote serialized={serialized} />
  } catch (err) {
    console.log('Error rendering homepage', err)
    return <></>
  }
}

export default Page
