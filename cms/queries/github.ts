import { Octokit } from 'octokit'
import { Buffer } from 'buffer'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCMS } from 'cms/contexts/cmsContext/useCMSContext'
import { getToken } from 'cms/queries/auth'
import { queryKeys } from 'cms/queries/keys'
import { slugify } from 'cms/utils/slugify'
import { Endpoints } from '@octokit/types'

type FilesWithDate =
  Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}'] & {
    data: {
      tree: ({
        date: string
      } & Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']['data']['tree'][0])[]
    }
  }

export const useGetGithubCollection = (type: string) => {
  const { backend } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery({
    ...queryKeys.github.collection(type),
    queryFn: async () => {
      const octokit = new Octokit({
        auth: getToken(),
      })
      const files = await octokit.request(
        'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
        {
          owner,
          repo,
          tree_sha: `${backend.branch}:${type}`,
        }
      )

      // these will all get fetched at the same time, saving us a ton of time
      const commits = await Promise.all(
        files.data.tree.map((file) =>
          octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner,
            repo,
            path: `${type}/${file.path}`,
            page: 1,
            per_page: 1,
          })
        )
      )

      // need to get commit info for each file to get when they were last updated
      for (const [i, file] of files.data.tree.entries()) {
        // @ts-ignore
        // assign the date to the original object
        file.date = commits[i].data[0].commit.author?.date
      }

      // this tells typescript that we've added a `date` to the object
      const filesWithDate = files as unknown as FilesWithDate

      // order the files in descending order with newest first
      const orderedFiles = {
        ...filesWithDate,
        data: {
          ...filesWithDate.data,
          tree: filesWithDate.data.tree.sort((a, b) => {
            return +new Date(b.date) - +new Date(a.date)
          }),
        },
      }

      return orderedFiles
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
      const files = await octokit.request(
        'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
        {
          owner,
          repo,
          tree_sha: `${backend.branch}:${media_folder}`,
        }
      )

      // these will all get fetched at the same time, saving us a ton of time
      const commits = await Promise.all(
        files.data.tree.map((file) =>
          octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner,
            repo,
            path: `${media_folder}/${file.path}`,
            page: 1,
            per_page: 1,
          })
        )
      )

      // need to get commit info for each file to get when they were last updated
      for (const [i, file] of files.data.tree.entries()) {
        // @ts-ignore
        // assign the date to the original object
        file.date = commits[i].data[0].commit.author?.date
      }

      // this tells typescript that we've added a `date` to the object
      const filesWithDate = files as unknown as FilesWithDate

      // order the files in descending order with newest first
      const orderedFiles = {
        ...filesWithDate,
        data: {
          ...filesWithDate.data,
          tree: filesWithDate.data.tree.sort((a, b) => {
            return +new Date(b.date) - +new Date(a.date)
          }),
        },
      }

      return orderedFiles
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
    // enabled: sha !== undefined,
  })
}

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

type BlobToSave = {
  type: 'file' | 'markdown'
  content: string
  path: string
  sha?: string
  encoding: 'base64' | 'utf-8'
}

/**
 * Save a file to github
 */
const saveToGithub = async (
  { owner, repo, branch }: { owner: string; repo: string; branch: string },
  filename: string,
  blob: BlobToSave
) => {
  const octokit = new Octokit({
    auth: getToken(),
  })

  const sha = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
    owner,
    repo,
    content: blob.content,
    encoding: blob.encoding,
  })
  blob.sha = sha.data.sha

  // info about the current branch e.g. last commit sha, last tree sha, etc
  const currentBranch = await octokit.request(
    'GET /repos/{owner}/{repo}/branches/{branch}',
    {
      owner,
      repo,
      branch,
    }
  )

  const tree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    owner,
    repo,
    tree: [
      {
        path: blob.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      },
    ],
    base_tree: currentBranch.data.commit.commit.tree.sha,
  })

  const commit = await octokit.request(
    'POST /repos/{owner}/{repo}/git/commits',
    {
      owner,
      repo,
      message: `Updated "${filename}" from MeowCMS`,
      tree: tree.data.sha,
      parents: [currentBranch.data.commit.sha],
    }
  )

  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commit.data.sha,
  })

  return {
    sha: sha.data.sha,
  }
}

/**
 * Save the currently opened markdown document.
 */
export const useSaveMarkdown = (
  /**
   * File being edited, used for nice commit messages
   */
  filename: string
) => {
  const {
    backend,
    backend: { branch },
  } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useMutation({
    mutationFn: async ({
      markdown,
    }: {
      /**
       * The markdown text content and path of the file that will be updated
       */
      markdown: {
        path: string
        content: string
      }
    }) => {
      return await saveToGithub(
        {
          owner,
          repo,
          branch,
        },
        filename,
        {
          type: 'markdown',
          content: markdown.content,
          path: markdown.path,
          encoding: 'utf-8',
        }
      )
    },
  })
}

const fileToBlob = async (file: File) =>
  new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type })

/**
 * Upload a `File` to Github
 */
export const useUploadFile = () => {
  const {
    backend,
    backend: { branch },
    media_folder,
  } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useMutation({
    mutationFn: async ({
      filename,
      file,
    }: {
      /**
       * The name of the file to upload, if duplicate we'll handle it here.
       */
      filename: string
      /**
       * The file which will be uploaded
       */
      file: File
    }) => {
      const slugifiedFilename = slugify(filename)
      const blob = await fileToBlob(file)
      const content = await blobToBase64(blob)
      const res = await saveToGithub(
        {
          owner,
          repo,
          branch,
        },
        filename,
        {
          type: 'file',
          content: content.split(',')[1],
          path: `${media_folder}/${slugifiedFilename}`,
          encoding: 'base64',
        }
      )

      return {
        path: slugifiedFilename,
        sha: res.sha,
      }
    },
  })
}
