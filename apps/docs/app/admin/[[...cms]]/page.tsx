import { BlockType } from 'local-meow-cms'
import dynamic from 'next/dynamic'

const NextCMS = dynamic(() => import('local-meow-cms'), {
  ssr: false,
})

const blocks: BlockType[] = [
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
    name: 'Test',
    label: 'Test Component',
    fields: [
      {
        name: 'select',
        label: 'Select',
        type: {
          options: ['Option 1', 'Option 2', 'Option 3'],
          default: 'Option 1',
          widget: 'select',
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
    name: 'ContentLink',
    label: 'Content Link',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: {
          widget: 'string',
        },
      },
      {
        name: 'href',
        label: 'Link',
        type: {
          widget: 'string',
        },
      },
    ],
  },
  {
    name: 'TabsRoot',
    label: 'Tabs',
    fields: [
      {
        name: 'defaultValue',
        label: 'Defailt tab id',
        type: {
          widget: 'string',
        },
      },
      {
        name: 'triggers',
        label: 'Triggers',
        type: {
          widget: 'json',
        },
      },
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
    name: 'TabsContent',
    label: 'Tabs Content',
    fields: [
      {
        name: 'value',
        label: 'Value',
        type: {
          widget: 'string',
        },
      },
      {
        name: 'children',
        label: 'Children',
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
          repo: 'leo-petrucci/meow-cms',
          branch: 'main',
          base_url: 'http://localhost:3000/',
          auth_endpoint: 'api/authorize',
        },
        media_folder: 'apps/docs/public/images',
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
              {
                label: 'Name',
                name: 'name',
                widget: 'string',
                rules: {
                  required: 'This field is required',
                },
              },
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
