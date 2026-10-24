# Docs

## Arquitectura

- SPA de Vite + React 19 + Tailwind v4 con tokens `@wefaber/tokens` (tema forest). Sin servidor: todo ocurre en el navegador.
- `src/lib/converters/`: registro de conversores. Cada uno declara formato de origen (extensiones y MIME), formato de destino y una función `convert(file): Promise<Blob>`. Se detecta por extensión además de MIME porque Windows entrega las fotos de iPhone sin tipo.
- HEIC se decodifica con `heic-to` (libheif en WASM). Se importa de forma dinámica: el chunk de ~3 MB se baja recién cuando llega el primer archivo.
- `src/state/useQueue.ts`: cola de archivos. Convierte de a uno (libheif corre en el hilo principal) y libera las URLs al quitar un archivo.

## Pendiente

- Descarga en lote (ZIP).
- Más conversores (WebP, JPEG, AVIF, PDF a imagen).
- Mover la decodificación a un Web Worker.
