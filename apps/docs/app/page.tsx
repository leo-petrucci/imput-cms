import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from '@/components/MDXRemote/MDXRemote'
import { Metadata } from 'next'
import fs from 'fs/promises'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const mdx = await fs.readFile(
      process.cwd() + '/public/content/homepage.mdx',
      'utf-8'
    )
    const serialized = await serialize<
      any,
      {
        title: string
        description: string
      }
    >(mdx, {
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
    const mdx = await fs.readFile(
      process.cwd() + '/public/content/homepage.mdx',
      'utf-8'
    )

    return <MDXRemote source={mdx.split('---')[2]} />
  } catch (err) {
    console.log('Error rendering homepage', err)
    return <>test</>
  }
}

export default Page
