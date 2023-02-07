import { useImages } from '../../../cms/contexts/imageContext/useImageContext'
import { useOnScreen } from '../../../cms/utils/useOnScreen'
import React from 'react'
import Box from '../../../cms/components/designSystem/box'
import { CustomCSS } from '../../../../stitches.config'

/**
 * Displays an image from local state, if the image has not yet been loaded to state it loads it and displays it
 */
const Image = ({
  path,
  css,
}: {
  path: string | undefined
  css?: CustomCSS
}) => {
  const { images, loadImage, setImages } = useImages()
  const imageBlobUrl = path
    ? images.find((i) => i.filename.includes(path))?.blobUrl
    : undefined

  const ref: any = React.useRef<HTMLDivElement>()
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref)

  // if the image isn't currently loaded into state we wait until its shown on screen and then load it
  React.useEffect(() => {
    const doLoad = async () => {
      if (path) {
        const loadedImage = await loadImage(path)
        setImages((i) => [...i, loadedImage])
      }
    }
    if (imageBlobUrl === undefined && onScreen) {
      doLoad()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBlobUrl, onScreen])

  return (
    <Box
      ref={ref}
      css={{
        backgroundImage: `url(${imageBlobUrl})`,
        height: '12rem',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...css,
      }}
    />
  )
}

export default Image
