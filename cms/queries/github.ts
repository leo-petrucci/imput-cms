import { Octokit } from "octokit";
import { useQuery } from "react-query";
import { useCMS } from "../contexts/cmsContext/useCMSContext";
import { getToken } from "./auth";
import { queryKeys } from "./keys";

export const useGetGithubCollection = (type: string) => {
  const { backend } = useCMS();
  const [owner, repo] = backend.repo.split("/");
  return useQuery(queryKeys.github.collection(type), async () => {
    const octokit = new Octokit({
      auth: getToken(),
    });
    return await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner,
        repo,
        tree_sha: `${backend.branch}:${type}`,
      }
    );
  });
};
