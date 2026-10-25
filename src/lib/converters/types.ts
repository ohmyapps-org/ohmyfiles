export type ConversionErrorCode = 'unsupported' | 'invalid' | 'failed'

export class ConversionError extends Error {
  code: ConversionErrorCode

  constructor(code: ConversionErrorCode, cause?: unknown) {
    super(code, { cause })
    this.code = code
  }
}

export interface Converter {
  id: string
  from: { label: string; extensions: string[]; mimes: string[] }
  to: { label: string; mime: string; extension: string }
  convert(file: File): Promise<Blob>
}
