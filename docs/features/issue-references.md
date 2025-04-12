# Issue References

GitLint provides functionality to parse and validate issue references in commit messages. This feature helps maintain traceability between commits and issue tracking systems like GitHub Issues, Jira, or other project management tools.

## Understanding Issue References

Issue references are identifiers that link a commit to a specific issue or ticket in your issue tracking system. Common formats include:

- GitHub-style references: `#123`, `organization/repo#123`
- Jira-style references: `PROJ-123`, `PROJECT-456`
- General ticket references: `GH-123`, `TICKET-789`

## How GitLint Processes Issue References

GitLint parses the commit message to extract issue references and makes them available in the parsed commit result. This enables validation rules to check for proper referencing.

### Parsed Result Structure

When GitLint parses a commit message, it extracts issue references into the following structure:

```ts
interface CommitReference {
  action: string | null // Action associated with the reference (e.g., "Fixes", "Closes")
  owner: string | null // Repository owner (for GitHub-style references)
  repository: string | null // Repository name (for GitHub-style references)
  issue: string // Issue identifier
  raw: string // Raw reference text
  prefix: string // Prefix used (e.g., "#", "GH-", "JIRA-")
}

interface CommitParsedResult {
  // ...other fields
  references: CommitReference[]
  // ...other fields
}
```

## Examples of Issue References

Here are examples of commit messages with different types of issue references:

```
feat: add login page (JIRA-123)

Implement the login page design according to the mockups.
Related to: #456, USER-789
```

This commit message contains three issue references:

1. `JIRA-123` in the header
2. `#456` in the body (GitHub-style reference)
3. `USER-789` in the body (project-specific reference)

## Custom Issue Reference Rules

You can create custom rules to validate issue references according to your team's conventions:

```ts
import type { LintRule } from 'gitlint'
import { parseCommit } from 'gitlint'

export const requireJiraReference: LintRule = {
  name: 'require-jira-reference',
  description: 'Requires a Jira ticket reference in the commit message',
  validate: (commitMsg: string) => {
    const parsed = parseCommit(commitMsg)

    // Check if there's at least one reference matching the JIRA pattern
    const hasJiraReference = parsed.references.some(ref =>
      /^[A-Z]+-\d+$/.test(ref.issue)
    )

    if (!hasJiraReference) {
      return {
        valid: false,
        message: 'Commit message must include a Jira ticket reference (e.g., PROJ-123)',
      }
    }

    return { valid: true }
  },
}
```

## Common Reference Validation Rules

### Requiring Issue References

You might want to enforce that every commit references an issue:

```ts
const requireIssueReference: LintRule = {
  name: 'require-issue-reference',
  description: 'Requires an issue reference in the commit message',
  validate: (commitMsg: string) => {
    const parsed = parseCommit(commitMsg)

    if (parsed.references.length === 0) {
      return {
        valid: false,
        message: 'Commit message must include an issue reference',
      }
    }

    return { valid: true }
  },
}
```

### Validating Reference Format

You can also ensure that references follow a specific format:

```ts
const validReferenceFormat: LintRule = {
  name: 'valid-reference-format',
  description: 'Ensures issue references follow the correct format',
  validate: (commitMsg: string, config?: { pattern?: string }) => {
    const pattern = config?.pattern ? new RegExp(config.pattern) : /^(#\d+|[A-Z]+-\d+)$/
    const parsed = parseCommit(commitMsg)

    const invalidRefs = parsed.references.filter(ref =>
      !pattern.test(ref.raw)
    )

    if (invalidRefs.length > 0) {
      return {
        valid: false,
        message: `Invalid issue reference format: ${invalidRefs.map(r => r.raw).join(', ')}`,
      }
    }

    return { valid: true }
  },
}
```

## Integration with Issue Tracking Systems

GitLint's issue reference parsing enables integration with issue tracking systems:

### Jira Integration Example

```ts
const validateJiraReferences: LintRule = {
  name: 'validate-jira-references',
  description: 'Validates that Jira references point to existing tickets',
  validate: async (commitMsg: string) => {
    const parsed = parseCommit(commitMsg)
    const jiraRefs = parsed.references.filter(ref => /^[A-Z]+-\d+$/.test(ref.issue))

    for (const ref of jiraRefs) {
      // You could implement API checks here to verify the ticket exists
      // This is a simplified example
      const ticketExists = await checkJiraTicketExists(ref.issue)

      if (!ticketExists) {
        return {
          valid: false,
          message: `Referenced Jira ticket ${ref.issue} does not exist or is not accessible`,
        }
      }
    }

    return { valid: true }
  },
}

// Example function to check if a Jira ticket exists
async function checkJiraTicketExists(ticketId: string): Promise<boolean> {
  // Implementation would depend on your Jira API access
  // This is just a placeholder
  return true
}
```

## Best Practices for Issue References

1. **Consistency**: Use a consistent format for issue references across your team
2. **Placement**: Decide where references should appear (e.g., in the header, body, or footer)
3. **Action verbs**: Consider using action verbs like "Fixes", "Resolves", or "Relates to" with references
4. **Multiple references**: Establish guidelines for how to handle commits that affect multiple issues
5. **Automation**: Use GitHub or GitLab's automatic issue closing features when applicable
