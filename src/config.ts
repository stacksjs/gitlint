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

// eslint-disable-next-line antfu/no-top-level-await
export const config: GitLintConfig = await loadConfig({
  name: 'gitlint',
  defaultConfig,
})
