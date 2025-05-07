import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  plugins: [dts()],
  target: 'node',
})

await Bun.build({
  entrypoints: ['bin/cli.ts'],
  outdir: './dist/bin',
  plugins: [dts()],
  target: 'bun',
})
