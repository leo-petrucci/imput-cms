import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  auth: {
    token: null,
    user: (token: string) => [token],
  },
  github: {
    collection: (
      type: string,
      sortBy?: string,
      sortDirection: 'asc' | 'desc' = 'desc'
    ) => {
      if (sortBy) return [type, sortBy, sortDirection]
      return [type]
    },
    content: (type: string, slug: string) => [type, slug],
    fileBlob: (sha: string) => [sha],
  },
})
