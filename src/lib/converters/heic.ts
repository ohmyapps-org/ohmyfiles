import { ConversionError } from './types'
import type { Converter } from './types'

// libheif (WASM, ~2.7 MB) is only fetched when the first HEIC file arrives.
export const heicToPng: Converter = {
  id: 'heic-png',
  from: {
    label: 'HEIC',
    extensions: ['heic', 'heif'],
    mimes: [
      'image/heic',
      'image/heif',
      'image/heic-sequence',
      'image/heif-sequence',
    ],
  },
  to: { label: 'PNG', mime: 'image/png', extension: 'png' },
  async convert(file) {
    const { heicTo, isHeic } = await import('heic-to')
    if (!(await isHeic(file))) throw new ConversionError('invalid')
    try {
      return await heicTo({ blob: file, type: 'image/png' })
    } catch (error) {
      throw new ConversionError('failed', error)
    }
  },
}
