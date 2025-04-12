# Performance Considerations

GitLint is designed to be lightweight and fast, but there are scenarios where performance may become a consideration, especially when validating large commit histories or integrating with CI/CD pipelines. This guide covers performance considerations and optimization strategies.

## Understanding Performance Factors

Several factors can affect GitLint's performance:

1. **Number of rules enabled**: More validation rules mean more processing time
2. **Complexity of rules**: Custom rules with complex logic can slow down validation
3. **Commit message size**: Very large commit messages take longer to validate
4. **Number of commits**: When validating multiple commits in a CI pipeline
5. **Regular expression complexity**: Complex regex patterns can be computationally expensive

## Performance Optimization Strategies

### Rule Selection

Be selective about which rules you enable:

```ts
// gitlint.config.ts - Performance-optimized configuration
import type { GitLintConfig } from 'gitlint'

const config: GitLintConfig = {
  rules: {
    // Keep only essential rules for performance-critical environments
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],
    // Disable more expensive rules
    'body-max-line-length': 0,
  },
}

export default config
```

### Efficient Rule Implementation

When creating custom rules, optimize their implementation:

```ts
// Inefficient implementation
const inefficientRule = {
  name: 'inefficient-rule',
  validate: (commitMsg: string) => {
    // This creates many intermediate strings and is inefficient
    const words = commitMsg.toLowerCase().split(' ')
    const filtered = words.filter(w => w.length > 3)
    const joined = filtered.join(' ')
    return { valid: !joined.includes('bad') }
  },
}

// More efficient implementation
const efficientRule = {
  name: 'efficient-rule',
  validate: (commitMsg: string) => {
    // Direct check without creating intermediate arrays
    return { valid: !/\bbad\b/i.test(commitMsg) }
  },
}
```

### Optimize Regular Expressions

Regular expressions can become performance bottlenecks:

```ts
// Less efficient regex (backtracking can be expensive)
const inefficientRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+/

// More efficient regex (with atomic groups to prevent backtracking)
const efficientRegex = /^(?:feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\([^)]+\))?: .+/
```

### CI/CD Pipeline Optimization

When running in CI/CD environments:

```bash
#!/bin/bash
# Optimize GitLint in CI/CD pipelines

# 1. Only validate the commits that changed
if [ "$CI_PIPELINE_SOURCE" == "merge_request_event" ]; then
  # For large MRs, consider limiting the number of commits to check
  COMMIT_COUNT=$(git rev-list --count $CI_MERGE_REQUEST_TARGET_BRANCH_NAME..$CI_COMMIT_SHA)

  if [ $COMMIT_COUNT -gt 50 ]; then
    echo "Large MR detected ($COMMIT_COUNT commits). Validating most recent 50 commits..."
    git log --pretty=%B -n 50 $CI_COMMIT_SHA | npx gitlint
  else
    git log --pretty=%B $CI_MERGE_REQUEST_TARGET_BRANCH_NAME..$CI_COMMIT_SHA | npx gitlint
  fi
else
  # For direct commits, just check the latest commit
  git log --pretty=%B -n 1 | npx gitlint
fi
```

### Caching Results

For repositories with a large history, consider caching validation results:

```ts
const crypto = require('node:crypto')
// cache-gitlint.js
const fs = require('node:fs')
const { lintCommitMessage } = require('gitlint')

// Simple cache implementation
function validateWithCache(message) {
  // Create a hash of the message as a cache key
  const hash = crypto.createHash('md5').update(message).digest('hex')
  const cacheFile = `.gitlint-cache/${hash}`

  // Check if we have a cached result
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  }

  // No cache hit, run the validation
  const result = lintCommitMessage(message)

  // Cache the result for future use
  fs.mkdirSync('.gitlint-cache', { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(result))

  return result
}
```

## Benchmarking and Profiling

To identify performance bottlenecks, you can benchmark GitLint:

```js
// benchmark-gitlint.js
const { performance } = require('node:perf_hooks')
const { lintCommitMessage } = require('gitlint')

// Sample commit messages of different sizes
const commitMessages = [
  'feat: small commit message',
  'fix(auth): medium sized commit with some more details',
  // Large commit message with lots of lines...
]

// Run benchmarks
commitMessages.forEach((msg) => {
  const start = performance.now()
  lintCommitMessage(msg)
  const end = performance.now()

  console.log(`Message length: ${msg.length} chars, Time: ${(end - start).toFixed(2)}ms`)
})
```

## Memory Usage Considerations

For very large repositories or CI systems with limited memory:

1. **Batch Processing**: When validating many commits, process them in batches
2. **Garbage Collection**: If using Node.js, consider triggering manual garbage collection between batches
3. **Stream Processing**: For extremely large commit histories, consider using streams

```js
// Process commits in batches to manage memory
const { spawn } = require('node:child_process')
const { lintCommitMessage } = require('gitlint')

// Get commits using git command and process them as they come
const git = spawn('git', ['log', '--pretty=%B'])
let currentCommit = ''
let commitCount = 0

git.stdout.on('data', (data) => {
  const text = data.toString()
  const commitSeparator = '\n\ncommit '

  if (text.includes(commitSeparator)) {
    const parts = text.split(commitSeparator)
    // Complete the current commit
    currentCommit += parts[0]

    // Process the completed commit
    processCommit(currentCommit)

    // Start a new commit
    currentCommit = parts[1] || ''
  }
  else {
    currentCommit += text
  }
})

function processCommit(message) {
  // Skip empty messages
  if (!message.trim())
    return

  commitCount++
  if (commitCount % 100 === 0) {
    console.log(`Processed ${commitCount} commits`)
    // For Node.js, can trigger garbage collection if available
    if (globalThis.gc)
      globalThis.gc()
  }

  // Validate the commit
  const result = lintCommitMessage(message)
  // Handle results...
}
```

## Advanced Performance Techniques

For extreme performance requirements:

1. **Worker Threads**: Use worker threads to parallelize validation
2. **Incremental Validation**: Only validate new commits since last run
3. **Rule Compilation**: Pre-compile regular expressions and rule logic
4. **Native Extensions**: For critical performance needs, consider implementing performance-critical parts in Rust, C++, or other compiled languages

## Monitoring Performance

To monitor GitLint's performance in production:

```js
// Add performance monitoring
const { lintCommitMessage } = require('gitlint')

// Wrap the linting function with performance monitoring
function monitoredLintCommitMessage(message, verbose = false) {
  const start = Date.now()
  const result = lintCommitMessage(message, verbose)
  const duration = Date.now() - start

  // Log performance data
  if (duration > 100) {
    console.warn(`GitLint performance warning: Took ${duration}ms to validate a ${message.length} char message`)
  }

  return result
}
```
