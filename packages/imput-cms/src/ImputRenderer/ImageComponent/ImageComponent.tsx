import { useMemo } from 'react'
import { useImages } from '../../cms/contexts/imageContext/useImageContext'

type ImageComponentProps = {
  CustomComponent?: React.ComponentType<
    React.ImgHTMLAttributes<HTMLImageElement>
  >
}

/**
 * Confusing but this is to fix an issue with newly uploaded images.
 *
 * With static sites, if an image is uploaded via the editor, it won't be
 * available publicly until the site re-builds and deploys.
 *
 * We get around this in the editor by loading all of our images as local
 * blobs, but obviously this doesn't work in the custom Preview because it's
 * just translating markdown to html.
 *
 * This component overrides the default img and instead displays the local blob.
 *
 * If the user has specified a custom image component for preview, it passes the
 * blob url as `src`, which means it should still work!
 */
export const ImageComponent = (
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > &
    ImageComponentProps
) => {
  const { src, CustomComponent, ...rest } = props
  const { images } = useImages()

  const blobUrl = useMemo(() => {
    return images.find((i) => i.filename === src)?.blobUrl
  }, [images, src])

  if (CustomComponent) {
    return <CustomComponent {...rest} src={blobUrl} />
  }

  return <img {...rest} src={blobUrl} key={src} />
}
