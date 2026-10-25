import { useState } from 'react'
import type { DragEvent } from 'react'
import { FileUp } from 'lucide-react'
import { acceptAttribute, CONVERTERS } from '@/lib/converters'
import { es } from '@/i18n/es'

interface Props {
  onFiles: (files: File[]) => void
}

export function DropZone({ onFiles }: Props) {
  const [over, setOver] = useState(false)
  const formats = [...new Set(CONVERTERS.map(({ from }) => from.label))].join(
    ', ',
  )

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setOver(false)
    onFiles([...event.dataTransfer.files])
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`flex min-h-48 flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors duration-(--dur-fast) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${over ? 'border-accent bg-accent/10' : 'border-border bg-surface hover:bg-surface-2'}`}
    >
      <input
        type="file"
        multiple
        accept={acceptAttribute()}
        className="sr-only"
        onChange={(event) => {
          onFiles([...(event.target.files ?? [])])
          event.target.value = ''
        }}
      />
      <FileUp className="size-8 text-accent" aria-hidden />
      <span className="text-h3 font-medium text-text">{es.dropTitle}</span>
      <span className="text-body-lg text-muted">{es.dropHint(formats)}</span>
      <span className="mt-1 inline-flex h-10 items-center rounded-control bg-accent px-4 text-body-lg font-medium text-on-accent">
        {es.dropAction}
      </span>
    </label>
  )
}
