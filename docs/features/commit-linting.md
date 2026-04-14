# Commit Linting

GitLint validates commit messages against configurable rules to ensure consistency and clarity across your project. This guide covers how commit linting works and how to use it effectively.

## How Linting Works

GitLint parses commit messages and validates them against a set of rules. Each rule checks a specific aspect of the commit message format.

```typescript
import { lintCommitMessage } from '@stacksjs/gitlint'

const message = 'feat(ui): add new button component'
const result = lintCommitMessage(message)

console.log(result.valid)    // true or false
console.log(result.errors)   // Array of error messages
console.log(result.warnings) // Array of warning messages
```

## Basic Usage

### CLI

```bash
# Lint a commit message file
gitlint .git/COMMIT_EDITMSG

# Lint from standard input
echo "feat: add feature" | gitlint

# Lint with verbose output
gitlint --verbose .git/COMMIT_EDITMSG
```

### Library

```typescript
import { lintCommitMessage } from '@stacksjs/gitlint'

// Simple validation
const result = lintCommitMessage('feat: add new feature')

if (result.valid) {
  console.log('Commit message is valid!')
}
else {
  console.log('Validation failed:')
  result.errors.forEach(error => console.log(`  Error: ${error}`))
  result.warnings.forEach(warning => console.log(`  Warning: ${warning}`))
}
```

## Lint Result Structure

```typescript
interface LintResult {
  valid: boolean      // Overall validation result
  errors: string[]    // Error messages (severity 2)
  warnings: string[]  // Warning messages (severity 1)
}
```

## Validation Process

1. **Parse**: The commit message is parsed into components (header, body, footer)
2. **Check Ignores**: Message is checked against ignore patterns
3. **Apply Rules**: Each enabled rule is applied
4. **Collect Results**: Errors and warnings are collected
5. **Return Result**: Final validation result is returned

## Message Structure

A well-formed commit message has these parts:

```
<type>(<scope>): <description>
                                    <- blank line
<body>
                                    <- blank line
<footer>
```

Example:
```
feat(auth): implement OAuth2 login

Add support for OAuth2 authentication with Google and GitHub providers.
This includes:

- OAuth2 client setup
- Token refresh handling
- User profile fetching

Closes #123
```

## Rule Application

### Error Rules (Level 2)

When a rule at level 2 fails, the commit message is invalid:

```typescript
const result = lintCommitMessage('invalid commit message')

console.log(result.valid)   // false
console.log(result.errors)  // ['Commit message header does not follow...']
```

### Warning Rules (Level 1)

When a rule at level 1 fails, a warning is issued but the message is still valid:

```typescript
const result = lintCommitMessage('feat: valid but has trailing whitespace ')

console.log(result.valid)     // true (if trailing whitespace is a warning)
console.log(result.warnings)  // ['Commit message contains lines with trailing...']
```

### Disabled Rules (Level 0)

Rules at level 0 are skipped entirely:

```typescript
// In gitlint.config.ts
export default {
  rules: {
    'no-trailing-whitespace': 0,  // Disabled
  },
}
```

## Batch Validation

Validate multiple commits:

```typescript
import { lintCommitMessage } from '@stacksjs/gitlint'

const commits = [
  'feat: add feature A',
  'fix: resolve bug B',
  'invalid message',
]

const results = commits.map(msg => ({
  message: msg,
  result: lintCommitMessage(msg),
}))

const invalid = results.filter(r => !r.result.valid)
console.log(`${invalid.length} invalid commits found`)
```

## Ignored Patterns

Certain commit messages are automatically ignored:

```typescript
// Default ignore patterns
const defaultIgnores = [
  '^Merge branch',
  '^Merge pull request',
  '^Merged PR',
  '^Revert ',
  '^Release ',
]
```

```typescript
const result = lintCommitMessage('Merge branch "feature" into main')
console.log(result.valid) // true (ignored)
```

## Verbose Mode

Enable detailed logging:

```typescript
const result = lintCommitMessage('feat: add feature', true) // verbose = true
```

## Exit Codes (CLI)

| Code | Meaning |
|------|---------|
| 0 | Commit message is valid |
| 1 | Commit message has validation errors |
| 2 | Internal error occurred |

```bash
gitlint .git/COMMIT_EDITMSG
echo $?  # Check exit code
```

## Error Messages

Common error messages and their meanings:

| Error | Cause |
|-------|-------|
| "does not follow conventional commit format" | Missing or invalid type |
| "header exceeds maximum length" | Header too long |
| "must have a blank line between header and body" | No blank line after header |
| "contains lines with trailing whitespace" | Whitespace at line ends |

## Next Steps

- [Conventional Commits](/features/conventional-commits) - Learn the format
- [Custom Rules](/features/custom-rules) - Create your own rules
- [Git Hooks](/features/git-hooks) - Automate linting
