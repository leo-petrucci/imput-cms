import React, { useEffect, ReactNode } from 'react'
import { default as FrameComponent, useFrame } from 'react-frame-component'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'

type FramedProps = {
  children: ReactNode
}

const Logic = ({ children }: FramedProps) => {
  const { currentCollection } = useCMS()

  const { document } = useFrame()

  //   useEffect(() => {
  //     const getStyles = async () => {
  //       const fetchPromises = currentCollection.preview?.styles?.map(
  //         (path: string) =>
  //           fetch(path)
  //             .then((response) => {
  //               if (!response.ok) {
  //                 throw new Error(`HTTP error! status: ${response.status}`)
  //               }
  //               return response.text()
  //             })
  //             .catch((error) => {
  //               console.error(`Failed to fetch ${path}: ${error.message}`)
  //               return null
  //             })
  //       )

  //       if (!fetchPromises) {
  //         return
  //       }
  //       const results = await Promise.allSettled(fetchPromises)

  //       const styles = results
  //         .filter((result) => result.status === 'fulfilled')
  //         .map((r) => (r as PromiseFulfilledResult<string>).value)
  //       for (const style of styles) {
  //         document?.head.insertAdjacentHTML(
  //           'beforeend',
  //           `<style>${style}</style>`
  //         )
  //       }
  //     }
  //     getStyles()
  //   }, [document])

  return <>{children}</>
}

export const Frame = ({ children }: FramedProps) => {
  return (
    <FrameComponent
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Logic>{children}</Logic>
    </FrameComponent>
  )
}
