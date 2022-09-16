import { NextPage } from "next";
import { useRouter } from "next/router";

const NextCMS: NextPage = () => {
  const router = useRouter();

  console.log(router);

  return <>Cms</>;
};

export default NextCMS;
