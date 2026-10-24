import { AlertCircle, CheckCircle2, Download, FileImage, X } from 'lucide-react'
import { formatBytes } from '@/lib/format'
import { es } from '@/i18n/es'
import type { Item } from '@/state/useQueue'

interface Props {
  item: Item
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

const ghost =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-control px-3 text-body-lg font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-text/8 hover:text-text'

export function FileRow({ item, onRemove, onRetry }: Props) {
  const { file, status, result, error } = item

  return (
    <li className="flex items-center gap-3 rounded-card border border-border bg-surface p-3">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-control bg-surface-2">
        {result ? (
          <img src={result.url} alt="" className="size-full object-cover" />
        ) : (
          <FileImage className="size-5 text-muted" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-lg font-medium text-text">
          {file.name}
        </p>
        <p className="flex items-center gap-1.5 text-meta text-muted tabular-nums">
          {status === 'done' && result && (
            <>
              <CheckCircle2 className="size-3.5 text-success" aria-hidden />
              <span className="text-success">{es.done}</span>
              <span>
                · {formatBytes(file.size)} a {formatBytes(result.size)}
              </span>
            </>
          )}
          {status === 'error' && error && (
            <>
              <AlertCircle
                className="size-3.5 shrink-0 text-danger"
                aria-hidden
              />
              <span className="text-danger">
                {es.errorPrefix}. {es.errors[error]}
              </span>
            </>
          )}
          {(status === 'pending' || status === 'converting') && (
            <span>
              {status === 'pending' ? es.pending : `${es.converting}…`} ·{' '}
              {formatBytes(file.size)}
            </span>
          )}
        </p>
      </div>

      {status === 'done' && result && (
        <a
          href={result.url}
          download={result.name}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control border border-border bg-text/8 px-3 text-body-lg font-medium text-text transition-colors duration-(--dur-fast) hover:bg-text/12"
        >
          <Download className="size-4" aria-hidden />
          {es.download}
        </a>
      )}
      {status === 'error' && error !== 'unsupported' && (
        <button
          type="button"
          className={ghost}
          onClick={() => onRetry(item.id)}
        >
          {es.retry}
        </button>
      )}
      <button
        type="button"
        aria-label={`${es.remove} ${file.name}`}
        title={es.remove}
        className={`${ghost} size-10 px-0`}
        onClick={() => onRemove(item.id)}
      >
        <X className="size-4" aria-hidden />
      </button>
    </li>
  )
}
