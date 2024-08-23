'use client'

import { BlockType } from 'local-imput-cms'
import dynamic from 'next/dynamic'
import { Components } from '@/components/MdxComponents'
import { PreviewWrapper } from '@/components/PreviewWrapper'
import 'nextra-theme-docs/style.css'
import '../../../styles/tailwind.css'

const NextCMS = dynamic(() => import('local-imput-cms'), {
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
        name: 'array',
        label: 'Array',
        type: {
          widget: 'string',
        },
      },
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
          widget: 'image',
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
          repo: 'leo-petrucci/imput-cms',
          branch: 'main',
          base_url:
            process.env.NODE_ENV === 'production'
              ? 'https://www.imput.computer'
              : 'http://localhost:3000/',
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
            orderBy: {
              value: 'order',
              direction: 'asc',
            },
            fields: [
              {
                label: 'Name',
                name: 'name',
                widget: 'string',
                rules: {
                  required: 'This field is required',
                },
              },
              {
                label: 'Order',
                name: 'order',
                widget: 'string',
              },
              { label: 'Content', name: 'body', widget: 'markdown' },
            ],
            preview: {
              components: Components,
              wrapper: PreviewWrapper,
            },
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
            preview: {
              components: Components,
              wrapper: PreviewWrapper,
            },
            blocks,
          },
          {
            name: 'pages',
            label: 'Pages',
            folder: 'apps/docs/public/content',
            create: true,
            slug: '{{name}}',
            extension: 'mdx',
            fields: [
              {
                label: 'Title',
                name: 'title',
                widget: 'string',
                rules: {
                  required: 'This field is required',
                },
              },
              {
                label: 'Description',
                name: 'description',
                widget: 'string',
              },
              { label: 'Content', name: 'body', widget: 'markdown' },
            ],
            preview: {
              components: Components,
            },
            blocks: [
              {
                name: 'Navbar',
                label: 'HomepageNavbar',
              },
              {
                name: 'Header',
                label: 'HomepageHeader',
                fields: [
                  {
                    name: 'title',
                    label: 'Title',
                    type: {
                      widget: 'string',
                    },
                  },
                  {
                    name: 'subtitle',
                    label: 'Subtitle',
                    type: {
                      widget: 'string',
                    },
                  },
                ],
              },
              {
                name: 'VideoHeading',
                label: 'HomepageVideoHeading',
                fields: [
                  {
                    name: 'heading',
                    label: 'Heading',
                    type: {
                      widget: 'string',
                    },
                  },
                  {
                    name: 'videoSrc',
                    label: 'Source',
                    type: {
                      widget: 'image',
                    },
                  },
                ],
              },
              {
                name: 'ImageTextSection',
                label: 'HomepageImageTextSection',
                fields: [
                  {
                    name: 'title',
                    label: 'Title',
                    type: {
                      widget: 'string',
                    },
                  },
                  {
                    name: 'imageSrc',
                    label: 'Source',
                    type: {
                      widget: 'image',
                    },
                  },
                  {
                    name: 'direction',
                    label: 'Direction',
                    type: {
                      widget: 'select',
                      options: ['ltr', 'rtl'],
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
              {
                name: 'Footer',
                label: 'HomepageFooter',
                fields: [
                  {
                    name: 'copyright',
                    label: 'Copyright',
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
