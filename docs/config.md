# Configuration

GitLint is highly configurable to match your team's commit message standards. You can customize the validation rules, severity levels, and ignored patterns.

## Configuration File

GitLint can be configured using a `gitlint.config.js` or `gitlint.config.ts` file in your project root. The configuration file should export a default object with your desired options:

```typescript
// gitlint.config.ts
import type { GitLintConfig } from '@stacksjs/gitlint'

const config: GitLintConfig = {
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

export default config
```

## Configuration Options

### `verbose`

Type: `boolean`
Default: `true`

Enables verbose output when validating commit messages.

### `rules`

Type: `Record<string, RuleLevel | [RuleLevel, RuleConfig?]>`
Default: See below

Define the rules to apply during validation. Each rule can be:

- A number (0, 1, 2) or string ('off', 'warning', 'error') indicating the rule's severity
- An array with the first element as the severity and the second as rule-specific configuration

Default rules:

```typescript
{
  'conventional-commits': 2,
  'header-max-length': [2, { maxLength: 72 }],
  'body-max-line-length': [2, { maxLength: 100 }],
  'body-leading-blank': 2,
  'no-trailing-whitespace': 1,
}
```

### `defaultIgnores`

Type: `string[]`
Default: `['^Merge branch', '^Merge pull request', '^Merged PR', '^Revert ', '^Release ']`

Regular expression patterns for commit messages that should be automatically ignored by GitLint. These patterns are checked against the start of the commit message.

### `ignores`

Type: `string[]`
Default: `[]`

Custom regular expression patterns for commit messages to ignore. These are in addition to the `defaultIgnores`.

## Rule Severity Levels

GitLint supports the following severity levels for rules:

| Level | Name | Description |
|-------|------|-------------|
| `0` | `'off'` | Disable the rule |
| `1` | `'warning'` | Trigger a warning (validation passes, but warning is displayed) |
| `2` | `'error'` | Trigger an error (validation fails) |

## Available Rules

### `conventional-commits`

Enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard format:

```
type(optional scope): description
```

Valid types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

### `header-max-length`

Enforces a maximum length for the commit header (first line).

Options:
- `maxLength`: Maximum number of characters allowed (default: 72)

```typescript
'header-max-length': [2, { maxLength: 72 }]
```

### `body-max-line-length`

Enforces a maximum length for each line in the commit body.

Options:
- `maxLength`: Maximum number of characters allowed per line (default: 100)

```typescript
'body-max-line-length': [2, { maxLength: 100 }]
```

### `body-leading-blank`

Enforces a blank line between the header and body of the commit message.

### `no-trailing-whitespace`

Prevents trailing whitespace in the commit message.

## Using Environment Variables

You can also configure GitLint using environment variables with the `GITLINT_` prefix:

```bash
# Set verbose mode
export GITLINT_VERBOSE=true

# Disable a rule
export GITLINT_RULES_BODY_LEADING_BLANK=0
```

## Configuration Precedence

GitLint uses the following precedence order for configuration (highest to lowest):

1. Command-line arguments
2. Environment variables
3. Configuration file (`gitlint.config.ts` or `gitlint.config.js`)
4. Default values

## Example Configurations

### Strict Configuration

```typescript
// gitlint.config.ts
export default {
  verbose: true,
  rules: {
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 50 }],
    'body-max-line-length': [2, { maxLength: 72 }],
    'body-leading-blank': 2,
    'no-trailing-whitespace': 2,
  },
}
```

### Relaxed Configuration

```typescript
// gitlint.config.ts
export default {
  verbose: false,
  rules: {
    'conventional-commits': 1,
    'header-max-length': [1, { maxLength: 100 }],
    'body-max-line-length': 0,
    'body-leading-blank': 1,
    'no-trailing-whitespace': 0,
  },
}
```

### Minimal Configuration

```typescript
// gitlint.config.ts
export default {
  rules: {
    'conventional-commits': 2,
  },
}
```

## Next Steps

- [Commit Linting](/features/commit-linting) - Deep dive into linting
- [Custom Rules](/features/custom-rules) - Create your own rules
- [Git Hooks](/features/git-hooks) - Automate linting
