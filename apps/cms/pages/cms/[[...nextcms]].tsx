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
        media_folder: 'examples/cms/public/images',
        public_folder: 'images',
        collections: [
          {
            name: 'blog',
            label: 'Blog',
            folder: 'examples/cms/_posts/blog',
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
                widget: 'datetime',
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
          },
          {
            name: 'authors',
            label: 'Authors',
            folder: 'examples/cms/_posts/authors',
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
            folder: 'examples/cms/_posts/categories',
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
