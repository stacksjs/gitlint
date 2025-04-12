# Git Hooks Integration

Git hooks allow you to run scripts before or after certain Git events, such as committing, pushing, or merging. GitLint provides built-in support for integrating with Git hooks, ensuring your commit messages are validated automatically as part of your Git workflow.

## Understanding Git Hooks

Git hooks are scripts that Git executes before or after events such as commit, push, and receive. They're stored in the `.git/hooks` directory of your repository and can be written in any scripting language.

For commit message validation, we primarily use the `commit-msg` hook, which is triggered after you write a commit message but before the commit is finalized.

## Automatic Git Hooks Installation

GitLint provides a convenient command to automatically install the necessary Git hooks for commit message validation:

```bash
# Install GitLint hooks in the current repository
gitlint hooks --install

# Force installation (overwrites existing hooks)
gitlint hooks --install --force
```

This command:

1. Creates a `commit-msg` hook in your `.git/hooks` directory
2. Makes the hook executable
3. Configures the hook to use GitLint for validating commit messages

## Manual Hook Installation

If you prefer to set up hooks manually or want to customize the hook behavior, you can create the hook file yourself:

```bash
# Create the commit-msg hook file
touch .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

Then add the following content to the file:

```bash
#!/bin/sh

# Get the commit message file path (passed by Git)
commit_msg_file=$1

# Run GitLint on the commit message
npx gitlint "$commit_msg_file" || exit 1

# Exit with success
exit 0
```

## Customizing the Git Hook

You can customize the Git hook to add additional functionality or modify its behavior:

```bash
#!/bin/sh

# Get the commit message file path
commit_msg_file=$1

# Check if this is a merge commit (has a MERGE_MSG file)
if [ -f .git/MERGE_MSG ]; then
  echo "Skipping validation for merge commit"
  exit 0
fi

# Check if this is a revert commit
grep -q "^Revert " "$commit_msg_file" && exit 0

# Run GitLint with custom configuration
GITLINT_CONFIG_PATH="./custom-gitlint.config.js" npx gitlint "$commit_msg_file" || exit 1

# Additional custom validations
# ...

exit 0
```

## Integrating with Other Git Hooks

Beyond commit message validation, you might want to integrate GitLint with other Git hooks:

### Pre-push Hook

Validate all commit messages in a push:

```bash
#!/bin/sh

# Create a pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh

# Get the remote name and URL
remote="$1"
url="$2"

# Only run on pushes to specific branches
current_branch=$(git symbolic-ref --short HEAD)
if [ "$current_branch" = "main" ] || [ "$current_branch" = "develop" ]; then
  echo "Validating commit messages before pushing to $current_branch..."

  # Get the range of commits we're pushing
  range=$(git merge-base HEAD origin/$current_branch)..HEAD

  # Extract and validate each commit message
  git log --pretty=%B $range | npx gitlint

  if [ $? -ne 0 ]; then
    echo "Push rejected: commit messages do not meet the guidelines."
    exit 1
  fi
fi

exit 0
EOF

chmod +x .git/hooks/pre-push
```

### Post-checkout Hook

Switch to different validation rules based on the branch:

```bash
#!/bin/sh

# Create a post-checkout hook
cat > .git/hooks/post-checkout << 'EOF'
#!/bin/sh

# Get the branch name
branch=$(git symbolic-ref --short HEAD)

# Set different GitLint configurations based on branch
if [[ $branch == feature/* ]]; then
  echo "Using feature branch GitLint configuration"
  cp ./configs/feature-gitlint.config.js ./gitlint.config.js
elif [[ $branch == hotfix/* ]]; then
  echo "Using hotfix branch GitLint configuration"
  cp ./configs/hotfix-gitlint.config.js ./gitlint.config.js
else
  echo "Using default GitLint configuration"
  cp ./configs/default-gitlint.config.js ./gitlint.config.js
fi

exit 0
EOF

chmod +x .git/hooks/post-checkout
```

## Sharing Git Hooks with Your Team

Git hooks aren't committed to the repository by default, so you'll need a way to share them with your team:

### Option 1: Using Git Template Directory

```bash
# Create a template directory
mkdir -p ~/.git-templates/hooks

# Add commit-msg hook to the template
cp /path/to/your/commit-msg ~/.git-templates/hooks/
chmod +x ~/.git-templates/hooks/commit-msg

# Configure Git to use this template
git config --global init.templateDir ~/.git-templates
```

Then, when team members clone the repository or run `git init`, they'll get the hooks.

### Option 2: Using a Script in Your Repository

Add a setup script to your repository:

```bash
#!/bin/sh
# setup-hooks.sh

# Create the commit-msg hook
mkdir -p .git/hooks
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh
npx gitlint "$1" || exit 1
exit 0
EOF

chmod +x .git/hooks/commit-msg
echo "Git hooks installed successfully!"
```

Then, have team members run this script after cloning:

```bash
./setup-hooks.sh
```

### Option 3: Using a Git Hook Manager

Consider using a Git hook manager like Husky or pre-commit to manage and share hooks:

```json
// package.json with Husky
{
  "name": "your-project",
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "gitlint": "^1.0.0",
    "husky": "^8.0.0"
  },
  "husky": {
    "hooks": {
      "commit-msg": "npx gitlint $HUSKY_GIT_PARAMS"
    }
  }
}
```

## Uninstalling Git Hooks

GitLint also provides a command to uninstall its Git hooks:

```bash
# Uninstall GitLint hooks
gitlint hooks --uninstall
```

This will remove the hooks that were installed by GitLint.

## Troubleshooting

### Common Issues

**Issue**: Hook isn't executing
**Solution**: Check that the hook file is executable (`chmod +x .git/hooks/commit-msg`)

**Issue**: Hook works locally but not in CI
**Solution**: CI systems often use `--no-verify` when committing, which bypasses hooks. Use a CI-specific validation approach instead.

**Issue**: Multiple tools competing for the same hook
**Solution**: Consider using a hook manager like Husky that supports running multiple scripts for the same hook.
