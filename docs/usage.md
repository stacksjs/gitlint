# Usage

GitLint is designed to be simple to use while providing powerful validation capabilities. Here are the different ways you can use GitLint in your workflow.

## Command Line Interface

GitLint provides a command-line interface for validating commit messages.

### Basic Usage

To validate a commit message file:

```bash
gitlint .git/COMMIT_EDITMSG
```

Or validate a commit message from standard input:

```bash
echo "feat: add new feature" | gitlint
```

### CLI Options

GitLint supports several command-line options:

```bash
# Validate a commit message file
gitlint .git/COMMIT_EDITMSG

# Enable verbose output
gitlint --verbose

# Use a custom configuration file
gitlint --config path/to/gitlint.config.js

# Show version information
gitlint --version

# Display help information
gitlint --help
```

### Examples

Here are some common usage examples:

```bash
# Validate the most recent commit message
git log -1 --pretty=%B | gitlint

# Validate all commit messages in a range
git log --pretty=%B main..feature-branch | gitlint
```

## Git Hooks Integration

GitLint can be integrated with Git hooks to automatically validate commit messages before they are committed.

### Installing Git Hooks

```bash
# Install Git hooks
gitlint hooks --install

# Force overwrite existing hooks
gitlint hooks --install --force
```

### Uninstalling Git Hooks

```bash
# Uninstall Git hooks
gitlint hooks --uninstall
```

## Programmatic API

You can also use GitLint programmatically in your JavaScript/TypeScript applications:

```ts
import { lintCommitMessage } from 'gitlint'

const message = 'feat(ui): add new button component'
const result = lintCommitMessage(message)

if (result.valid) {
  console.log('Commit message is valid!')
}
else {
  console.error('Validation errors:', result.errors)
  console.warn('Validation warnings:', result.warnings)
}
```

## Exit Codes

GitLint uses the following exit codes:

- `0`: Commit message is valid
- `1`: Commit message has validation errors
- `2`: An internal error occurred during validation

## Testing

```bash
bun test
```

## Next Steps

To customize GitLint's behavior for your project, check out the [Configuration](/config) guide.
