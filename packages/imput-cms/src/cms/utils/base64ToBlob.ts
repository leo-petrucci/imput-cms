// this doesn't actually matter, images are the
// only things that can be previewed
const getFiletype = (ext: string) => {
  const extension = ext.toLowerCase()
  switch (extension) {
    case 'png':
      return 'image/png'
    case 'apng':
      return 'image/apng'
    case 'avif':
      return 'image/avif'
    case 'gif':
      return 'image/gif'
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
      return 'image/jpeg'
    case 'svg':
      return 'image/svg'
    case 'webp':
      return 'image/webp'
    case 'mp4':
      return 'video/mp4'
    case 'webm':
      return 'video/webm'
    case 'mpeg':
      return 'video/mpeg'
    default:
      return 'image/png'
  }
}

/**
 * Converts a `base64Image` to a blob and returns it
 */
export const base64ToBlob = async (base64Image: string, extension: string) => {
  const byteCharacters = Buffer.from(base64Image, 'base64').toString('binary')
  // const byteCharacters = atob(base64Image)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  const blob = new Blob([byteArray], { type: getFiletype(extension) })

  return blob
}
