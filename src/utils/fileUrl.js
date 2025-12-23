export function resolveFileUrl(fileUrl) {
  if (!fileUrl) return "";

  // handle File object (local preview)
  if (fileUrl instanceof File) {
    return URL.createObjectURL(fileUrl);
  }

  // handle absolute URLs 
  if (typeof fileUrl === "string" && fileUrl.startsWith("http")) {
    return fileUrl;
  }

  // legacy / local assets
  return `/assets/${fileUrl}`;
}
