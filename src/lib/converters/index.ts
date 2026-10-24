import { heicToPng } from './heic'
import type { Converter } from './types'

// Add a converter here and it shows up in the drop zone and the queue.
export const CONVERTERS: Converter[] = [heicToPng]

function extensionOf(name: string) {
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase()
}

// Windows and some browsers hand over iPhone photos with an empty MIME type,
// so the extension counts as much as the type.
export function findConverter(file: File) {
  const extension = extensionOf(file.name)
  const mime = file.type.toLowerCase()
  return CONVERTERS.find(
    ({ from }) =>
      from.extensions.includes(extension) || from.mimes.includes(mime),
  )
}

export function outputName(file: File, converter: Converter) {
  const dot = file.name.lastIndexOf('.')
  const base = dot > 0 ? file.name.slice(0, dot) : file.name
  return `${base}.${converter.to.extension}`
}

export function acceptAttribute() {
  return CONVERTERS.flatMap(({ from }) => [
    ...from.extensions.map((extension) => `.${extension}`),
    ...from.mimes,
  ]).join(',')
}

export type { Converter, ConversionErrorCode } from './types'
export { ConversionError } from './types'
