# Custom Validators

This guide covers creating custom validation rules for GitLint to enforce your team's specific commit message conventions.

## Rule Interface

All rules implement this interface:

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

type RuleConfig = Record<string, unknown>
```

## Creating a Custom Rule

### Basic Rule

```typescript
// rules/no-wip.ts
import type { LintRule } from '@stacksjs/gitlint'

const noWip: LintRule = {
  name: 'no-wip',
  description: 'Prevents WIP commits from being merged',

  validate: (commitMsg: string) => {
    const firstLine = commitMsg.split('\n')[0].toLowerCase()

    if (firstLine.includes('wip') || firstLine.includes('work in progress')) {
      return {
        valid: false,
        message: 'WIP commits are not allowed on this branch',
      }
    }

    return { valid: true }
  },
}

export default noWip
```

### Rule with Options

```typescript
// rules/jira-reference.ts
import type { LintRule } from '@stacksjs/gitlint'

interface JiraConfig {
  projectKeys: string[]
  required: boolean
}

const jiraReference: LintRule = {
  name: 'jira-reference',
  description: 'Requires JIRA ticket reference in commit message',

  validate: (commitMsg: string, config?: JiraConfig) => {
    const projectKeys = config?.projectKeys || ['PROJ']
    const required = config?.required ?? true

    const pattern = new RegExp(
      `\\b(${projectKeys.join('|')})-\\d+\\b`,
      'i'
    )

    const hasReference = pattern.test(commitMsg)

    if (required && !hasReference) {
      return {
        valid: false,
        message: `Commit must reference a JIRA ticket (e.g., ${projectKeys[0]}-123)`,
      }
    }

    return { valid: true }
  },
}

export default jiraReference
```

### Complex Validation

```typescript
// rules/signed-off-by.ts
import type { LintRule } from '@stacksjs/gitlint'

const signedOffBy: LintRule = {
  name: 'signed-off-by',
  description: 'Requires Signed-off-by footer',

  validate: (commitMsg: string) => {
    const lines = commitMsg.split('\n')
    const footer = lines.slice(-5).join('\n')

    const signedOffPattern = /^Signed-off-by:\s+.+\s+<.+@.+>$/m

    if (!signedOffPattern.test(footer)) {
      return {
        valid: false,
        message: 'Commit must include "Signed-off-by: Name <email>" footer',
      }
    }

    return { valid: true }
  },
}

export default signedOffBy
```

## Rule Examples

### Co-Author Validation

```typescript
// rules/co-authors.ts
const coAuthors: LintRule = {
  name: 'valid-co-authors',
  description: 'Validates Co-authored-by format',

  validate: (commitMsg: string) => {
    const coAuthorPattern = /^Co-authored-by:\s+.+\s+<.+@.+>$/gm
    const matches = commitMsg.match(/^Co-authored-by:.+$/gm)

    if (!matches) {
      return { valid: true }
    }

    for (const match of matches) {
      if (!coAuthorPattern.test(match)) {
        return {
          valid: false,
          message: `Invalid Co-authored-by format: ${match}`,
        }
      }
    }

    return { valid: true }
  },
}
```

### Scope Allowlist

```typescript
// rules/scope-allowlist.ts
interface ScopeConfig {
  allowed: string[]
}

const scopeAllowlist: LintRule = {
  name: 'scope-allowlist',
  description: 'Restricts commit scopes to allowed values',

  validate: (commitMsg: string, config?: ScopeConfig) => {
    const allowed = config?.allowed || []

    const scopeMatch = commitMsg.match(/^\w+\(([^)]+)\):/)
    if (!scopeMatch) {
      return { valid: true }  // No scope is OK
    }

    const scope = scopeMatch[1]

    if (!allowed.includes(scope)) {
      return {
        valid: false,
        message: `Scope "${scope}" is not allowed. Use one of: ${allowed.join(', ')}`,
      }
    }

    return { valid: true }
  },
}
```

### Breaking Change Detection

```typescript
// rules/breaking-change-body.ts
const breakingChangeBody: LintRule = {
  name: 'breaking-change-body',
  description: 'Breaking changes must have a body explaining the change',

  validate: (commitMsg: string) => {
    const firstLine = commitMsg.split('\n')[0]
    const isBreaking = firstLine.includes('!:') ||
                       commitMsg.includes('BREAKING CHANGE:')

    if (!isBreaking) {
      return { valid: true }
    }

    const lines = commitMsg.split('\n')
    const hasBody = lines.length > 2 &&
                    lines[1].trim() === '' &&
                    lines.slice(2).some(l => l.trim() !== '')

    if (!hasBody) {
      return {
        valid: false,
        message: 'Breaking changes must include a body explaining the change',
      }
    }

    return { valid: true }
  },
}
```

## Using Custom Rules

### Registration (Future Feature)

```typescript
// gitlint.config.ts
import noWip from './rules/no-wip'
import jiraReference from './rules/jira-reference'

export default {
  rules: {
    'conventional-commits': 2,
    'no-wip': 2,
    'jira-reference': [2, { projectKeys: ['PROJ', 'TEAM'] }],
  },
  customRules: [noWip, jiraReference],
}
```

### Manual Validation

```typescript
// validate.ts
import { lintCommitMessage } from '@stacksjs/gitlint'
import noWip from './rules/no-wip'
import jiraReference from './rules/jira-reference'

function validateCommit(message: string) {
  // Run built-in linting
  const result = lintCommitMessage(message)

  // Run custom rules
  const wipResult = noWip.validate(message)
  if (!wipResult.valid) {
    result.valid = false
    result.errors.push(wipResult.message!)
  }

  const jiraResult = jiraReference.validate(message, {
    projectKeys: ['PROJ'],
    required: true,
  })
  if (!jiraResult.valid) {
    result.valid = false
    result.errors.push(jiraResult.message!)
  }

  return result
}
```

## Testing Rules

### Unit Testing

```typescript
// rules/no-wip.test.ts
import { describe, it, expect } from 'bun:test'
import noWip from './no-wip'

describe('no-wip rule', () => {
  it('should pass for normal commits', () => {
    const result = noWip.validate('feat: add new feature')
    expect(result.valid).toBe(true)
  })

  it('should fail for WIP commits', () => {
    const result = noWip.validate('WIP: still working on this')
    expect(result.valid).toBe(false)
    expect(result.message).toContain('WIP')
  })

  it('should fail for work in progress', () => {
    const result = noWip.validate('feat: work in progress on login')
    expect(result.valid).toBe(false)
  })
})
```

### Integration Testing

```typescript
// integration.test.ts
import { describe, it, expect } from 'bun:test'
import { validateCommit } from './validate'

describe('Full Validation', () => {
  it('should validate all rules', () => {
    const message = 'feat(auth): add login\n\nPROJ-123'
    const result = validateCommit(message)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})
```

## Best Practices

1. **Keep rules focused**: One rule, one concern
2. **Provide clear messages**: Help users fix issues
3. **Make rules configurable**: Options for flexibility
4. **Test thoroughly**: Cover edge cases
5. **Document rules**: Explain purpose and usage

## Next Steps

- [Performance](/advanced/performance) - Optimize validation
- [CI/CD Integration](/advanced/ci-cd-integration) - Automate checks
- [Configuration](/advanced/configuration) - Advanced config
