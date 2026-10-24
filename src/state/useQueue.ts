import { useRef, useState } from 'react'
import { ConversionError, findConverter, outputName } from '@/lib/converters'
import type { ConversionErrorCode, Converter } from '@/lib/converters'

export type Status = 'pending' | 'converting' | 'done' | 'error'

export interface Item {
  id: string
  file: File
  status: Status
  converter?: Converter
  result?: { url: string; name: string; size: number }
  error?: ConversionErrorCode
}

export function useQueue() {
  const [items, setItems] = useState<Item[]>([])
  // libheif decodes on the main thread: one file at a time keeps the page alive.
  const chain = useRef<Promise<void>>(Promise.resolve())
  const [removed] = useState(() => new Set<string>())

  function patch(id: string, changes: Partial<Item>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    )
  }

  async function run(id: string, file: File, converter: Converter) {
    if (removed.has(id)) return
    patch(id, { status: 'converting' })
    try {
      const blob = await converter.convert(file)
      if (removed.has(id)) return
      patch(id, {
        status: 'done',
        result: {
          url: URL.createObjectURL(blob),
          name: outputName(file, converter),
          size: blob.size,
        },
      })
    } catch (error) {
      patch(id, {
        status: 'error',
        error: error instanceof ConversionError ? error.code : 'failed',
      })
    }
  }

  function add(files: File[]) {
    const next: Item[] = files.map((file) => {
      const converter = findConverter(file)
      return {
        id: crypto.randomUUID(),
        file,
        converter,
        status: converter ? 'pending' : 'error',
        error: converter ? undefined : 'unsupported',
      }
    })
    setItems((current) => [...current, ...next])
    for (const { id, file, converter } of next) {
      if (!converter) continue
      chain.current = chain.current.then(() => run(id, file, converter))
    }
  }

  function remove(id: string) {
    removed.add(id)
    setItems((current) => {
      const target = current.find((item) => item.id === id)
      if (target?.result) URL.revokeObjectURL(target.result.url)
      return current.filter((item) => item.id !== id)
    })
  }

  function retry(id: string) {
    const target = items.find((item) => item.id === id)
    if (!target) return
    remove(id)
    add([target.file])
  }

  function clear() {
    for (const item of items) remove(item.id)
  }

  return { items, add, remove, retry, clear }
}
