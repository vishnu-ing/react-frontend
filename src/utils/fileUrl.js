
// Created for static serving picture in the asset folder. 
// Can remove once s3 is implemented
// looks into /public folder by default
export function resolveFileUrl(fileUrl) {
  if (!fileUrl) return "";
  // console.log("FileURL: ", fileUrl)
  if (fileUrl.startsWith("http")) return fileUrl;
  return `/assets/${fileUrl}`;
}
