import packageData from "../package.json";
import dataUriToBuffer from "lib/data-uri-to-buffer";
import ImageKit from "imagekit";

const UPLOAD_IO_ACCOUNT_ID = "FW25b4F";
const UPLOAD_IO_PUBLIC_API_KEY = "public_FW25b4FAzSgqxpyPhtmMePN3hSFg";

export async function uploadFile_old(scribbleDataURI) {
  const uploadManager = new Upload.UploadManager(
    new Upload.Configuration({
      apiKey: UPLOAD_IO_PUBLIC_API_KEY,
    })
  );

  const { fileUrl } = await uploadManager.upload({
    accountId: UPLOAD_IO_ACCOUNT_ID,
    data: dataUriToBuffer(scribbleDataURI),
    mime: "image/png",
    originalFileName: "scribble_input.png",
    path: {
      // See path variables: https://www.bytescale.com/docs/path-variables
      folderPath: `/uploads/${packageData.name}/${packageData.version}/{UTC_DATE}`,
      fileName: "{ORIGINAL_FILE_NAME}_{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}",
    },
    metadata: {
      userAgent: navigator.userAgent,
    },
  });

  return fileUrl;
}


export default async function uploadFile(scribbleDataURI) {
  const imagekit = new ImageKit({
    publicKey : process.env.imageKitPK || process.env.NEXT_PUBLIC_imageKitPK,
    privateKey : process.env.imageKitSK || process.env.NEXT_PUBLIC_imageKitPK,
    urlEndpoint : process.env.imageKitUE || process.env.NEXT_PUBLIC_imageKitPK
  });

  const uploadResult = await imagekit.upload({
      file : scribbleDataURI, 
      fileName : "scribble_input.png",
      folder: '/images/michiAi/'
  })
  return uploadResult.url
}
