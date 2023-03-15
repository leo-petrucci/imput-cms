import dynamic from 'next/dynamic'

const NextCMS = dynamic(() => import('local-meow-cms'), {
  ssr: false,
})

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: 'github',
          repo: 'creativiii/meow-cms',
          branch: 'feature/more-docs-improvements',
          base_url:
            'meow-cms-git-feature-more-to-monorepo-creativiii.vercel.app/',
          auth_endpoint: 'api/auth',
        },
        media_folder: 'examples/docs/public/images',
        public_folder: '/images',
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
            blocks: [
              {
                name: 'PropsTable',
                label: 'Props Table',
                fields: [
                  {
                    name: 'data',
                    label: 'Data',
                    type: {
                      widget: 'json',
                    },
                  },
                ],
              },
              {
                name: 'Note',
                label: 'Note',
                fields: [
                  {
                    name: 'children',
                    label: 'Children',
                    type: {
                      widget: 'markdown',
                    },
                  },
                ],
              },
              {
                name: 'Video',
                label: 'Video',
                fields: [
                  {
                    name: 'src',
                    label: 'Source',
                    type: {
                      widget: 'string',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    }}
  />
)

export default CMS
