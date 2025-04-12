# CI/CD Integration

GitLint can be integrated into continuous integration workflows to ensure that all commits in your repository adhere to your team's commit message standards. This guide covers how to integrate GitLint with popular CI/CD platforms.

## Why Integrate with CI/CD?

While local Git hooks help developers maintain commit message quality during development, CI/CD integration offers additional benefits:

1. **Catch errors early**: Validate commit messages before code is merged
2. **Enforce standards**: Ensure all team members follow commit conventions
3. **Centralized validation**: Apply consistent rules across all branches
4. **PR validation**: Check commit messages in pull requests
5. **Branch protection**: Require commit message validation for protected branches

## GitHub Actions

You can easily add GitLint validation to your GitHub Actions workflow:

```yaml
# .github/workflows/gitlint.yml
name: Validate Commit Messages

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  gitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Fetch all history for all branches and tags

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Validate latest commit message
        run: npx gitlint
        if: github.event_name == 'push'

      - name: Validate PR commit messages
        run: git log --pretty=%B ${{ github.event.pull_request.base.sha }}..${{ github.event.pull_request.head.sha }} | npx gitlint
        if: github.event_name == 'pull_request'
```

## GitLab CI

For GitLab CI, add a job to your `.gitlab-ci.yml` file:

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - build
  - test

gitlint:
  stage: validate
  image: node:18-alpine
  script:
    - npm install gitlint
    - |
      if [ "$CI_PIPELINE_SOURCE" == "merge_request_event" ]; then
        # For merge requests, check all commits in the MR
        git fetch origin $CI_MERGE_REQUEST_TARGET_BRANCH_NAME
        git log --pretty=%B FETCH_HEAD..$CI_COMMIT_SHA | npx gitlint
      else
        # For direct commits, check the latest commit
        git log --pretty=%B -n 1 | npx gitlint
      fi
```

## CircleCI

Add GitLint validation to your CircleCI configuration:

```yaml
# .circleci/config.yml
version: 2.1
jobs:
  validate-commits:
    docker:
      - image: cimg/node:18.12
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm install gitlint
      - run:
          name: Validate commit messages
          command: |
            if [[ -n "$CIRCLE_PULL_REQUEST" ]]; then
              # For pull requests
              PR_NUMBER=${CIRCLE_PULL_REQUEST##*/}
              git fetch origin +refs/pull/$PR_NUMBER/merge
              git log --pretty=%B HEAD^..HEAD | npx gitlint
            else
              # For direct commits
              git log --pretty=%B -n 1 | npx gitlint
            fi

workflows:
  version: 2
  build-test-deploy:
    jobs:
      - validate-commits
      # Other jobs...
```

## Azure DevOps Pipelines

For Azure DevOps, add a validation task to your pipeline:

```yaml
# azure-pipelines.yml
trigger:
  - main
  - dev

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: 18.x
    displayName: Install Node.js

  - script: npm install gitlint
    displayName: Install dependencies

  - script: |
      if [ -n "$(System.PullRequest.SourceBranch)" ]; then
        # For pull requests
        git fetch origin $(System.PullRequest.TargetBranch)
        git log --pretty=%B origin/$(System.PullRequest.TargetBranch)..HEAD | npx gitlint
      else
        # For direct commits
        git log --pretty=%B -n 1 | npx gitlint
      fi
    displayName: Validate commit messages
```

## Customizing CI Validation

For more advanced CI validation scenarios, you can create a custom script:

```js
// scripts/validate-commits.js
const { execSync } = require('node:child_process')
const { lintCommitMessage } = require('gitlint')

// Determine which commits to check based on CI environment
function getCommitsToCheck() {
  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    const base = process.env.GITHUB_BASE_REF
    const head = process.env.GITHUB_HEAD_REF
    return execSync(`git log --pretty=%B origin/${base}..origin/${head}`).toString()
  }
  else {
    // Default to checking the latest commit
    return execSync('git log --pretty=%B -n 1').toString()
  }
}

// Get and validate commits
const commits = getCommitsToCheck().split('\n\ncommit ').filter(Boolean)
let hasErrors = false

commits.forEach((commit) => {
  const result = lintCommitMessage(commit)

  if (!result.valid) {
    console.error(`❌ Invalid commit message:`)
    console.error(commit.split('\n')[0])
    result.errors.forEach(error => console.error(`  - ${error}`))
    hasErrors = true
  }
})

if (hasErrors) {
  process.exit(1)
}
else {
  console.log('✅ All commit messages are valid')
}
```

## Best Practices for CI Integration

1. **Fast feedback**: Configure validation as an early step in your CI pipeline
2. **Clear error reporting**: Ensure validation failures provide actionable feedback
3. **Skip certain commits**: Configure rules to ignore merge commits or automated commits
4. **Documentation**: Document the commit message requirements in your repository
5. **Block merges**: Consider making commit message validation a required check for protected branches

## Troubleshooting

### Common Issues

**Issue**: CI validation passes locally but fails in CI
**Solution**: Ensure your local and CI GitLint configurations match. Check for environment-specific settings.

**Issue**: Merge commits failing validation
**Solution**: Add merge commit patterns to your ignores list in GitLint configuration.

**Issue**: Performance issues with large PRs
**Solution**: Consider validating only the latest N commits or sampling commits.
