import { useState } from 'react'
import { ArrowRight, FileArchive, ShieldCheck } from 'lucide-react'
import { DropZone } from '@/components/DropZone'
import { FileRow } from '@/components/FileRow'
import { CONVERTERS } from '@/lib/converters'
import { saveBlob, zipName } from '@/lib/download'
import { buildZip } from '@/lib/zip'
import { es } from '@/i18n/es'
import { useQueue } from '@/state/useQueue'

export default function App() {
  const { items, add, remove, retry, clear } = useQueue()
  const [zipping, setZipping] = useState(false)
  const [zipFailed, setZipFailed] = useState(false)

  const ready = items.flatMap((item) =>
    item.status === 'done' && item.result
      ? [{ name: item.result.name, blob: item.result.blob }]
      : [],
  )
  const failed = items.filter((item) => item.status === 'error').length
  const processed = ready.length + failed

  async function downloadZip() {
    setZipping(true)
    setZipFailed(false)
    try {
      saveBlob(await buildZip(ready), zipName())
    } catch {
      setZipFailed(true)
    } finally {
      setZipping(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-gutter py-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-display text-text">{es.title}</h1>
        <p className="text-body-lg text-muted">{es.subtitle}</p>
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Conversiones">
          {CONVERTERS.map(({ id, from, to }) => (
            <li
              key={id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-meta font-medium text-text"
            >
              {from.label}
              <ArrowRight className="size-3.5 text-muted" aria-hidden />
              {to.label}
            </li>
          ))}
        </ul>
      </header>

      <DropZone onFiles={add} />

      <p className="flex items-start gap-2 text-meta text-muted">
        <ShieldCheck
          className="mt-0.5 size-4 shrink-0 text-accent"
          aria-hidden
        />
        {es.privacy}
      </p>

      <section className="flex flex-col gap-3" aria-labelledby="files-title">
        <div className="sticky top-0 z-10 -mx-gutter flex flex-col gap-2 bg-bg px-gutter py-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="files-title" className="text-h3 font-medium text-text">
              {es.listTitle}
            </h2>
            {items.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="text-meta text-muted tabular-nums"
                  aria-live="polite"
                >
                  {es.summary(items.length, ready.length, failed)}
                </span>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex h-8 items-center rounded-control px-3 text-meta font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-text/8 hover:text-text"
                >
                  {es.clear}
                </button>
                <button
                  type="button"
                  onClick={downloadZip}
                  disabled={ready.length === 0 || zipping}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control bg-accent px-4 text-body-lg font-medium whitespace-nowrap text-on-accent transition-[filter] duration-(--dur-fast) hover:brightness-110 disabled:opacity-50"
                >
                  <FileArchive className="size-4" aria-hidden />
                  {zipping ? es.zipping : es.zip(ready.length)}
                </button>
              </div>
            )}
          </div>
          {items.length > 1 && (
            <div
              role="progressbar"
              aria-label={es.progress}
              aria-valuemin={0}
              aria-valuemax={items.length}
              aria-valuenow={processed}
              className="h-1.5 overflow-hidden rounded-full bg-text/8"
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-(--dur-layout) ease-standard"
                style={{ width: `${(processed / items.length) * 100}%` }}
              />
            </div>
          )}
          {zipFailed && (
            <p role="alert" className="text-meta text-danger">
              {es.zipFailed}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <p className="rounded-card border border-dashed border-border px-4 py-6 text-center text-body-lg text-muted">
            {es.empty}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <FileRow
                key={item.id}
                item={item}
                onRemove={remove}
                onRetry={retry}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
