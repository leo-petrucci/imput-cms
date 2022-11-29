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
                    name: 'variant',
                    label: 'Variant',
                    type: {
                      widget: 'string',
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
