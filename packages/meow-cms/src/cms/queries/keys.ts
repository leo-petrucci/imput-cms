import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  auth: {
    token: null,
    user: (token: string) => [token],
  },
  github: {
    collection: (type: string) => [type],
    content: (type: string, slug: string) => [type, slug],
    fileBlob: (sha: string) => [sha],
  },
})
