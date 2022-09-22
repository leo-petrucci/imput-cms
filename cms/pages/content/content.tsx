import { useRouter } from "next/router";
import { useCMS } from "../../contexts/cmsContext/useCMSContext";
import Editor from "../../components/editor";
import {
  useGetGithubCollection,
  useGetGithubDecodedFile,
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

  const { data, isSuccess } = useGetGithubDecodedFile(sha);

  if (isSuccess) {
    return <Editor frontMatter={data!} />;
  }

  return <>Loading...</>;
};

export default ContentPage;
