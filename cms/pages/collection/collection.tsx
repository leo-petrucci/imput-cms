import { useRouter } from "next/router";
import { useCMS } from "../../contexts/cmsContext/useCMSContext";
import { useGetGithubCollection } from "../../queries/github";

const CollectionPage = () => {
  const router = useRouter();
  const { collections } = useCMS();
  const [collection] = router.query.nextcms as string[];
  const { isSuccess, data } = useGetGithubCollection(
    collections.find((c) => c.name === collection)!.folder ||
      collections[0].folder
  );

  console.log(data, isSuccess);

  return (
    <>
      {isSuccess &&
        data!.data.tree.map((content) => (
          <button key={content.path}>{content.path}</button>
        ))}
    </>
  );
};

export default CollectionPage;
