import type { GitLintConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: GitLintConfig = {
  verbose: true,
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: GitLintConfig = await loadConfig({
  name: 'gitlint',
  defaultConfig,
})
