import { expect, test } from 'bun:test'
import manifest from '../package.json'

test('package managers own the declared executable link', () => {
  expect(manifest.bin.gitlint).toBe('./dist/bin/cli.js')
  expect(manifest.scripts).not.toHaveProperty('postinstall')
  expect(manifest.scripts['hooks:install']).toBe('bun-git-hooks')
})
