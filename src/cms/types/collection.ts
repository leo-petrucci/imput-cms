import { useGetGithubCollection } from '../../cms/queries/github'
import { NonUndefined } from 'react-hook-form'

export type CollectionType = NonUndefined<
  ReturnType<typeof useGetGithubCollection>['data']
>[0]
