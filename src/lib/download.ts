export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  // The download starts on click; give the browser a moment before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function zipName(now = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0')
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  return `ohmyfiles-${date}.zip`
}
