import axios from 'axios'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from '@/components/MDXRemote/MDXRemote'
import { config } from '@/docs.config'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
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

const Page = async () => {
  try {
    const mdx = await axios.get(`${config.baseUrl}/content/homepage.mdx`)

    return <MDXRemote source={mdx.data.split('---')[2]} />
  } catch (err) {
    console.log('Error rendering homepage', err)
    return <>test</>
  }
}

export default Page
