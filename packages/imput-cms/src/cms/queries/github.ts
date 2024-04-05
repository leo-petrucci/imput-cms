import { Octokit } from 'octokit'
import { Buffer } from 'buffer'
import { useMutation, useQuery, defaultContext } from '@tanstack/react-query'
import { useCMS } from '../../cms/contexts/cmsContext/useCMSContext'
import { getToken } from '../../cms/queries/auth'
import { queryKeys } from '../../cms/queries/keys'
import { slugify } from '../../cms/utils/slugify'
import { Endpoints } from '@octokit/types'
import matter from 'gray-matter'
import React from 'react'
import get from 'lodash/get'

type FilesWithDate =
  Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}'] & {
    data: {
      tree: ({
        date: string
      } & Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']['data']['tree'][0])[]
    }
  }

/**
 * Fetch an entire collection (a Github folder) and parses it to return usable objects
 * @param type the name of the folder we want to load
 */
export const useGetGithubCollection = (type: string) => {
  const { backend, collections } = useCMS()

  // we can't use `currentCollection` from `useCMS` because that's defined by which folder we've loaded
  // we need to get the correct folder per hook call
  const currentCollection = React.useMemo(
    () => collections.find((c) => c.folder === type),
    [type]
  )

  // stop it here in case collection can't be found
  if (!currentCollection) {
    throw new Error(`Collection ${type} does not exist.`)
  }

  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    currentCollection.orderBy?.direction || 'asc'
  )

  const [sortBy, setSortBy] = React.useState(
    currentCollection.orderBy?.value || currentCollection.fields[0].name
  )

  const [owner, repo] = React.useMemo(() => backend.repo.split('/'), [])

  const query = useQuery({
    queryKey: queryKeys.github.collection(type, sortBy, sortDirection).queryKey,
    context: defaultContext,
    queryFn: async () => {
      const octokit = new Octokit({
        auth: getToken(),
      })

      let files:
        | Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']
        | undefined

      try {
        files = await octokit.request(
          'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
          {
            owner,
            repo,
            tree_sha: `${backend.branch}:${type}`,
          }
        )
      } catch (err) {
        throw new Error("Couldn't find files :(")
      }

      // if the repo has no content, then the folder won't exist and cause a 404
      // this prevents that from happening by simply returning an empty array
      if (!files) {
        return []
      }

      /**
       * This code fetches last update data from Github, but it's horribly slow and expesive.
       * Effectively this is replaced by custom sorting per-collection, might look in the future to
       * enabling it again.
       */

      // // these will all get fetched at the same time, saving us a ton of time
      // const commits = await Promise.all(
      //   files.data.tree.map((file) =>
      //     octokit.request('GET /repos/{owner}/{repo}/commits', {
      //       owner,
      //       repo,
      //       sha: backend.branch,
      //       path: `${type}/${file.path}`,
      //       page: 1,
      //       per_page: 1,
      //     })
      //   )
      // )

      // // need to get commit info for each file to get when they were last updated
      // for (const [i, file] of files.data.tree.entries()) {
      //   // @ts-ignore
      //   // assign the date to the original object
      //   file.date = commits[i].data[0].commit.author?.date
      // }

      // // this tells typescript that we've added a `date` to the object
      // const filesWithDate = files as unknown as FilesWithDate

      const decodedFiles = await Promise.all(
        files.data.tree
          // this will filter out non-files from the results
          .filter((t) => t.mode === '100644')
          .map(async (file) => {
            const blob = await octokit.request(
              'GET /repos/{owner}/{repo}/git/blobs/{file_sha}',
              {
                owner,
                repo,
                file_sha: file.sha!,
              }
            )
            const buf = Buffer.from(blob.data.content, 'base64')

            const decoded = matter(buf.toString('utf-8'))

            return {
              ...decoded,
              filename: file.path,
              // updatedAt: file.date,
              slug: file.path?.split(`.${currentCollection.extension}`)[0],
              markdown: buf.toString('utf-8'),
            }
          })
      ).then((d) =>
        d
          .sort((a, b) => {
            switch (sortBy) {
              // case 'updatedAt':
              //   const aTime = new Date(get(a, sortBy)).getTime()
              //   const bTime = new Date(get(b, sortBy)).getTime()
              //   if (sortDirection === 'desc') return bTime - aTime
              //   return aTime - bTime
              default:
                // this will access data from gray matter
                const key = `data.${sortBy}`

                // get what type of widget the collection is
                const keyType = currentCollection.fields.find(
                  (f) => f.name === sortBy
                )

                // then depending on the widget we switch how we sort it
                if (keyType?.widget) {
                  switch (keyType.widget) {
                    case 'date':
                    case 'datetime':
                      const aTime = new Date(get(a, key)).getTime()
                      const bTime = new Date(get(b, key)).getTime()
                      if (sortDirection === 'desc') return bTime - aTime
                      return aTime - bTime
                    case 'string':
                      if (sortDirection === 'desc') {
                        return get(a, key) > get(b, key) ? -1 : 1
                      }
                      return get(b, key) > get(a, key) ? -1 : 1
                  }
                }

                return get(b, key) - get(a, key)
            }
          })
          // remove any files that don't match our filetype
          .filter((c) =>
            c.filename?.endsWith(`.${currentCollection.extension}`)
          )
      )

      return decodedFiles
    },
  })

  return {
    ...query,
    sorting: {
      // return values that we can filter for
      options: [
        // reserved word
        // 'updatedAt',
        ...currentCollection.fields
          .filter((f) => ['date', 'datetime', 'string'].includes(f.widget))
          .map((o) => o.name),
      ],
      sortBy,
      setSortBy,
      sortDirection,
      setSortDirection,
    },
  }
}
/**
 * Fetch all image data from the connected repo.
 * NOTE: doesn't download images, just their info.
 */
