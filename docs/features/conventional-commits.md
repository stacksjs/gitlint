# Conventional Commits

GitLint includes built-in support for validating commit messages against the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This ensures that your commit messages follow a structured format that makes your repository history more readable and enables automated tools like semantic versioning and changelog generation.

## What are Conventional Commits?

Conventional Commits is a lightweight convention for creating commit messages. It provides an easy set of rules for creating an explicit commit history, which makes it easier to write automated tools like release managers.

A conventional commit message has the following structure:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

Common types supported by GitLint include:

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code (white-space, formatting, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `build` | Changes that affect the build system or external dependencies |
| `ci` | Changes to our CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

## Examples

Here are some examples of valid conventional commit messages:

```
feat: add search functionality
```

```
fix(auth): prevent login bypass
```

```
docs: update API documentation

Updated the authentication section to explain the new token format.
```

```
feat(ui)!: redesign user profile page

BREAKING CHANGE: The user profile layout has completely changed and
will require updates to custom themes.
```

## Configuration

The conventional commits validation is enabled by default. You can configure its behavior in your `gitlint.config.js` file:

```js
// gitlint.config.js
export default {
  rules: {
    // Enable conventional commits as an error
    'conventional-commits': 2,

    // Or enable as a warning
    // 'conventional-commits': 1,

    // Or disable entirely
    // 'conventional-commits': 0,
  }
}
```

## Benefits of Conventional Commits

Using conventional commits in your project offers several advantages:

1. **Automatic versioning**: Tools can determine the next semantic version based on commit types
2. **Automatic changelog generation**: Generate changelogs based on commit messages
3. **Communication**: Helps team members understand the purpose of changes at a glance
4. **Structured history**: Makes it easier to navigate the project history
5. **CI/CD integration**: Enables conditional workflows based on commit types
