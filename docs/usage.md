# Get Started

There are two ways of using this reverse proxy: _as a library or as a CLI._

## Library

Given the npm package is installed:

```ts
import type { TlsConfig } from '@stacksjs/rpx'
import { startProxy } from '@stacksjs/rpx'

export interface CleanupConfig {
  hosts: boolean // clean up /etc/hosts, defaults to false
  certs: boolean // clean up certificates, defaults to false
}

export interface ReverseProxyConfig {
  from: string // domain to proxy from, defaults to localhost:3000
  to: string // domain to proxy to, defaults to stacks.localhost
  cleanUrls?: boolean // removes the .html extension from URLs, defaults to false
  https: boolean | TlsConfig // automatically uses https, defaults to true, also redirects http to https
  cleanup?: boolean | CleanupConfig // automatically cleans up /etc/hosts, defaults to false
  verbose: boolean // log verbose output, defaults to false
}

const config: ReverseProxyOptions = {
  from: 'localhost:3000',
  to: 'my-docs.localhost',
  cleanUrls: true,
  https: true,
  cleanup: false,
}

startProxy(config)
```

In case you are trying to start multiple proxies, you may use this configuration:

```ts
// reverse-proxy.config.{ts,js}
import type { ReverseProxyOptions } from '@stacksjs/rpx'
import os from 'node:os'
import path from 'node:path'

const config: ReverseProxyOptions = {
  https: { // https: true -> also works with sensible defaults
    caCertPath: path.join(os.homedir(), '.stacks', 'ssl', `stacks.localhost.ca.crt`),
    certPath: path.join(os.homedir(), '.stacks', 'ssl', `stacks.localhost.crt`),
    keyPath: path.join(os.homedir(), '.stacks', 'ssl', `stacks.localhost.crt.key`),
  },

  cleanup: {
    hosts: true,
    certs: false,
  },

  proxies: [
    {
      from: 'localhost:5173',
      to: 'my-app.localhost',
      cleanUrls: true,
    },
    {
      from: 'localhost:5174',
      to: 'my-api.local',
    },
  ],

  verbose: true,
}

export default config
```

## CLI

```bash
rpx --from localhost:3000 --to my-project.localhost
rpx --from localhost:8080 --to my-project.test --keyPath ./key.pem --certPath ./cert.pem
rpx --help
rpx --version
```

## Testing

```bash
bun test
```

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
# Enable verbose output
gitlint --verbose

# Use a custom configuration file
gitlint --config path/to/gitlint.config.js
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

## Next Steps

To customize GitLint's behavior for your project, check out the [Configuration](/config) guide.
