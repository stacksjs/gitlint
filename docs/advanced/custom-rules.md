# Creating Custom Rules

GitLint is designed to be extensible, allowing you to create custom validation rules that fit your team's specific commit message requirements. This guide will walk you through the process of creating, registering, and using custom rules.

## Understanding the Rule Interface

Custom rules in GitLint must implement the `LintRule` interface:

```ts
interface LintRule {
  name: string // Unique name for your rule
  description: string // Short description of what the rule checks
  validate: (commitMsg: string, config?: RuleConfig) => LintRuleOutcome
}

interface LintRuleOutcome {
  valid: boolean // Whether the validation passed
  message?: string // Error message if validation failed
}

interface RuleConfig {
  [key: string]: any // Custom configuration options for your rule
}
```

## Creating a Custom Rule

Let's walk through creating a custom rule that requires commit messages to include a ticket number (e.g., JIRA-123):

### 1. Define Your Rule

First, create a file for your custom rule (e.g., `custom-rules.ts`):

```ts
import type { LintRule } from 'gitlint'

// Rule: Require ticket number in commit message
export const requireTicketNumber: LintRule = {
  name: 'require-ticket-number',
  description: 'Requires a ticket number (e.g., JIRA-123) in the commit message',
  validate: (commitMsg: string, config?: { pattern?: string }) => {
    // Default pattern matches PROJ-123 format
    const pattern = config?.pattern ? new RegExp(config.pattern) : /\b[A-Z]+-\d+\b/

    if (!pattern.test(commitMsg)) {
      return {
        valid: false,
        message: 'Commit message must include a ticket number (e.g., JIRA-123)',
      }
    }

    return { valid: true }
  },
}
```

### 2. Creating a Rules Plugin

To organize multiple custom rules, you can create a rules plugin:

```ts
import type { LintRule } from 'gitlint'
import { prohibitedWords } from './prohibited-words'
import { requireTicketNumber } from './require-ticket-number'

// Export all your custom rules
export const customRules: LintRule[] = [
  requireTicketNumber,
  prohibitedWords,
  // Add more custom rules here
]
```

## Registering Custom Rules

To use your custom rules with GitLint, you need to register them. There are two approaches:

### Option 1: Custom Configuration Module

Create a custom configuration module that extends GitLint:

```ts
// my-gitlint.js
import { rules as coreRules, lintCommitMessage } from 'gitlint'
import { customRules } from './custom-rules'

// Combine core rules with custom rules
const allRules = [...coreRules, ...customRules]

// Create a custom linting function
export function lintWithCustomRules(message, verbose = false) {
  // Your custom logic here
  // For example, you might want to apply different rules based on branch

  // Call the original linting function with your combined rules
  return lintCommitMessage(message, verbose, allRules)
}
```

### Option 2: Configuration File

Alternatively, you can register your custom rules in your GitLint configuration file:

```ts
// gitlint.config.ts
import type { GitLintConfig } from 'gitlint'
import { customRules } from './custom-rules'

const config: GitLintConfig = {
  verbose: true,
  rules: {
    // Core rules
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],

    // Your custom rules
    'require-ticket-number': [2, { pattern: 'JIRA-\\d+' }],
    'prohibited-words': 2,
  },
  // Register your custom rules
  customRules,
}

export default config
```

## Examples of Custom Rules

Here are some examples of custom rules you might want to implement:

### Prohibited Words Rule

A rule that checks for words you want to avoid in commit messages:

```ts
export const prohibitedWords: LintRule = {
  name: 'prohibited-words',
  description: 'Checks for prohibited words in commit messages',
  validate: (commitMsg: string, config?: { words?: string[] }) => {
    const prohibitedWords = config?.words || ['wip', 'fixme', 'todo', 'typo']

    for (const word of prohibitedWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'i')
      if (regex.test(commitMsg)) {
        return {
          valid: false,
          message: `Commit message contains prohibited word: "${word}"`,
        }
      }
    }

    return { valid: true }
  },
}
```

### Team-specific Format

A rule that enforces your team's specific commit format:

```ts
export const teamFormat: LintRule = {
  name: 'team-format',
  description: 'Enforces team-specific commit message format',
  validate: (commitMsg: string) => {
    // Example: [Feature|Bugfix|Docs|Refactor] Description (TICKET-123)
    const pattern = /^\[(?:Feature|Bugfix|Docs|Refactor)\] .+ \([A-Z]+-\d+\)$/

    if (!pattern.test(commitMsg.split('\n')[0])) {
      return {
        valid: false,
        message: 'Commit message header must follow format: [Type] Description (TICKET-123)',
      }
    }

    return { valid: true }
  },
}
```

## Using Custom Rules in CI/CD

To use your custom rules in CI/CD environments:

1. Create a custom script that uses your rules:

```js
const fs = require('node:fs')
// validate-commit.js
const { lintWithCustomRules } = require('./my-gitlint')

// Get commit message from file provided by CI
const commitMsg = fs.readFileSync(process.argv[2], 'utf8')
const result = lintWithCustomRules(commitMsg)

if (!result.valid) {
  console.error('Commit message validation failed:')
  result.errors.forEach(error => console.error(`- ${error}`))
  process.exit(1)
}
```

2. Include this script in your CI workflow:

```yaml
# .github/workflows/validate-commit.yml
name: Validate Commit Messages
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node validate-commit.js "${{ github.event.head_commit.message }}"
```

## Best Practices for Custom Rules

1. **Keep rules focused**: Each rule should check one specific thing
2. **Make rules configurable**: Allow customization via configuration options
3. **Clear error messages**: Provide helpful error messages that guide users
4. **Document your rules**: Include comments explaining what the rule checks
5. **Test your rules**: Write unit tests to ensure correct behavior
