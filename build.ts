import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  minify: true,
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  plugins: [dts()],
  target: 'node',
})

await Bun.build({
  minify: true,
  entrypoints: ['bin/cli.ts'],
  outdir: './dist/bin',
  plugins: [dts()],
  target: 'bun',
})
