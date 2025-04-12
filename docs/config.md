# Configuration

_This is just an example of the ts-starter docs._

The Reverse Proxy can be configured using a `reverse-proxy.config.ts` _(or `reverse-proxy.config.js`)_ file and it will be automatically loaded when running the `reverse-proxy` command.

GitLint is highly configurable to match your team's commit message standards. You can customize the validation rules, severity levels, and ignored patterns.

## Configuration File

GitLint can be configured using a `gitlint.config.js` or `gitlint.config.ts` file in your project root. The configuration file should export a default object with your desired options:

```ts
// gitlint.config.ts
import type { GitLintConfig } from 'gitlint'

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

```ts
// gitlint.config.ts
import type { GitLintConfig } from 'gitlint'

const config: GitLintConfig = {
  rules: {
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],
    'body-max-line-length': [2, { maxLength: 100 }],
    'body-leading-blank': 2,
    'no-trailing-whitespace': 1,
  },
  verbose: true,
}
```

### `defaultIgnores`

Type: `string[]`
Default: `['Merge branch', 'Merge pull request', 'Merged PR', 'Revert ', 'Release ']`

Regular expression patterns for commit messages that should be automatically ignored by GitLint. These patterns are checked against the start of the commit message.

### `ignores`

Type: `string[]`
Default: `[]`

Custom regular expression patterns for commit messages to ignore. These are in addition to the `defaultIgnores`.

## Rule Severity Levels

GitLint supports the following severity levels for rules:

- `0` or `'off'`: Disable the rule
- `1` or `'warning'`: Trigger a warning (validation passes, but warning is displayed)
- `2` or `'error'`: Trigger an error (validation fails)

## Available Rules

### `conventional-commits`

Enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard format:

```
type(optional scope): description
```

### `header-max-length`

Enforces a maximum length for the commit header (first line).

Options:

- `maxLength`: Maximum number of characters allowed (default: 72)

### `body-max-line-length`

Enforces a maximum length for each line in the commit body.

Options:

- `maxLength`: Maximum number of characters allowed per line (default: 100)

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
3. Configuration file
4. Default values

```ts
// reverse-proxy.config.{ts,js}
import type { ReverseProxyOptions } from '@stacksjs/rpx'
import os from 'node:os'
import path from 'node:path'

const config: ReverseProxyOptions = {
  /**
   * The from URL to proxy from.
   * Default: localhost:5173
   */
  from: 'localhost:5173',

  /**
   * The to URL to proxy to.
   * Default: stacks.localhost
   */
  to: 'stacks.localhost',

  /**
   * The HTTPS settings.
   * Default: true
   * If set to false, the proxy will use HTTP.
   * If set to true, the proxy will use HTTPS.
   * If set to an object, the proxy will use HTTPS with the provided settings.
   */
  https: {
    domain: 'stacks.localhost',
    hostCertCN: 'stacks.localhost',
    caCertPath: path.join(os.homedir(), '.stacks', 'ssl', `stacks.localhost.ca.crt`),
    certPath: path.join(os.homedir(), '.stacks', 'ssl', `stacks.localhost.crt`),
    keyPath: path.join(os.homedir(), '.stacks', 'ssl', `stacks.localhost.crt.key`),
    altNameIPs: ['127.0.0.1'],
    altNameURIs: ['localhost'],
    organizationName: 'stacksjs.org',
    countryName: 'US',
    stateName: 'California',
    localityName: 'Playa Vista',
    commonName: 'stacks.localhost',
    validityDays: 180,
    verbose: false,
  },

  /**
   * The verbose setting.
   * Default: false
   * If set to true, the proxy will log more information.
   */
  verbose: false,
}

export default config
```

_Then run:_

```bash
./rpx start
```

To learn more, head over to the [documentation](https://reverse-proxy.sh/).
