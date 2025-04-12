<p align="center"><img src="https://github.com/stacksjs/gitlint/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

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

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/gitlint/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/rpx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/rpx -->
