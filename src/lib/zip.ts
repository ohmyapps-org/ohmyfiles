export interface ZipEntry {
  name: string
  blob: Blob
}

// Two photos from different folders can share a name: "IMG_1.png", "IMG_1 (2).png".
export function uniqueNames(names: string[]) {
  const used = new Set<string>()
  return names.map((name) => {
    const dot = name.lastIndexOf('.')
    const base = dot > 0 ? name.slice(0, dot) : name
    const extension = dot > 0 ? name.slice(dot) : ''
    let candidate = name
    for (let n = 2; used.has(candidate.toLowerCase()); n++) {
      candidate = `${base} (${n})${extension}`
    }
    used.add(candidate.toLowerCase())
    return candidate
  })
}

// fflate is only fetched when someone asks for a ZIP. PNG is already
// compressed, so entries are stored (level 0): faster and about the same size.
export async function buildZip(entries: ZipEntry[]) {
  const { zip } = await import('fflate')
  const names = uniqueNames(entries.map((entry) => entry.name))
  const files: Record<string, [Uint8Array, { level: 0 }]> = {}
  for (const [index, entry] of entries.entries()) {
    files[names[index]] = [
      new Uint8Array(await entry.blob.arrayBuffer()),
      { level: 0 },
    ]
  }
  return new Promise<Blob>((resolve, reject) => {
    zip(files, (error, data) => {
      if (error) reject(error)
      else resolve(new Blob([data as BlobPart], { type: 'application/zip' }))
    })
  })
}
