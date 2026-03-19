# Custom Rules

GitLint allows you to customize validation rules to match your team's specific requirements. This guide covers how to configure and create custom rules.

## Built-in Rules

GitLint includes these built-in rules:

| Rule | Description |
|------|-------------|
| `conventional-commits` | Enforce conventional commit format |
| `header-max-length` | Limit header line length |
| `body-max-line-length` | Limit body line length |
| `body-leading-blank` | Require blank line before body |
| `no-trailing-whitespace` | Prevent trailing whitespace |

## Configuring Rules

### Severity Levels

Each rule can be set to one of three levels:

```typescript
// gitlint.config.ts
export default {
  rules: {
    'conventional-commits': 2,     // Error (validation fails)
    'header-max-length': 1,        // Warning (validation passes)
    'body-max-line-length': 0,     // Disabled (skipped)
  },
}
```

Or use string values:

```typescript
export default {
  rules: {
    'conventional-commits': 'error',
    'header-max-length': 'warning',
    'body-max-line-length': 'off',
  },
}
```

### Rule Options

Some rules accept configuration options:

```typescript
export default {
  rules: {
    // [severity, options]
    'header-max-length': [2, { maxLength: 72 }],
    'body-max-line-length': [2, { maxLength: 100 }],
  },
}
```

## Rule Configurations

### `conventional-commits`

Validates commit message format:

```typescript
'conventional-commits': 2  // No options needed
```

Valid types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

### `header-max-length`

Limits the header (first line) length:

```typescript
// Default: 72 characters
'header-max-length': [2, { maxLength: 72 }]

// Custom length
'header-max-length': [2, { maxLength: 50 }]
```

### `body-max-line-length`

Limits each line in the body:

```typescript
// Default: 100 characters
'body-max-line-length': [2, { maxLength: 100 }]

// Wider for URLs
'body-max-line-length': [1, { maxLength: 120 }]
```

### `body-leading-blank`

Requires a blank line between header and body:

```typescript
'body-leading-blank': 2  // No options
```

### `no-trailing-whitespace`

Checks for trailing whitespace:

```typescript
'no-trailing-whitespace': 1  // Warning level
```

## Rule Interface

Rules implement this interface:

```typescript
interface LintRule {
  name: string
  description: string
  validate: (commitMsg: string, config?: RuleConfig) => LintRuleOutcome
}

interface LintRuleOutcome {
  valid: boolean
  message?: string
}
```

## Example Configurations

### Strict Configuration

For projects requiring high-quality commits:

```typescript
// gitlint.config.ts
export default {
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

For getting started or less strict requirements:

```typescript
// gitlint.config.ts
export default {
  rules: {
    'conventional-commits': 1,  // Warning only
    'header-max-length': [1, { maxLength: 100 }],
    'body-max-line-length': 0,  // Disabled
    'body-leading-blank': 1,
    'no-trailing-whitespace': 0,
  },
}
```

### Minimal Configuration

Only enforce the essential rule:

```typescript
// gitlint.config.ts
export default {
  rules: {
    'conventional-commits': 2,
  },
}
```

## Ignore Patterns

Skip validation for certain commits:

```typescript
// gitlint.config.ts
export default {
  rules: {
    'conventional-commits': 2,
  },

  // Default patterns (always applied)
  defaultIgnores: [
    '^Merge branch',
    '^Merge pull request',
    '^Merged PR',
    '^Revert ',
    '^Release ',
  ],

  // Custom patterns
  ignores: [
    '^WIP:',           // Work in progress
    '^TEMP:',          // Temporary commits
    '^fixup!',         // Fixup commits
    '^squash!',        // Squash commits
  ],
}
```

## Validation Examples

```typescript
import { lintCommitMessage } from '@stacksjs/gitlint'

// Valid conventional commit
lintCommitMessage('feat(ui): add button component')
// { valid: true, errors: [], warnings: [] }

// Invalid - no type
lintCommitMessage('add button component')
// { valid: false, errors: ['does not follow conventional commit format...'], warnings: [] }

// Valid but with warning (if no-trailing-whitespace is level 1)
lintCommitMessage('feat: add feature ')
// { valid: true, errors: [], warnings: ['contains lines with trailing whitespace'] }

// Ignored (merge commit)
lintCommitMessage('Merge branch "feature" into main')
// { valid: true, errors: [], warnings: [] }
```

## Combining with Git Hooks

Ensure rules are enforced on every commit:

```bash
# Install hooks
gitlint hooks --install
```

The commit-msg hook will validate against your configured rules.

## Next Steps

- [Git Hooks](/features/git-hooks) - Automate validation
- [Configuration](/config) - Full configuration reference
- [Custom Validators](/advanced/custom-validators) - Create new rules
