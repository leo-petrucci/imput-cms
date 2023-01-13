import { Octokit } from 'octokit'
import { Buffer } from 'buffer'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCMS } from '../contexts/cmsContext/useCMSContext'
import { getToken } from './auth'
import { queryKeys } from './keys'
import { ImageState, LoadedImages } from 'cms/contexts/imageContext/context'
import { StringDiff } from 'slate-react/dist/utils/diff-text'
import { useUser } from 'cms/contexts/userContext/userContext'

export const useGetGithubCollection = (type: string) => {
  const { backend } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery({
    ...queryKeys.github.collection(type),
    queryFn: async () => {
      const octokit = new Octokit({
        auth: getToken(),
      })
      return octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner,
        repo,
        tree_sha: `${backend.branch}:${type}`,
      })
    },
  })
}

export const useGetGithubImages = () => {
  const { backend, media_folder } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery({
    ...queryKeys.github.collection(media_folder),
    queryFn: async () => {
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
    },
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
  return useQuery({
    ...queryKeys.github.fileBlob(sha!),
    queryFn: async () => {
      const base64 = await getGithubFileBase64(owner, repo, sha!)

      const buf = Buffer.from(base64, 'base64')
      return buf.toString('utf-8')
    },
    enabled: sha !== undefined,
  })
}

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

/**
 *
 */
export const useSaveMarkdown = (
  /**
   * Folder the updated file will be saved in
   */
  folder: string
) => {
  const {
    media_folder,
    backend,
    backend: { branch },
  } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useMutation({
    mutationFn: async ({
      markdown,
      images,
    }: {
      /**
       * The markdown text content and path of the file that will be updated
       */
      markdown: {
        path: string
        content: string
      }
      /**
       * Images array containing new images that need updated
       */
      images: LoadedImages[]
    }) => {
      const octokit = new Octokit({
        auth: getToken(),
      })

      const blobsToUpload: {
        type: 'file' | 'markdown'
        content: string
        path: string
        sha?: string
        encoding: 'base64' | 'utf-8'
      }[] = []

      // loop through new images
      for (const i of images.filter(
        (image) => image.state === ImageState.New
      )) {
        if (i.blob) {
          try {
            const content = await blobToBase64(i.blob)
            blobsToUpload.push({
              type: 'file',
              content: content.split(',')[1],
              path: `${media_folder}/${i.filename}`,
              encoding: 'base64',
            })
          } catch (err) {
            console.log(err)
          }
        }
      }

      blobsToUpload.push({
        type: 'markdown',
        content: markdown.content,
        path: markdown.path,
        encoding: 'utf-8',
      })

      for (let blob of blobsToUpload) {
        const sha = await octokit.request(
          'POST /repos/{owner}/{repo}/git/blobs',
          {
            owner,
            repo,
            content: blob.content,
            encoding: blob.encoding,
          }
        )
        blob.sha = sha.data.sha
      }

      // info about the current branch e.g. last commit sha, last tree sha, etc
      const currentBranch = await octokit.request(
        'GET /repos/{owner}/{repo}/branches/{branch}',
        {
          owner,
          repo,
          branch,
        }
      )

      const tree = await octokit.request(
        'POST /repos/{owner}/{repo}/git/trees',
        {
          owner,
          repo,
          // @ts-ignore
          tree: blobsToUpload.map((b) => ({
            path: b.path,
            mode: '100644',
            type: 'blob',
            sha: b.sha,
          })),
          base_tree: currentBranch.data.commit.commit.tree.sha,
        }
      )

      const commit = await octokit.request(
        'POST /repos/{owner}/{repo}/git/commits',
        {
          owner,
          repo,
          message: 'Updated by Meow',
          tree: tree.data.sha,
          parents: [currentBranch.data.commit.sha],
        }
      )

      return octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commit.data.sha,
      })
    },
  })
  // return useMutation({
  //   onSuccess: () => {},
  //   mutationFn: async (
  //     /**
  //      * Folder the updated file will be saved in
  //      */
  //     folder: string,
  //     /**
  //      * The markdown text content of the file that will be updated
  //      */
  //     markdown: string,
  //     /**
  //      * Images array containing new images that need updated
  //      */
  //     images: LoadedImages[]
  //   ) => {
  //     return axios.post('/todos', newTodo)
  //   },
  // })
}
