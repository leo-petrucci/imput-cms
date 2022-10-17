import { useRouter } from "next/router";
import React from "react";
import { useCMS } from "../../contexts/cmsContext/useCMSContext";

/**
 * Will redirect user to the first collection in their settings.
 *
 * If there are no collections, display a landing page of some sort?
 */
const HomePage = () => {
  const { collections } = useCMS();
  const router = useRouter();

  React.useEffect(() => {
    if (collections.length) {
      router.replace(`${router.asPath}/${collections[0].name}`);
    }
  }, [collections, router]);

  return <>Loading...</>;
};

export default HomePage;
