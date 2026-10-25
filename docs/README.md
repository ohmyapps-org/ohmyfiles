# Docs

## Arquitectura

- SPA de Vite + React 19 + Tailwind v4 con tokens `@wefaber/tokens` (tema forest). Sin servidor: todo ocurre en el navegador.
- `src/lib/converters/`: registro de conversores. Cada uno declara formato de origen (extensiones y MIME), formato de destino y una función `convert(file): Promise<Blob>`. Se detecta por extensión además de MIME porque Windows entrega las fotos de iPhone sin tipo.
- HEIC se decodifica con `heic-to` (libheif en WASM). Se importa de forma dinámica: el chunk de ~3 MB se baja recién cuando llega el primer archivo.
- `src/state/useQueue.ts`: cola de archivos. Convierte de a uno (libheif corre en el hilo principal), guarda el `Blob` de cada resultado y libera las URLs al quitar un archivo.
- `src/lib/zip.ts`: arma el ZIP con `fflate` (import dinámico, entradas sin compresión porque el PNG ya viene comprimido) y renombra repetidos como `IMG_1 (2).png`. Todo el ZIP se arma en memoria: con cientos de fotos de 15 MB conviene bajar de a tandas.

## Pendiente

- Más conversores (WebP, JPEG, AVIF, PDF a imagen).
- Mover la decodificación a un Web Worker.
