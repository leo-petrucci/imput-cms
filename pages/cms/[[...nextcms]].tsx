import dynamic from "next/dynamic";

// This will ensure all pages are rendered client-side only
const NextCMS = dynamic(() => import("../../cms"), {
  ssr: false,
});

export default NextCMS;
