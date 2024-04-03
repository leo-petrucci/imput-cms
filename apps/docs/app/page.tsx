import axios from 'axios'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from '@/components/MDXRemote/MDXRemote'
import { config } from '@/docs.config'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const mdx = await axios.get(`${config.baseUrl}/content/homepage.mdx`)
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

  return {
    title: serialized.frontmatter.title,
    description: serialized.frontmatter.description,
    openGraph: {
      title: serialized.frontmatter.title,
      description: serialized.frontmatter.description,
      images: ['/homepage-open-graph.png'],
    },
  }
}

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
