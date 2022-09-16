import { NextPage } from "next";
import { useRouter } from "next/router";

/**
 * Central routing point for all of our CMS pages
 */
const NextCMSRoutes: NextPage = () => {
  const router = useRouter();

  console.log(router);

  return <>Cms</>;
};

export default NextCMSRoutes;
