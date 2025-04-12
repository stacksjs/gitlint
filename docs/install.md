# Installation

Installing GitLint is straightforward. You can install it locally for a specific project or globally to use across all your repositories.

## Package Managers

Choose your preferred package manager:

::: code-group

```sh [npm]
# Install locally for a project
npm install --save-dev gitlint

# Or install globally
npm install -g gitlint
```

```sh [yarn]
# Install locally for a project
yarn add --dev gitlint

# Or install globally
yarn global add gitlint
```

```sh [pnpm]
# Install locally for a project
pnpm add --save-dev gitlint

# Or install globally
pnpm add --global gitlint
```

```sh [bun]
# Install locally for a project
bun add --dev gitlint

# Or install globally
bun add --global gitlint
```

:::

## Binaries

Choose the binary that matches your platform and architecture:

::: code-group

```sh [macOS (arm64)]
# Download the binary
curl -L https://github.com/stacksjs/gitlint/releases/download/v1.0.0/gitlint-darwin-arm64 -o gitlint

# Make it executable
chmod +x gitlint

# Move it to your PATH
mv gitlint /usr/local/bin/gitlint
```

```sh [macOS (x64)]
# Download the binary
curl -L https://github.com/stacksjs/gitlint/releases/download/v1.0.0/gitlint-darwin-x64 -o gitlint

# Make it executable
chmod +x gitlint

# Move it to your PATH
mv gitlint /usr/local/bin/gitlint
```

```sh [Linux (arm64)]
# Download the binary
curl -L https://github.com/stacksjs/gitlint/releases/download/v1.0.0/gitlint-linux-arm64 -o gitlint

# Make it executable
chmod +x gitlint

# Move it to your PATH
mv gitlint /usr/local/bin/gitlint
```

```sh [Linux (x64)]
# Download the binary
curl -L https://github.com/stacksjs/gitlint/releases/download/v1.0.0/gitlint-linux-x64 -o gitlint

# Make it executable
chmod +x gitlint

# Move it to your PATH
mv gitlint /usr/local/bin/gitlint
```

```sh [Windows (x64)]
# Download the binary
curl -L https://github.com/stacksjs/gitlint/releases/download/v1.0.0/gitlint-windows-x64.exe -o gitlint.exe

# Move it to your PATH (adjust the path as needed)
move gitlint.exe C:\Windows\System32\gitlint.exe
```

:::

::: tip
You can also find the `gitlint` binaries in GitHub [releases](https://github.com/stacksjs/gitlint/releases).
:::

## Verifying Installation

To verify that GitLint is installed correctly, run:

```bash
gitlint --version
```

You should see the current version number of GitLint displayed.

## Git Hooks Setup

For maximum effectiveness, you'll likely want to integrate GitLint with Git hooks. This can be done automatically using our built-in hooks command:

```bash
# Navigate to your project directory
cd your-project-directory

# Install the Git hooks
gitlint hooks --install
```

This will set up a `commit-msg` hook that automatically validates your commit messages against your configured rules.

## Next Steps

Once you have GitLint installed, head over to the [Usage](/usage) guide to learn how to validate your commit messages, or check out the [Configuration](/config) page to customize GitLint for your project's specific needs.
