import { Octokit } from 'octokit'
import { Buffer } from 'buffer'
import { useQuery } from 'react-query'
import { useCMS } from '../contexts/cmsContext/useCMSContext'
import { getToken } from './auth'
import { queryKeys } from './keys'

export const useGetGithubCollection = (type: string) => {
  const { backend } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery(['github', 'collection', 'type'], async () => {
    const octokit = new Octokit({
      auth: getToken(),
    })
    return await octokit.request(
      'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
      {
        owner,
        repo,
        tree_sha: `${backend.branch}:${type}`,
      }
    )
  })
}

export const useGetGithubImages = () => {
  const { backend, media_folder } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery(queryKeys.github.collection(media_folder), async () => {
    const octokit = new Octokit({
      auth: getToken(),
    })
    return await octokit.request(
      'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
      {
        owner,
        repo,
        tree_sha: `${backend.branch}:${media_folder}`,
      }
    )
  })
}

/**
 * Returns a base64 string for a specific sha file in a repo
 */
export const getGithubFileBase64 = async (
  owner: string,
  repo: string,
  sha: string
) => {
  const octokit = new Octokit({
    auth: getToken(),
  })
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/git/blobs/{file_sha}',
    {
      owner,
      repo,
      file_sha: sha!,
    }
  )
  return response.data.content
}

/**
 * Returns an utf-8 decoded file fetched from a bae64 encoded sha
 */
export const useGetGithubDecodedFile = (sha: string | undefined) => {
  const { backend } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery(
    queryKeys.github.fileBlob(sha!),
    async () => {
      const base64 = await getGithubFileBase64(owner, repo, sha!)

      const buf = Buffer.from(base64, 'base64')
      return buf.toString('utf-8')
    },
    {
      enabled: sha !== undefined,
    }
  )
}

export const useCreateGithubBlobs = () => {}
