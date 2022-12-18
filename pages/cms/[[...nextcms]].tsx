import NextCMS from '../../cms'

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: 'github',
          repo: 'creativiii/sqlite-experiment',
          branch: 'main',
          base_url: 'https://sqlite-experiment.vercel.app/',
          auth_endpoint: 'api/auth',
        },
        media_folder: 'public/images',
        public_folder: 'images',
        collections: [
          {
            name: 'blog',
            label: 'Blog',
            folder: '_posts/blog',
            create: true,
            slug: '{{slug}}',
            extension: 'md',
            fields: [
              { label: 'Title', name: 'title', widget: 'string' },
              {
                label: 'Featured Image',
                name: 'thumbnail',
                widget: 'image',
                required: false,
              },
              { label: 'Body', name: 'body', widget: 'markdown' },
            ],
            blocks: [
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
                    name: 'children',
                    label: 'Content',
                    type: {
                      widget: 'markdown',
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
