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

  return (
    <>
      {isSuccess &&
        data!.data.tree
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