export const useGetGithubImages = () => {
  const { backend, media_folder } = useCMS()
  const [owner, repo] = backend.repo.split('/')

  return useQuery({
    queryKey: queryKeys.github.collection(media_folder).queryKey,
    context: defaultContext,
    queryFn: async () => {
      const octokit = new Octokit({
        auth: getToken(),
      })

      let files:
        | Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']
        | undefined

      try {
        files = await octokit.request(
          'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
          {
            owner,
            repo,
            tree_sha: `${backend.branch}:${media_folder}`,
          }
        )
      } catch (err) {
        throw new Error("Couldn't find files :(")
      }

      // if the repo has no content, then the folder won't exist and cause a 404
      // this prevents that from happening by simply returning an empty array
      if (!files) {
        return {
          data: {
            tree: [] as Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']['data']['tree'],
          },
        } as Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']
      }

      // these will all get fetched at the same time, saving us a ton of time
      const commits = await Promise.all(
        files.data.tree.map((file) =>
          octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner,
            repo,
            sha: backend.branch,
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
          tree: filesWithDate.data.tree
            // filter out anything that isn't a file
            .filter((t) => t.mode === '100644')
            .sort((a, b) => {
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
 * Return a single piece of content from the already loaded collection.
 * @param type the folder our content is part of
 * @param slug the specific content's unique slug
 * @returns
 */
export const useGetContent = (type: string, slug: string) => {
  const { data, isSuccess, isError } = useGetGithubCollection(type)
  const query = useQuery({
    ...queryKeys.github.content(type, slug),
    context: defaultContext,
    queryFn: async () => {
      const content = data!.find((d) => d.slug === slug)

      return content
    },
    enabled: isSuccess,
  })

  return { ...query, collectionIsError: isError }
}

/**
 * Returns an utf-8 decoded file fetched from a bae64 encoded sha
 * @deprecated
 */
export const useGetGithubDecodedFile = (sha: string | undefined) => {
  const { backend } = useCMS()
  const [owner, repo] = backend.repo.split('/')
  return useQuery({
    ...queryKeys.github.fileBlob(sha!),
    context: defaultContext,
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
      message: `Updated "${filename}" from ImputCMS`,
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
      const re = /(?:\.([^.]+))?$/
      // separate file's extension
      const [reFullExt, reExt] = re.exec(filename) as unknown as [
        string,
        string,
      ]

      // get the filename only without the extension
      const splitFilename = filename.split(reFullExt)[0]

      // slugify it
      const slugifiedFilename = slugify(splitFilename)
      const blob = await fileToBlob(file)
      const content = await blobToBase64(blob)

      const res = await saveToGithub(
        {
          owner,
          repo,
          branch,
        },
        `${slugifiedFilename}.${reExt}`,
        {
          type: 'file',
          content: content.split(',')[1],
          path: `${media_folder}/${slugifiedFilename}.${reExt}`,
          encoding: 'base64',
        }
      )

      return {
        path: `${slugifiedFilename}.${reExt}`,
        sha: res.sha,
      }
    },
  })
}
