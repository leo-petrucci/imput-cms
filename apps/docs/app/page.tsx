'use client'

import axios from 'axios'
import useSWR from 'swr'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { Components } from '@/components/MdxComponents'

export const revalidate = 60 // revalidate this page every 60 seconds

const Page = () => {
  const { data, isLoading } = useSWR('/content/homepage.mdx', async (arg) => {
    const mdx = await axios.get(arg)
    const serialized = serialize(mdx.data, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    })
    return serialized
  })
  if (isLoading) return <>Loading...</>
  return <MDXRemote {...data!} components={Components} />
}

export default Page
