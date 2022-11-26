import { useRouter } from "next/router";
import { useCMS } from "../../contexts/cmsContext/useCMSContext";
import { useGetGithubCollection } from "../../queries/github";
import Link from "next/link";

const CollectionPage = () => {
  const router = useRouter();
  const { collections } = useCMS();
  const [collection] = router.query.nextcms as string[];
  const thisCollection = collections.find((c) => c.name === collection);
  const { isSuccess, data } = useGetGithubCollection(
    thisCollection!.folder || collections[0].folder
  );

  const cachedPostsTree = [
    {
      path: "test.md",
      mode: "100644",
      type: "blob",
      sha: "0fb8d413ef659d2776446ae08ad0ec8d4208deb8",
      size: 163,
      url: "https://api.github.com/repos/creativiii/meow-cms/git/blobs/0fb8d413ef659d2776446ae08ad0ec8d4208deb8",
    },
  ];

  return (
    <>
      {true &&
        cachedPostsTree
          .filter((content) =>
            content.path!.includes(thisCollection!.extension)
          )
          .map((content) => {
            const pathWithoutExtension = content.path!.replace(
              `.${thisCollection!.extension}`,
              ""
            );
            return (
              <Link
                key={content.path}
                href={`${router.asPath}/${pathWithoutExtension}`}
              >
                {pathWithoutExtension}
              </Link>
            );
          })}
    </>
  );
};

export default CollectionPage;
