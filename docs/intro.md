<p align="center"><img src="https://github.com/stacksjs/rpx/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

# A Better Developer Experience

> A TypeScript Starter Kit that will help you bootstrap your next project without minimal opinion.

# bun-ts-starter

This is an opinionated TypeScript Starter kit to help kick-start development of your next Bun package.

## Get Started

It's rather simple to get your package development started:

```bash
# you may use this GitHub template or the following command:
bunx degit stacksjs/ts-starter my-pkg
cd my-pkg

 # if you don't have pnpm installed, run `npm i -g pnpm`
bun i # install all deps
bun run build # builds the library for production-ready use

# after you have successfully committed, you may create a "release"
bun run release # automates git commits, versioning, and changelog generations
```

_Check out the package.json scripts for more commands._

### Developer Experience (DX)

This Starter Kit comes pre-configured with the following:

- [Powerful Build Process](https://github.com/oven-sh/bun) - via Bun
- [Fully Typed APIs](https://www.typescriptlang.org/) - via TypeScript
- [Documentation-ready](https://vitepress.dev/) - via VitePress
- [CLI & Binary](https://www.npmjs.com/package/bunx) - via Bun & CAC
- [Be a Good Commitizen](https://www.npmjs.com/package/git-cz) - pre-configured Commitizen & git-cz setup to simplify semantic git commits, versioning, and changelog generations
- [Built With Testing In Mind](https://bun.sh/docs/cli/test) - pre-configured unit-testing powered by [Bun](https://bun.sh/docs/cli/test)
- [Renovate](https://renovatebot.com/) - optimized & automated PR dependency updates
- [ESLint](https://eslint.org/) - for code linting _(and formatting)_
- [GitHub Actions](https://github.com/features/actions) - runs your CI _(fixes code style issues, tags releases & creates its changelogs, runs the test suite, etc.)_

## Changelog

Please see our [releases](https://github.com/stacksjs/stacks/releases) page for more information on what has changed recently.

## Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

Two things are true: Stacks OSS will always stay open-source, and we do love to receive postcards from wherever Stacks is used! 🌍 _We also publish them on our website. And thank you, Spatie_

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/rpx/graphs/contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/ts-starter/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/rpx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/rpx -->

# Introduction to GitLint

GitLint is a lightweight, customizable Git commit message linter that helps teams maintain consistent, high-quality commit histories. By enforcing structured commit messages, GitLint makes codebases easier to maintain, changelog generation more straightforward, and team collaboration smoother.

## Why Use GitLint?

Maintaining a clean and consistent commit history is essential for several reasons:

- **Clear project history**: Well-formatted commits make it easier to understand changes over time
- **Automated semantic versioning**: Structured commits enable automatic version bumping based on commit types
- **Streamlined changelog generation**: Properly formatted commits can be automatically compiled into readable changelogs
- **Better code reviews**: Descriptive commits make the review process more efficient
- **Improved collaboration**: Standardized messages help team members understand each other's changes

## Key Features

GitLint offers a comprehensive set of features to help enforce your team's commit message conventions:

### Conventional Commits Support

GitLint enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard by default, ensuring your commits follow a semantic format like:

```
feat(component): add ability to parse @mentions
```

### Customizable Validation Rules

Configure GitLint to match your team's specific commit message standards with rules such as:

- Header length restrictions
- Body line length limits
- Required blank lines between sections
- Whitespace validations
- Issue reference formatting

### Git Hooks Integration

Seamlessly integrate GitLint with Git hooks to validate commits before they're created, ensuring your repository always maintains the expected standard.

### Flexible Configuration

Customize GitLint to match your project's needs through a simple configuration file that can be committed to your repository and shared across your team.

## Getting Started

Ready to improve your commit messages? Head over to the [Installation](/install) guide to get started with GitLint in minutes.
