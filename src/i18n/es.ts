export const es = {
  title: 'OhMyFiles',
  subtitle: 'Convertí archivos sin subirlos a ningún lado.',
  privacy:
    'La conversión pasa en tu navegador. Los archivos no se suben ni se guardan.',
  conversion: (from: string, to: string) => `${from} a ${to}`,
  dropTitle: 'Soltá tus archivos acá',
  dropHint: (formats: string) => `o tocá para elegirlos (${formats})`,
  dropAction: 'Elegir archivos',
  listTitle: 'Archivos',
  summary: (total: number, done: number) =>
    total === 1
      ? done === 1
        ? '1 archivo listo'
        : '1 archivo'
      : `${done} de ${total} listos`,
  empty: 'Todavía no hay archivos. Soltá o elegí algunos para empezar.',
  pending: 'En cola',
  converting: 'Convirtiendo',
  done: 'Listo',
  download: 'Descargar',
  remove: 'Quitar',
  retry: 'Reintentar',
  clear: 'Limpiar lista',
  errors: {
    unsupported: 'Este formato todavía no se convierte. Probá con HEIC o HEIF.',
    invalid: 'El archivo no es una imagen HEIC válida.',
    failed: 'No se pudo decodificar la imagen.',
  },
  errorPrefix: 'No se pudo convertir',
} as const
