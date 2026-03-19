# Advanced Configuration

This guide covers advanced configuration options for GitLint, including programmatic configuration, rule customization, and environment-specific settings.

## Configuration File Formats

### TypeScript

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
  ignores: [],
}

export default config
```

### JavaScript

```javascript
// gitlint.config.js
export default {
  verbose: true,
  rules: {
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],
  },
}
```

### JSON

```json
// gitlint.config.json
{
  "verbose": true,
  "rules": {
    "conventional-commits": 2,
    "header-max-length": [2, { "maxLength": 72 }]
  }
}
```

## Rule Configuration

### Severity Levels

```typescript
// Numeric levels
{
  'rule-name': 0,  // Disabled
  'rule-name': 1,  // Warning
  'rule-name': 2,  // Error
}

// String levels
{
  'rule-name': 'off',      // Disabled
  'rule-name': 'warning',  // Warning
  'rule-name': 'error',    // Error
}
```

### Rules with Options

```typescript
// [severity, options]
{
  'header-max-length': [2, { maxLength: 50 }],
  'body-max-line-length': [1, { maxLength: 120 }],
}
```

## Environment-Based Configuration

### Development vs Production

```typescript
// gitlint.config.ts
const isDev = process.env.NODE_ENV === 'development'

export default {
  verbose: isDev,
  rules: {
    'conventional-commits': isDev ? 1 : 2,  // Warning in dev, error in prod
    'header-max-length': [2, { maxLength: 72 }],
  },
}
```

### CI Environment

```typescript
// gitlint.config.ts
const isCI = process.env.CI === 'true'

export default {
  verbose: !isCI,  // Less verbose in CI
  rules: {
    'conventional-commits': 2,
    'no-trailing-whitespace': isCI ? 2 : 1,  // Stricter in CI
  },
}
```

## Ignore Patterns

### Default Ignores

These patterns are always ignored by default:

```typescript
const defaultIgnores = [
  '^Merge branch',
  '^Merge pull request',
  '^Merged PR',
  '^Revert ',
  '^Release ',
]
```

### Custom Ignores

```typescript
// gitlint.config.ts
export default {
  rules: {
    'conventional-commits': 2,
  },

  // Add custom patterns
  ignores: [
    '^WIP:',           // Work in progress
    '^TEMP:',          // Temporary commits
    '^fixup!',         // Fixup commits
    '^squash!',        // Squash commits
    '^Initial commit', // Initial commits
    '^Bump version',   // Version bumps
  ],

  // Override defaults (not recommended)
  // defaultIgnores: [],
}
```

### Regex Patterns

```typescript
ignores: [
  '^WIP',                    // Starts with WIP
  'skip-ci',                 // Contains skip-ci
  '\\[skip lint\\]',         // Contains [skip lint]
  '^\\d+\\.\\d+\\.\\d+$',    // Version numbers only
]
```

## Programmatic Configuration

### Dynamic Configuration

```typescript
import { lintCommitMessage } from '@stacksjs/gitlint'

// Create custom linting function
function customLint(message: string, options: {
  strict?: boolean
  allowEmoji?: boolean
} = {}) {
  // Pre-process message
  let processedMessage = message

  if (options.allowEmoji) {
    // Strip emojis for validation
    processedMessage = message.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
  }

  return lintCommitMessage(processedMessage, !options.strict)
}
```

### Config Factory

```typescript
interface ConfigOptions {
  strict?: boolean
  team?: 'frontend' | 'backend' | 'devops'
}

function createConfig(options: ConfigOptions = {}) {
  const baseConfig = {
    verbose: true,
    rules: {
      'conventional-commits': 2,
      'body-leading-blank': 2,
    },
  }

  if (options.strict) {
    baseConfig.rules['header-max-length'] = [2, { maxLength: 50 }]
    baseConfig.rules['body-max-line-length'] = [2, { maxLength: 72 }]
    baseConfig.rules['no-trailing-whitespace'] = 2
  }

  if (options.team === 'frontend') {
    // Frontend-specific rules
  }

  return baseConfig
}

export default createConfig({ strict: true, team: 'frontend' })
```

## Environment Variables

### Available Variables

```bash
# Enable verbose mode
export GITLINT_VERBOSE=true

# Disable specific rule
export GITLINT_RULES_CONVENTIONAL_COMMITS=0

# Set rule option
export GITLINT_RULES_HEADER_MAX_LENGTH='[2, {"maxLength": 50}]'
```

### Using in Configuration

```typescript
// gitlint.config.ts
export default {
  verbose: process.env.GITLINT_VERBOSE === 'true',
  rules: {
    'conventional-commits': Number(process.env.GITLINT_STRICT) || 2,
  },
}
```

## Multiple Configurations

### Monorepo Setup

```typescript
// gitlint.config.ts
import path from 'path'

// Detect which package changed
function getPackageConfig() {
  const changedPackage = process.env.CHANGED_PACKAGE

  if (changedPackage === 'docs') {
    return {
      rules: {
        'conventional-commits': 1,  // Relaxed for docs
      },
    }
  }

  return {
    rules: {
      'conventional-commits': 2,  // Strict for code
    },
  }
}

export default getPackageConfig()
```

### Extending Configurations

```typescript
// gitlint.base.ts
export const baseConfig = {
  rules: {
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],
  },
}

// gitlint.config.ts
import { baseConfig } from './gitlint.base'

export default {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'no-trailing-whitespace': 2,  // Add extra rule
  },
}
```

## Debugging Configuration

### Verbose Output

```bash
gitlint --verbose .git/COMMIT_EDITMSG
```

### Config Inspection

```typescript
// scripts/inspect-config.ts
import config from '../gitlint.config'

console.log('Current GitLint Configuration:')
console.log(JSON.stringify(config, null, 2))
```

## Next Steps

- [Custom Validators](/advanced/custom-validators) - Create custom rules
- [Performance](/advanced/performance) - Optimize linting
- [CI/CD Integration](/advanced/ci-cd-integration) - Automate validation
