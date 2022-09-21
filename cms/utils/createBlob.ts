import axios from "axios";
import mime from "mime";

/**
 * Uses fetch api to load a blob at `url` and returns the `blobUrl` and the `file` information
 */
export async function createBlob(url: string): Promise<string> {
  const response = await axios({
    method: "GET",
    url,
    responseType: "blob",
  });
  const fileType = mime.getType(new URL(url).pathname.split(".").pop()!.trim());
  const file = new File(
    [response.data],
    `${new URL(url).pathname.split("/").pop()?.trim()}`,
    {
      type: fileType!,
    }
  );
  const blobUrl = URL.createObjectURL(new Blob([file], { type: file.type }));
  return blobUrl;
}
