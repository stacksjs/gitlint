export interface GitLintConfig {
  verbose: boolean
  rules?: Record<string, RuleLevel | [RuleLevel, RuleConfig?]>
  defaultIgnores?: string[]
  ignores?: string[]
  parserPreset?: string
  formatter?: string
}

export type RuleLevel = 0 | 1 | 2 | 'off' | 'warning' | 'error'

export interface RuleConfig {
  [key: string]: any
}

export interface LintRuleOutcome {
  valid: boolean
  message?: string
}

export interface LintRule {
  name: string
  description: string
  validate: (commitMsg: string, config?: RuleConfig) => LintRuleOutcome
}

export interface LintResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface CommitParsedResult {
  header: string
  type: string | null
  scope: string | null
  subject: string | null
  body: string | null
  footer: string | null
  mentions: string[]
  references: CommitReference[]
  raw: string
}

export interface CommitReference {
  action: string | null
  owner: string | null
  repository: string | null
  issue: string
  raw: string
  prefix: string
}
