import { useRouter } from "next/router";
import { useCMS } from "../../contexts/cmsContext/useCMSContext";
import {
  useGetGithubCollection,
  useGetGithubFileBlob,
} from "../../queries/github";

const ContentPage = () => {
  const router = useRouter();
  const { collections } = useCMS();
  const [collection, file] = router.query.nextcms as string[];
  const thisCollection =
    collections.find((c) => c.name === collection) || collections[0];

  const query = useGetGithubCollection(thisCollection!.folder);

  const sha = query.isSuccess
    ? query.data.data.tree.find(
        (f) => f.path === `${file}.${thisCollection.extension}`
      )!.sha
    : undefined;

  const { data } = useGetGithubFileBlob(
    thisCollection!.folder || collections[0].folder,
    sha
  );

  return <></>;
};

export default ContentPage;
