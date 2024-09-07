import dynamic from 'next/dynamic'

const NextCMS = dynamic(() => import('local-imput-cms'), {
  ssr: false,
})

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: 'github',
          repo: 'leo-petrucci/imput-cms',
          branch: 'main',
          base_url: 'http://localhost:3000/',
          auth_endpoint: 'api/authorize',
        },
        media_folder: 'apps/cms/public/images',
        public_folder: 'images',
        collections: [
          {
            name: 'blog',
            label: 'Blog',
            folder: 'apps/cms/_posts/blog',
            create: true,
            slug: '{{title}}',
            extension: 'md',
            fields: [
              {
                label: 'Published',
                name: 'published',
                widget: 'boolean',
              },
              {
                label: 'Title',
                name: 'title',
                widget: 'string',
              },
              {
                label: 'Select',
                name: 'select',
                widget: 'select',
                options: ['option1', 'option2', 'option3'],
              },
              {
                label: 'MultiSelect',
                name: 'multiSelect',
                widget: 'select',
                multiple: true,
                options: ['option1', 'option2', 'option3'],
              },
              {
                label: 'Categories',
                name: 'categories',
                widget: 'relation',
                collection: 'categories',
                multiple: true,
                display_fields: 'name',
                value_field: 'name',
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
                label: 'Publish Date',
                name: 'date',
                widget: 'date',
              },
              {
                label: 'Featured Image',
                name: 'thumbnail',
                widget: 'image',
              },
              { label: 'Body', name: 'body', widget: 'markdown' },
            ],
            blocks: [
              {
                name: 'ReactComponent',
                label: 'My first block',
                fields: [
                  {
                    name: 'componentProp',
                    label: 'Component',
                    type: {
                      widget: 'markdown',
                    },
                  },
                  {
                    name: 'name',
                    label: 'Name',
                    type: {
                      widget: 'string',
                      multiple: true,
                      default: ['Leo', 'Evie', 'Lucio'],
                    },
                  },
                  {
                    name: 'date',
                    label: 'Date',
                    type: {
                      widget: 'date',
                      default: '2020-01-01',
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
                      default: true,
                    },
                  },
                  {
                    name: 'variant',
                    label: 'Variant',
                    type: {
                      widget: 'select',
                      options: ['option1', 'option2'],
                      default: 'option2',
                    },
                  },
                  {
                    name: 'padding',
                    label: 'Padding',
                    type: {
                      widget: 'select',
                      options: [4, 8, 12],
                      default: 'test',
                    },
                  },
                  {
                    name: 'object',
                    label: 'Object',
                    type: {
                      widget: 'json',
                      default: `{}`,
                    },
                  },
                  {
                    name: 'image',
                    label: 'Image',
                    type: {
                      widget: 'image',
                      default: 'images/screenshot-2023-01-24-at-14.24.01.png',
                    },
                  },
                  {
                    name: 'imageArray',
                    label: 'Image Array',
                    type: {
                      widget: 'image',
                      default: 'images/screenshot-2023-01-24-at-14.24.01.png',
                      multiple: true,
                    },
                  },
                  {
                    name: 'array',
                    label: 'Array',
                    type: {
                      options: ['Option 1', 'Option 2', 'Option 3'],
                      widget: 'select',
                      multiple: true,
                      default: ['Option 1', 'Option 2'],
                    },
                  },
                  {
                    name: 'numberArray',
                    label: 'Array',
                    type: {
                      options: [8, 12, 16],
                      widget: 'select',
                      multiple: true,
                      default: [8, 16],
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
                name: 'Notice',
                label: 'Notice Block',
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
                name: 'Tweet',
                label: 'Tweet Block',
                fields: [
                  {
                    name: 'id',
                    label: 'Tweet Id',
                    type: {
                      widget: 'string',
                    },
                  },
                ],
              },
              {
                name: 'List',
                label: 'Pros and Cons',
                fields: [
                  {
                    name: 'type',
                    label: 'Type',
                    type: {
                      widget: 'select',
                      options: ['tick', 'cross'],
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
            ],
            preview: {
              components: {},
            },
          },
          {
            name: 'authors',
            label: 'Authors',
            folder: 'apps/cms/_posts/authors',
            create: true,
            slug: '{{slug}}',
            extension: 'mdx',
            fields: [
              {
                label: 'Name',
                name: 'name',
                widget: 'string',
              },
              {
                label: 'Avatar',
                name: 'avatar',
                widget: 'image',
              },
              { label: 'Body', name: 'body', widget: 'markdown' },
            ],
          },
          {
            name: 'categories',
            label: 'Categories',
            folder: 'apps/cms/_posts/categories',
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
