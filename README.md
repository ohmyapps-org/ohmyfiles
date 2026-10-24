# OhMyFiles

Conversor de archivos que corre entero en el navegador. Los archivos no se suben ni se guardan. Hoy convierte HEIC (iPhone) a PNG.

## Desarrollo

```bash
bun install
bun run dev      # http://localhost:5173
bun run check    # tsc + oxlint
bun run build
```

## Agregar un conversor

1. Crear `src/lib/converters/<origen>.ts` que exporte un `Converter` (ver `types.ts`).
2. Sumarlo a `CONVERTERS` en `src/lib/converters/index.ts`.

La cola, el selector de archivos y las descargas lo toman solos. Más detalle en [docs/](docs/README.md).
