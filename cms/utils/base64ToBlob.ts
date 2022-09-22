/**
 * Converts a `base64Image` to a blob and returns it
 */
export const base64ToBlob = async (base64Image: string) => {
  //   const byteCharacters = Buffer.from(data, "base64").toString();
  const byteCharacters = atob(base64Image);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "image/png" });
  return blob;
};
