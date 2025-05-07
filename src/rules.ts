import type { LintRule } from './types'

// Rule: Enforce conventional commit format
const conventionalCommits: LintRule = {
  name: 'conventional-commits',
  description: 'Enforces conventional commit format',
  validate: (commitMsg: string) => {
    // Basic format: <type>[(scope)]: <description>
    const pattern = /^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\([a-z0-9-]+\))?: .+$/i

    const firstLine = commitMsg.split('\n')[0]

    if (!pattern.test(firstLine.replace(/['"]/g, ''))) {
      return {
        valid: false,
        message: 'Commit message header does not follow conventional commit format: <type>[(scope)]: <description>',
      }
    }

    return { valid: true }
  },
}

// Rule: Header max length
const headerMaxLength: LintRule = {
  name: 'header-max-length',
  description: 'Enforces a maximum length for the commit message header',
  validate: (commitMsg: string, config?: { maxLength?: number }) => {
    const maxLength = config?.maxLength || 72
    const firstLine = commitMsg.split('\n')[0]

    if (firstLine.length > maxLength) {
      return {
        valid: false,
        message: `Commit message header exceeds maximum length of ${maxLength} characters`,
      }
    }

    return { valid: true }
  },
}

// Rule: Body max line length
const bodyMaxLineLength: LintRule = {
  name: 'body-max-line-length',
  description: 'Enforces a maximum line length for the commit message body',
  validate: (commitMsg: string, config?: { maxLength?: number }) => {
    const maxLength = config?.maxLength || 100
    const lines = commitMsg.split('\n').slice(1).filter(line => line.trim() !== '')

    const longLines = lines.filter(line => line.length > maxLength)
    if (longLines.length > 0) {
      return {
        valid: false,
        message: `Commit message body contains lines exceeding maximum length of ${maxLength} characters`,
      }
    }

    return { valid: true }
  },
}

// Rule: Enforce empty line between header and body
const bodyLeadingBlankLine: LintRule = {
  name: 'body-leading-blank',
  description: 'Enforces a blank line between the commit header and body',
  validate: (commitMsg: string) => {
    const lines = commitMsg.split('\n')

    if (lines.length > 1 && lines[1].trim() !== '') {
      return {
        valid: false,
        message: 'Commit message must have a blank line between header and body',
      }
    }

    return { valid: true }
  },
}

// Rule: No trailing whitespace
const noTrailingWhitespace: LintRule = {
  name: 'no-trailing-whitespace',
  description: 'Checks for trailing whitespace in commit message',
  validate: (commitMsg: string) => {
    const lines = commitMsg.split('\n')
    const linesWithTrailingWhitespace = lines.filter(line => /\s+$/.test(line))

    if (linesWithTrailingWhitespace.length > 0) {
      return {
        valid: false,
        message: 'Commit message contains lines with trailing whitespace',
      }
    }

    return { valid: true }
  },
}

// Export all rules
export const rules: LintRule[] = [
  conventionalCommits,
  headerMaxLength,
  bodyMaxLineLength,
  bodyLeadingBlankLine,
  noTrailingWhitespace,
]
