import { Octokit } from "octokit";
import { useQuery } from "react-query";
import { queryKeys } from "./keys";

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

export const getToken = () => {
  return getCookie("token");
};

export const useGithubUser = (token: string | undefined) => {
  return useQuery(
    queryKeys.auth.user(token!),
    async () => {
      const octokit = new Octokit({
        auth: getToken(),
      });
      const user = await octokit.request("GET /user");
      return {
        avatar_url: user.data.avatar_url,
        url: user.data.html_url,
        username: user.data.login,
      };
    },
    {
      enabled: token !== undefined,
    }
  );
};

export const useGithubToken = () => {
  return useQuery(queryKeys.auth.token, async () => {
    return getToken();
  });
};
