# CI/CD Integration

This guide covers integrating GitLint into CI/CD pipelines for automated commit message validation.

## GitHub Actions

### Basic Validation

```yaml
# .github/workflows/commit-lint.yml
name: Commit Lint

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:

      - uses: actions/checkout@v4

        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install GitLint

        run: bun add @stacksjs/gitlint

      - name: Lint commits

        run: |
          git log --format=%B ${{ github.event.pull_request.base.sha }}..${{ github.sha }} | \
          while read -r line; do
            if [ -n "$line" ]; then
              echo "$line" | bunx gitlint
            fi
          done
```

### Validate PR Commits

```yaml
name: Validate PR Commits

on:
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:

      - uses: actions/checkout@v4

        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies

        run: bun install

      - name: Validate all PR commits

        run: |
          COMMITS=$(git log --format='%H' ${{ github.event.pull_request.base.sha }}..${{ github.sha }})
          FAILED=0

          for sha in $COMMITS; do
            MSG=$(git log -1 --format=%B $sha)
            echo "Checking: $sha"
            echo "$MSG"

            if ! echo "$MSG" | bunx gitlint; then
              FAILED=1
            fi
            echo "---"
          done

          exit $FAILED
```

### With Detailed Report

```yaml
name: Commit Lint Report

on:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:

      - uses: actions/checkout@v4

        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v1

      - name: Install GitLint

        run: bun add @stacksjs/gitlint

      - name: Create lint report

        id: lint
        run: |
          echo "## Commit Lint Report" > report.md
          echo "" >> report.md

          COMMITS=$(git log --format='%H' ${{ github.event.pull_request.base.sha }}..${{ github.sha }})
          TOTAL=0
          PASSED=0
          FAILED=0

          for sha in $COMMITS; do
            TOTAL=$((TOTAL + 1))
            MSG=$(git log -1 --format=%s $sha)

            if git log -1 --format=%B $sha | bunx gitlint 2>/dev/null; then
              PASSED=$((PASSED + 1))
              echo "- $MSG" >> report.md
            else
              FAILED=$((FAILED + 1))
              echo "- $MSG" >> report.md
            fi
          done

          echo "" >> report.md
          echo "**Results:** $PASSED/$TOTAL passed" >> report.md

          echo "total=$TOTAL" >> $GITHUB_OUTPUT
          echo "passed=$PASSED" >> $GITHUB_OUTPUT
          echo "failed=$FAILED" >> $GITHUB_OUTPUT

      - name: Comment on PR

        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs')
            const report = fs.readFileSync('report.md', 'utf8')

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            })

      - name: Check result

        if: steps.lint.outputs.failed > 0
        run: exit 1
```

## GitLab CI

### Basic Pipeline

```yaml
# .gitlab-ci.yml
stages:

  - lint

commit-lint:
  stage: lint
  image: oven/bun:latest
  script:

    - bun add @stacksjs/gitlint
    - |

      if [ "$CI_PIPELINE_SOURCE" = "merge_request_event" ]; then
        git fetch origin $CI_MERGE_REQUEST_TARGET_BRANCH_NAME
        COMMITS=$(git log --format=%H origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME..HEAD)
        for sha in $COMMITS; do
          git log -1 --format=%B $sha | bunx gitlint
        done
      fi
  rules:

    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

```

### With Artifacts

```yaml
commit-lint:
  stage: lint
  image: oven/bun:latest
  script:

    - bun add @stacksjs/gitlint
    - |

      git log --format="%H %s" origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME..HEAD > commits.txt
      while read sha msg; do
        if git log -1 --format=%B $sha | bunx gitlint 2>&1 | tee -a lint-output.txt; then
          echo "PASS: $msg" >> results.txt
        else
          echo "FAIL: $msg" >> results.txt
        fi
      done < commits.txt
  artifacts:
    paths:

      - results.txt
      - lint-output.txt

    when: always
```

## CircleCI

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  lint-commits:
    docker:

      - image: oven/bun:latest

    steps:

      - checkout
      - run:

          name: Install GitLint
          command: bun add @stacksjs/gitlint

      - run:

          name: Lint commits
          command: |
            if [ -n "$CIRCLE_PULL_REQUEST" ]; then
              BASE_SHA=$(git merge-base origin/main HEAD)
              git log --format=%B $BASE_SHA..HEAD | bunx gitlint
            fi

workflows:
  version: 2
  lint:
    jobs:

      - lint-commits

```

## Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'oven/bun:latest'
        }
    }

    stages {
        stage('Lint Commits') {
            when {
                changeRequest()
            }
            steps {
                sh 'bun add @stacksjs/gitlint'
                sh '''
                    COMMITS=$(git log --format=%H origin/${CHANGE_TARGET}..HEAD)
                    for sha in $COMMITS; do
                        git log -1 --format=%B $sha | bunx gitlint
                    done
                '''
            }
        }
    }
}
```

## Azure DevOps

```yaml
# azure-pipelines.yml
trigger:

  - main

pr:

  - main

pool:
  vmImage: ubuntu-latest

steps:

  - task: NodeTool@0

    inputs:
      versionSpec: '20.x'

  - script: |

      npm install -g bun
      bun add @stacksjs/gitlint
    displayName: Install GitLint

  - script: |

      COMMITS=$(git log --format=%H origin/main..HEAD)
      for sha in $COMMITS; do
        git log -1 --format=%B $sha | bunx gitlint
      done
    displayName: Lint Commits
    condition: eq(variables['Build.Reason'], 'PullRequest')
```

## Pre-commit Integration

### Using pre-commit framework

```yaml
# .pre-commit-config.yaml
repos:

  - repo: local

    hooks:

      - id: gitlint

        name: GitLint
        entry: bunx gitlint
        language: system
        stages: [commit-msg]
```

## Programmatic Integration

### Custom CI Script

```typescript
// scripts/ci-lint.ts
import { lintCommitMessage } from '@stacksjs/gitlint'
import { $ } from 'bun'

async function main() {
  const baseRef = process.env.BASE_REF || 'origin/main'
  const headRef = process.env.HEAD_REF || 'HEAD'

  const { stdout } = await $`git log --format=%H ${baseRef}..${headRef}`.quiet()
  const commits = stdout.trim().split('\n').filter(Boolean)

  let hasErrors = false

  for (const sha of commits) {
    const { stdout: message } = await $`git log -1 --format=%B ${sha}`.quiet()
    const result = lintCommitMessage(message.trim())

    if (!result.valid) {
      console.error(`Commit ${sha.slice(0, 7)}:`)
      console.error(`  Message: ${message.split('\n')[0]}`)
      result.errors.forEach(e => console.error(`  Error: ${e}`))
      hasErrors = true
    }
  }

  if (hasErrors) {
    process.exit(1)
  }

  console.log(`All ${commits.length} commits validated successfully`)
}

main()
```

### Run in CI

```yaml

- name: Validate commits

  run: bun run scripts/ci-lint.ts
  env:
    BASE_REF: ${{ github.event.pull_request.base.sha }}
    HEAD_REF: ${{ github.sha }}
```

## Best Practices

1. **Validate all PR commits**: Not just the latest
2. **Provide clear feedback**: Show which commits failed
3. **Use same config as local**: Consistency matters
4. **Cache dependencies**: Speed up CI runs
5. **Fail fast**: Exit on first error for quick feedback

## Next Steps

- [Configuration](/advanced/configuration) - CI-specific config
- [Performance](/advanced/performance) - Optimize for CI
- [Git Hooks](/features/git-hooks) - Local validation
