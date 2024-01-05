export function getFileExtension(filename: string, mimeType: string): string {
  let fileExt = filename.split('.').pop();
  if (!fileExt) {
    fileExt = mimeType.split('/').pop();
  }

  return fileExt || '';
}