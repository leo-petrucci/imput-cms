import { NextPage } from "next";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextCMSContext } from "../contexts/cmsContext/context";
import {
  CMSProvider,
  useCMSContext,
} from "../contexts/cmsContext/useCMSContext";

/**
 * Central routing point for all of our private CMS pages
 */
const NextCMSPrivateRoutes: NextPage = () => {
  const { query } = useRouter();
  const settings = useCMSContext();

  console.log(settings);

  /**
   * If query does not exist then we're on the index page, if it does we're on one of the other routes.
   */
  const queryLength = query.nextcms !== undefined ? query.nextcms.length : 0;
  switch (queryLength) {
    // index
    case 0:
      return <>Index page</>;
    // viewing a single category
    case 1:
      return <>Category home</>;
    // viewing a file in a category
    case 2:
      return <>Viewing a page</>;
  }

  return <>Cms fallback</>;
};

const queryClient = new QueryClient();

/**
 * NextCMS wrapper. Checks for login status, sets up contexts, etc.
 */
const NextCMSRoutes = (props: { settings: NextCMSContext["settings"] }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CMSProvider settings={props.settings}>
        <NextCMSPrivateRoutes />
      </CMSProvider>
    </QueryClientProvider>
  );
};

export default NextCMSRoutes;
