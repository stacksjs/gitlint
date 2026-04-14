# Git Hooks

GitLint integrates seamlessly with Git hooks to automatically validate commit messages before they're created. This guide covers hook setup and usage.

## What Are Git Hooks

Git hooks are scripts that run automatically at certain points in the Git workflow. GitLint uses the `commit-msg` hook to validate messages before commits are finalized.

## Installing Hooks

### Automatic Installation

The easiest way to set up hooks:

```bash
# Install commit-msg hook
gitlint hooks --install

# Force overwrite existing hooks
gitlint hooks --install --force
```

### Manual Installation

Create `.git/hooks/commit-msg`:

```bash
# !/bin/sh
gitlint "$1"
```

Make it executable:

```bash
chmod +x .git/hooks/commit-msg
```

## Hook Behavior

When you run `git commit`:

1. Git creates the commit message file (`.git/COMMIT_EDITMSG`)
2. The `commit-msg` hook runs with the file path as argument
3. GitLint validates the message
4. If valid (exit 0), the commit proceeds
5. If invalid (exit 1), the commit is aborted

## Example Workflow

```bash
# Valid commit - proceeds normally
git commit -m "feat: add user authentication"
# [main abc1234] feat: add user authentication

# Invalid commit - aborted
git commit -m "added authentication"
# Error: Commit message does not follow conventional commit format
# Commit aborted
```

## Integration Options

### Using bun-git-hooks

GitLint works great with `bun-git-hooks`:

```json
// package.json
{
  "git-hooks": {
    "pre-commit": {
      "staged-lint": {
        "*.{js,ts,json,yaml,yml,md}": "bunx --bun eslint . --fix"
      }
    },
    "commit-msg": "bunx gitlint .git/COMMIT_EDITMSG"
  }
}
```

### Using simple-git-hooks

```json
// package.json
{
  "simple-git-hooks": {
    "commit-msg": "npx gitlint $1"
  }
}
```

### Using Husky

```bash
# Install Husky
npm install husky --save-dev
npx husky init

# Add commit-msg hook
echo 'npx gitlint "$1"' > .husky/commit-msg
chmod +x .husky/commit-msg
```

### Using lefthook

```yaml
# lefthook.yml
commit-msg:
  commands:
    gitlint:
      run: npx gitlint {1}
```

## Uninstalling Hooks

### Automatic Removal

```bash
gitlint hooks --uninstall
```

### Manual Removal

```bash
rm .git/hooks/commit-msg
```

## Bypassing Hooks

For emergencies, bypass the hook:

```bash
git commit --no-verify -m "emergency fix"
```

Use sparingly! Invalid commits will still exist in history.

## Shared Hook Configuration

### Using package.json

Share hook configuration with your team:

```json
{
  "scripts": {
    "prepare": "gitlint hooks --install"
  },
  "devDependencies": {
    "@stacksjs/gitlint": "^0.1.0"
  }
}
```

Team members get hooks automatically on `npm install`.

### Using Git Templates

Set up hooks for all new repositories:

```bash
# Create template directory
mkdir -p ~/.git-templates/hooks

# Create hook
cat > ~/.git-templates/hooks/commit-msg << 'EOF'
# !/bin/sh
npx gitlint "$1"
EOF

chmod +x ~/.git-templates/hooks/commit-msg

# Configure Git to use template
git config --global init.templateDir ~/.git-templates
```

## Troubleshooting

### Hook Not Running

Check if the hook exists and is executable:

```bash
ls -la .git/hooks/commit-msg
```

Make it executable:

```bash
chmod +x .git/hooks/commit-msg
```

### Wrong gitlint Version

Ensure local installation is used:

```bash
# Use npx/bunx to ensure local version
npx gitlint --version
bunx gitlint --version
```

### Permission Denied

```bash
# Fix permissions
chmod +x .git/hooks/commit-msg
```

### Hook Output Not Visible

Some Git interfaces suppress hook output. Use verbose mode:

```bash
# In the hook
gitlint --verbose "$1"
```

## CI Integration

Also validate commits in CI to catch bypassed hooks:

```yaml
# GitHub Actions

- name: Validate commit messages

  run: |
    git log --format=%B -n 1 | npx gitlint
```

See [CI/CD Integration](/advanced/ci-cd-integration) for more details.

## Best Practices

1. **Always install hooks on setup**

   ```bash
   npm install && npm run prepare
   ```

2. **Document hook requirements**

   Add setup instructions to your README

3. **Use consistent configuration**

   Commit `gitlint.config.ts` to the repository

4. **Combine with CI validation**

   Hooks can be bypassed; CI provides backup validation

5. **Allow emergency bypass**

   Document when `--no-verify` is acceptable

## Next Steps

- [Configuration](/config) - Configure validation rules
- [CI/CD Integration](/advanced/ci-cd-integration) - Validate in pipelines
- [Custom Validators](/advanced/custom-validators) - Create custom rules
