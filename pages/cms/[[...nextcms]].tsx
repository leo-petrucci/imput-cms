import NextCMS from '../../cms'

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: 'github',
          repo: 'creativiii/meow-cms',
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
              {
                label: 'Title',
                name: 'title',
                widget: 'string',
                required: true,
              },
              {
                label: 'Published',
                name: 'published',
                widget: 'boolean',
                required: true,
              },
              {
                label: 'Post Author',
                name: 'author',
                widget: 'relation',
                collection: 'authors',
                value_field: 'name',
                display_fields: 'name',
              },
              {
                label: 'Date',
                name: 'date',
                widget: 'date',
                required: true,
              },
              {
                label: 'Datetime',
                name: 'datetime',
                widget: 'datetime',
                required: true,
              },
              {
                label: 'Categories',
                name: 'category',
                widget: 'relation',
                collection: 'categories',
                multiple: true,
                display_fields: 'name',
                value_field: 'name',
              },
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
            ],
          },
          {
            name: 'authors',
            label: 'Authors',
            folder: '_posts/authors',
            create: true,
            slug: '{{slug}}',
            extension: 'mdx',
            fields: [
              {
                label: 'Name',
                name: 'name',
                widget: 'string',
                required: true,
              },
              {
                label: 'Avatar',
                name: 'avatar',
                widget: 'image',
                required: true,
              },
              { label: 'Body', name: 'body', widget: 'markdown' },
            ],
          },
          {
            name: 'categories',
            label: 'Categories',
            folder: '_posts/categories',
            create: true,
            slug: '{{name}}',
            extension: 'mdx',
            fields: [
              { label: 'Name', name: 'name', widget: 'string' },
              { label: 'Visible', name: 'visible', widget: 'boolean' },
              { label: 'Description', name: 'description', widget: 'markdown' },
            ],
          },
        ],
      },
    }}
  />
)

export default CMS
