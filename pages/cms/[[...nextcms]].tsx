import NextCMS from "../../cms";

const CMS = () => (
  <NextCMS
    {...{
      settings: {
        backend: {
          name: "github",
          repo: "creativiii/sqlite",
          branch: "main",
          base_url: "https://sqlite-experiment.vercel.app/",
          auth_endpoint: "api/auth",
        },
        collections: [
          {
            name: "blog",
            label: "Blog",
            folder: "_posts/blog",
            create: true,
            slug: "{{slug}}",
            fields: [
              { label: "Title", name: "title", widget: "string" },
              {
                label: "Featured Image",
                name: "thumbnail",
                widget: "image",
                required: false,
              },
              { label: "Body", name: "body", widget: "markdown" },
            ],
          },
        ],
      },
    }}
  />
);

export default CMS;
