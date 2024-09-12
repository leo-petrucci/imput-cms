import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from '@imput/components/Button'
import { Endpoints } from '@octokit/types'
import { useUploadFile } from '../../../../../queries/github'
import { useCMS } from '../../../../../contexts/cmsContext/useCMSContext'
import { queryKeys } from '../../../../../queries/keys'
import { UploadSimple } from '@imput/components/Icon'

/**
 * Renders a button that allows uploading images to github. On success, refreshes the local cache with the new data.
 */
const ImageUploadButton = () => {
  const { media_folder } = useCMS()

  const uploadRef = React.useRef<HTMLInputElement | null>()

  const { mutate, isLoading } = useUploadFile()
  const client = useQueryClient()

  return (
    <div>
      <input
        // @ts-ignore
        ref={uploadRef}
        type="file"
        style={{ visibility: 'hidden', display: 'none' }}
        accept="video/*, image/*"
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files?.length > 0) {
            const file = e.target.files[0]
            const id = toast.loading(`Uploading ${file.name}...`)

            const filesize = file.size / 1024 / 1024 // MB

            if (filesize < 100) {
              mutate(
                {
                  filename: file.name,
                  file: file,
                },
                {
                  onSuccess: (newImage) => {
                    toast.success(`${file.name} uploaded!`, { id })

                    // instead of re-fetching images we just add the returned data (`path` and `sha`) to our cache
                    client.setQueryData(
                      queryKeys.github.collection(media_folder).queryKey,
                      // @ts-ignore
                      (
                        oldData: Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['response']
                      ) => {
                        // image might have already been uploaded, so we remove duplicates
                        const uniqueTree = Array.from(
                          new Map(
                            [newImage, ...oldData.data.tree].map((item) => [
                              item['path'],
                              item,
                            ])
                          ).values()
                        )

                        return {
                          ...oldData,
                          data: {
                            ...oldData.data,
                            tree: uniqueTree,
                          },
                        }
                      }
                    )
                  },
                  onError: () => {
                    toast.error(`There was a problem uploading ${file.name}`, {
                      id,
                    })
                  },
                }
              )
            } else {
              toast.error(`You can't upload media bigger than 100MB`, {
                id,
              })
            }
          }
          // reset input
          uploadRef.current!.value = ''
        }}
      />
      <Button
        disabled={isLoading}
        // loading={isLoading}
        onClick={() => {
          uploadRef.current!.click()
        }}
      >
        <UploadSimple className="imp-mr-2 imp-h-4 imp-w-4" />
        Upload
      </Button>
    </div>
  )
}

export default ImageUploadButton
