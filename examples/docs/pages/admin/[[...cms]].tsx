import dynamic from 'next/dynamic'

const NextCMS = dynamic(() => import('meow-cms'), {
  ssr: false,
})

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: 'github',
          repo: 'creativiii/meow-cms',
          branch: 'main',
          base_url: 'https://meow-cms-creativiii.vercel.app/',
          auth_endpoint: 'api/auth',
        },
        media_folder: 'examples/docs/public/images',
        public_folder: 'images',
        collections: [
          {
            name: 'docs',
            label: 'Docs',
            folder: 'examples/docs/pages/docs',
            create: true,
            slug: '{{name}}',
            extension: 'mdx',
            fields: [
              { label: 'Name', name: 'name', widget: 'string' },
              { label: 'Content', name: 'body', widget: 'markdown' },
            ],
          },
        ],
      },
    }}
  />
)

export default CMS
