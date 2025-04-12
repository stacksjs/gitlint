<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# GitLint

> Efficient Git Commit Message Linting and Formatting

GitLint is a tool for enforcing consistent Git commit message conventions. It analyzes commit messages to ensure they follow the [Conventional Commits](https://www.conventionalcommits.org/) specification and other configurable rules.

## Installation

```bash
# Install globally
npm install -g @stacksjs/gitlint

# Or using bun
bun install -g @stacksjs/gitlint
```

_We are looking to get it published as `gitlint` on npm, but it's not allowing us to do so due to `git-lint`. Please npm 🙏🏽_

## Usage

### CLI

```bash
# Check a commit message from a file
gitlint path/to/commit-message.txt

# Use with git commit message hook (common use case)
gitlint --edit $1

# Show help
gitlint --help
```

### Git Hooks Integration

GitLint can automatically install Git hooks for your repository:

```bash
# Install the commit-msg hook
gitlint hooks --install

# Force overwrite if a hook already exists
gitlint hooks --install --force

# Uninstall the hooks
gitlint hooks --uninstall
```

Or manually add to your `.git/hooks/commit-msg` file:

```bash
#!/bin/sh
gitlint --edit "$1"
```

Or use with [husky](https://github.com/typicode/husky):

```jsonc
// package.json
{
  "husky": {
    "hooks": {
      "commit-msg": "gitlint --edit $HUSKY_GIT_PARAMS"
    }
  }
}
```

## Configuration

Create a `gitlint.config.js` file in your project root:

```js
// gitlint.config.js
module.exports = {
  verbose: true,
  rules: {
    'conventional-commits': 2,
    'header-max-length': [2, { maxLength: 72 }],
    'body-max-line-length': [2, { maxLength: 100 }],
    'body-leading-blank': 2,
    'no-trailing-whitespace': 1
  },
  ignores: [
    '^Merge branch',
    '^Merge pull request'
  ]
}
```

### Rule Levels

- `0` or `off`: Disable the rule
- `1` or `warning`: Warning (doesn't cause exit code to be non-zero)
- `2` or `error`: Error (causes exit code to be non-zero)

## Built-in Rules

- `conventional-commits`: Enforces conventional commit format (`<type>(scope): description`)
- `header-max-length`: Enforces a maximum header length
- `body-max-line-length`: Enforces a maximum body line length
- `body-leading-blank`: Enforces a blank line between header and body
- `no-trailing-whitespace`: Checks for trailing whitespace

## Programmatic Usage

```js
import { lintCommitMessage, parseCommitMessage } from 'gitlint'

// Lint a commit message
const result = lintCommitMessage('feat: add new feature')
console.log(result.valid) // true or false
console.log(result.errors) // array of error messages
console.log(result.warnings) // array of warning messages

// Parse a commit message
const parsed = parseCommitMessage('feat(scope): description\n\nBody text\n\nCloses #123')
console.log(parsed.type) // 'feat'
console.log(parsed.scope) // 'scope'
console.log(parsed.references) // [{issue: '123', ...}]
```

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/gitlint/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/gitlint/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stacksjs/gitlint?style=flat-square
[npm-version-href]: https://npmjs.com/package/@stacksjs/gitlint
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/gitlint/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/gitlint/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/gitlint/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/gitlint -->
