import type { GitLintConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: GitLintConfig = {
  verbose: true,
  rules: {
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],
    'body-max-line-length': [2, { maxLength: 100 }],
    'body-leading-blank': 2,
    'no-trailing-whitespace': 1,
  },
  defaultIgnores: [
    '^Merge branch',
    '^Merge pull request',
    '^Merged PR',
    '^Revert ',
    '^Release ',
  ],
  ignores: [],
}

// Lazy-loaded config to avoid top-level await (enables bun --compile)
let _config: GitLintConfig | null = null

export async function getConfig(): Promise<GitLintConfig> {
  if (!_config) {
    _config = await loadConfig({
  name: 'gitlint',
  defaultConfig,
})
  }
  return _config
}

// For backwards compatibility - synchronous access with default fallback
export const config: GitLintConfig = defaultConfig
