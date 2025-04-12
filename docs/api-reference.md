# API Reference

GitLint provides a programmatic API that you can use in your JavaScript or TypeScript applications. This page documents the main functions and types available in the GitLint API.

## Core Functions

### `lintCommitMessage`

Validates a commit message against configured rules.

```ts
function lintCommitMessage(message: string, verbose?: boolean): LintResult
```

#### Parameters

- `message`: The commit message to validate
- `verbose`: Whether to enable verbose output (defaults to configuration value)

#### Returns

- `LintResult`: The validation result object

Example:

```ts
import { lintCommitMessage } from 'gitlint'

const result = lintCommitMessage('feat: add new feature')
console.log(result.valid) // true or false
```

### `installGitHooks`

Installs GitLint Git hooks in the current repository.

```ts
function installGitHooks(force?: boolean): boolean
```

#### Parameters

- `force`: Whether to overwrite existing hooks

#### Returns

- `boolean`: True if hooks were installed successfully

Example:

```ts
import { installGitHooks } from 'gitlint'

const success = installGitHooks(true)
```

### `uninstallGitHooks`

Removes GitLint Git hooks from the current repository.

```ts
function uninstallGitHooks(): boolean
```

#### Returns

- `boolean`: True if hooks were uninstalled successfully

Example:

```ts
import { uninstallGitHooks } from 'gitlint'

const success = uninstallGitHooks()
```

## Types

### `LintResult`

Represents the result of validating a commit message.

```ts
interface LintResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

### `GitLintConfig`

Represents the GitLint configuration options.

```ts
interface GitLintConfig {
  verbose: boolean
  rules?: Record<string, RuleLevel | [RuleLevel, RuleConfig?]>
  defaultIgnores?: string[]
  ignores?: string[]
  parserPreset?: string
  formatter?: string
}
```

### `RuleLevel`

Represents the severity level of a rule.

```ts
type RuleLevel = 0 | 1 | 2 | 'off' | 'warning' | 'error'
```

### `RuleConfig`

Represents the configuration options for a rule.

```ts
interface RuleConfig {
  [key: string]: any
}
```

### `LintRule`

Represents a validation rule.

```ts
interface LintRule {
  name: string
  description: string
  validate: (commitMsg: string, config?: RuleConfig) => LintRuleOutcome
}
```

### `LintRuleOutcome`

Represents the outcome of applying a rule to a commit message.

```ts
interface LintRuleOutcome {
  valid: boolean
  message?: string
}
```

### `CommitParsedResult`

Represents a parsed commit message.

```ts
interface CommitParsedResult {
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
```

### `CommitReference`

Represents a reference to an issue or pull request in a commit message.

```ts
interface CommitReference {
  action: string | null
  owner: string | null
  repository: string | null
  issue: string
  raw: string
  prefix: string
}
```
