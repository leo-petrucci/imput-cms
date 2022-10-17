import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  auth: {
    token: null,
    user: (token: string) => token,
  },
  github: {
    collection: (type: string) => type,
    fileBlob: (sha: string) => sha,
  },
});
