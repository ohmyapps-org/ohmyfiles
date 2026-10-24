import { ArrowRight, ShieldCheck } from 'lucide-react'
import { DropZone } from '@/components/DropZone'
import { FileRow } from '@/components/FileRow'
import { CONVERTERS } from '@/lib/converters'
import { es } from '@/i18n/es'
import { useQueue } from '@/state/useQueue'

export default function App() {
  const { items, add, remove, retry, clear } = useQueue()
  const done = items.filter((item) => item.status === 'done').length

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
        <div className="flex items-center justify-between gap-3">
          <h2 id="files-title" className="text-h3 font-medium text-text">
            {es.listTitle}
          </h2>
          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <span
                className="text-meta text-muted tabular-nums"
                aria-live="polite"
              >
                {es.summary(items.length, done)}
              </span>
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-8 items-center rounded-control px-3 text-meta font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-text/8 hover:text-text"
              >
                {es.clear}
              </button>
            </div>
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
