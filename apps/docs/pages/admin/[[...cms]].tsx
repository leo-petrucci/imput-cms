import dynamic from 'next/dynamic'

const NextCMS = dynamic(() => import('local-meow-cms'), {
  ssr: false,
})

const blocks: any[] = [
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
  {
    name: 'ReactComponent',
    label: 'My first block',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: {
          widget: 'string',
        },
      },
      {
        name: 'date',
        label: 'Date',
        type: {
          widget: 'date',
        },
      },
      {
        name: 'datetime',
        label: 'DateTime',
        type: {
          widget: 'datetime',
        },
      },
      {
        name: 'boolean',
        label: 'Boolean',
        type: {
          widget: 'boolean',
        },
      },
      {
        name: 'variant',
        label: 'Variant',
        type: {
          widget: 'select',
          options: ['option1', 'option2'],
        },
      },
      {
        name: 'padding',
        label: 'Padding',
        type: {
          widget: 'select',
          options: [4, 8, 12],
        },
      },
      {
        name: 'object',
        label: 'Object',
        type: {
          widget: 'json',
        },
      },
      {
        name: 'array',
        label: 'Array',
        type: {
          widget: 'json',
        },
      },
      {
        name: 'children',
        label: 'Content',
        type: {
          widget: 'markdown',
        },
      },
    ],
  },
]

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: 'github',
          repo: 'creativiii/meow-cms',
          branch: 'feature/more-docs-improvements',
          base_url: 'http://localhost:3000/',
          auth_endpoint: 'api/authorize',
        },
        media_folder: 'examples/docs/public/images',
        public_folder: '/images',
        collections: [
          {
            name: 'quick-start',
            label: 'Quick Start',
            folder: 'apps/docs/pages/docs/quick-start',
            create: true,
            slug: '{{name}}',
            extension: 'mdx',
            fields: [
              { label: 'Name', name: 'name', widget: 'string' },
              { label: 'Content', name: 'body', widget: 'markdown' },
            ],
            blocks,
          },
          {
            name: 'docs',
            label: 'Docs',
            folder: 'apps/docs/pages/docs',
            create: true,
            slug: '{{name}}',
            extension: 'mdx',
            fields: [
              { label: 'Name', name: 'name', widget: 'string' },
              { label: 'Content', name: 'body', widget: 'markdown' },
            ],
            blocks,
          },
        ],
      },
    }}
  />
)

export default CMS
