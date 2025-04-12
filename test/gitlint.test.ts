import { describe, expect, it, spyOn } from 'bun:test'
import { lintCommitMessage, parseCommitMessage, rules } from '../src'

describe('gitlint', () => {
  // Test all rules
  describe('Rules', () => {
    describe('conventional-commits', () => {
      const rule = rules.find(r => r.name === 'conventional-commits')!

      it('should validate conventional commit format', () => {
        expect(rule.validate('feat: add new feature').valid).toBe(true)
        expect(rule.validate('fix(core): fix critical bug').valid).toBe(true)
        expect(rule.validate('docs(readme): update documentation').valid).toBe(true)
        expect(rule.validate('style: format code').valid).toBe(true)
        expect(rule.validate('refactor: simplify logic').valid).toBe(true)
        expect(rule.validate('test: add unit tests').valid).toBe(true)
        expect(rule.validate('chore: update dependencies').valid).toBe(true)
      })

      it('should reject invalid commit formats', () => {
        expect(rule.validate('invalid commit message').valid).toBe(false)
        expect(rule.validate('feature: add new feature').valid).toBe(false) // invalid type
        expect(rule.validate('feat - add new feature').valid).toBe(false) // invalid separator
        expect(rule.validate('feat:').valid).toBe(false) // no description
        expect(rule.validate('feat').valid).toBe(false) // no colon and description
      })
    })

    describe('header-max-length', () => {
      const rule = rules.find(r => r.name === 'header-max-length')!

      it('should validate headers within the limit', () => {
        const shortHeader = 'feat: short header'
        expect(rule.validate(shortHeader).valid).toBe(true)
        expect(rule.validate(shortHeader, { maxLength: 20 }).valid).toBe(true)
      })

      it('should reject headers exceeding the limit', () => {
        const longHeader = 'feat: this is a very long header that exceeds the default limit of 72 characters and should fail validation'
        expect(rule.validate(longHeader).valid).toBe(false)
        expect(rule.validate('feat: short header', { maxLength: 10 }).valid).toBe(false)
      })

      it('should use the configured max length', () => {
        const header = 'feat: header with custom length limit'
        expect(rule.validate(header, { maxLength: 100 }).valid).toBe(true)
        expect(rule.validate(header, { maxLength: 20 }).valid).toBe(false)
      })
    })

    describe('body-max-line-length', () => {
      const rule = rules.find(r => r.name === 'body-max-line-length')!

      it('should validate body lines within the limit', () => {
        const message = `feat: short header

This is a body with lines that are within the default limit of 100 characters.
Another line that is well within limits.`
        expect(rule.validate(message).valid).toBe(true)
      })

      it('should reject body lines exceeding the limit', () => {
        const message = `feat: short header

This line in the body exceeds the default limit of 100 characters because it is very very very very very very very very very very long.
Normal line.`
        expect(rule.validate(message).valid).toBe(false)
      })

      it('should use the configured max length', () => {
        const shortLine = `feat: short header

Short body line here.`

        const longLine = `feat: short header

This body line exceeds 30 characters limit.`

        expect(rule.validate(shortLine, { maxLength: 25 }).valid).toBe(true)
        expect(rule.validate(longLine, { maxLength: 30 }).valid).toBe(false)
      })
    })

    describe('body-leading-blank', () => {
      const rule = rules.find(r => r.name === 'body-leading-blank')!

      it('should validate messages with leading blank line before body', () => {
        const message = `feat: short header

This is the body with a proper blank line before it.`
        expect(rule.validate(message).valid).toBe(true)
      })

      it('should reject messages without leading blank line', () => {
        const message = `feat: short header
This body starts immediately after the header with no blank line.`
        expect(rule.validate(message).valid).toBe(false)
      })

      it('should validate header-only messages', () => {
        expect(rule.validate('feat: short header').valid).toBe(true)
      })
    })

    describe('no-trailing-whitespace', () => {
      const rule = rules.find(r => r.name === 'no-trailing-whitespace')!

      it('should validate messages without trailing whitespace', () => {
        const message = `feat: short header

This body has no trailing whitespace.
Neither does this line.`
        expect(rule.validate(message).valid).toBe(true)
      })

      it('should reject messages with trailing whitespace', () => {
        const message = 'feat: short header\n\nThis body has trailing spaces.    \nThis line is fine.'
        expect(rule.validate(message).valid).toBe(false)
      })
    })
  })

  // Test message parser
  describe('Parser', () => {
    it('should correctly parse a simple commit message', () => {
      const result = parseCommitMessage('feat: add new feature')

      expect(result.type).toBe('feat')
      expect(result.scope).toBe(null)
      expect(result.subject).toBe('add new feature')
      expect(result.body).toBe(null)
      expect(result.footer).toBe(null)
      expect(result.header).toBe('feat: add new feature')
      expect(result.mentions.length).toBe(0)
      expect(result.references.length).toBe(0)
    })

    it('should correctly parse commit message with scope', () => {
      const result = parseCommitMessage('feat(api): add new endpoint')

      expect(result.type).toBe('feat')
      expect(result.scope).toBe('api')
      expect(result.subject).toBe('add new endpoint')
    })

    it('should correctly parse commit message with body', () => {
      const message = `feat: add new feature

This is the body of the commit message.
It can span multiple lines.`

      const result = parseCommitMessage(message)

      expect(result.type).toBe('feat')
      expect(result.body).toBe('This is the body of the commit message.\nIt can span multiple lines.')
      expect(result.footer).toBe(null)
    })

    it('should correctly parse commit message with footer', () => {
      const message = `feat: add new feature

This is the body of the commit message.

Fixes #123
Reviewed-by: @someone`

      const result = parseCommitMessage(message)

      expect(result.body).toBe('This is the body of the commit message.')
      expect(result.footer).toBe('Fixes #123\nReviewed-by: @someone')
    })

    it('should extract issue references', () => {
      const message = `feat: add new feature

Fixes #123
Closes #456
Resolves organization/repo#789`

      const result = parseCommitMessage(message)

      expect(result.references.length).toBe(3)
      expect(result.references[0].issue).toBe('123')
      expect(result.references[0].action).toBe('fixes')
      expect(result.references[1].issue).toBe('456')
      expect(result.references[2].issue).toBe('789')
    })

    it('should extract mentions', () => {
      const message = `feat: add new feature

Co-authored-by: @alice
Reviewed-by: @bob and @charlie`

      const result = parseCommitMessage(message)

      expect(result.mentions.length).toBe(3)
      expect(result.mentions).toContain('alice')
      expect(result.mentions).toContain('bob')
      expect(result.mentions).toContain('charlie')
    })
  })

  // Test main linting functionality
  describe('Linter', () => {
    it('should validate a valid commit message', () => {
      const result = lintCommitMessage('feat: add new feature')

      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('should reject an invalid commit message', () => {
      const result = lintCommitMessage('invalid commit message')

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should check multiple rules', () => {
      const message = `feat: this is a very very very very very very very very long header that definitely exceeds the max length limit

Body without trailing whitespace.`

      const result = lintCommitMessage(message)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBe(1) // The header-max-length rule should fail
    })
  })

  // Integration tests combining parser and linter
  describe('Integration', () => {
    it('should validate different types of messages', () => {
      const messages = [
        { message: 'feat: add new feature', valid: true },
        { message: 'fix(core): critical bugfix', valid: true },
        { message: 'docs: update README.md', valid: true },
        { message: 'invalid commit message', valid: false },
        { message: 'feature: wrong type keyword', valid: false },
      ]

      for (const { message, valid } of messages) {
        expect(lintCommitMessage(message).valid).toBe(valid)
      }
    })

    it('should parse and validate a complex message', () => {
      const message = `feat(api): add user authentication endpoint

This commit adds a new endpoint for user authentication with JWT tokens.
The implementation includes:
- Login route
- Token generation
- Validation middleware

Fixes #123
Closes #456
Reviewed-by: @securityTeam`

      const parseResult = parseCommitMessage(message)
      const lintResult = lintCommitMessage(message)

      expect(parseResult.type).toBe('feat')
      expect(parseResult.scope).toBe('api')
      expect(parseResult.references.length).toBe(2)
      expect(parseResult.mentions.length).toBe(1)

      expect(lintResult.valid).toBe(true)
    })
  })

  // Test edge cases and specific configurations
  describe('Edge Cases', () => {
    it('should handle empty commit messages', () => {
      const result = lintCommitMessage('')
      expect(result.valid).toBe(false)
    })

    it('should handle commit messages with only whitespace', () => {
      const result = lintCommitMessage('   \n   \n   ')
      expect(result.valid).toBe(false)
    })

    it('should handle unusual but valid commit messages', () => {
      // Just a type and colon is technically valid per our regex
      const result1 = lintCommitMessage('chore: ')
      expect(result1.valid).toBe(false) // Our implementation requires description text

      // Unusual formatting but valid
      const result2 = lintCommitMessage('docs(readme): update\n\nOnly a short body line\n')
      expect(result2.valid).toBe(true)
    })

    it('should parse commit messages with unusual references', () => {
      const message = `feat: add feature

References:
- fixes #123, #456
- closes user/repo#789
- resolves organization/project#1000
- Ref: JIRA-1234`

      const result = parseCommitMessage(message)

      // Check references are correctly parsed
      expect(result.references.length).toBe(3) // Only GitHub-style refs are detected

      // Check ref properties
      const ref = result.references.find(r => r.issue === '789')
      expect(ref).toBeDefined()
      expect(ref?.owner).toBe('user')
      expect(ref?.repository).toBe('repo')
    })

    it('should parse commit messages with multiple scopes', () => {
      // Some projects use multiple scopes like feat(api,auth): ...
      const result = parseCommitMessage('feat(api,auth): add authentication endpoints')

      expect(result.type).toBe('feat')
      expect(result.scope).toBe('api,auth')
      expect(result.subject).toBe('add authentication endpoints')
    })
  })

  // Test rule combinations
  describe('Rule Combinations', () => {
    it('should validate message that passes multiple rules', () => {
      const perfectMessage = `feat: add new feature

This is a perfect commit message that:
- Has a conventional header
- Has proper header length
- Has a blank line after header
- Has proper body line length
- Has no trailing whitespace`

      const result = lintCommitMessage(perfectMessage)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
      expect(result.warnings.length).toBe(0)
    })

    it('should validate message that breaks multiple rules', () => {
      // This message breaks multiple rules:
      // - Non-conventional header
      // - No blank line after header
      // - Trailing whitespace
      const badMessage = `This is not a conventional commit message
It has no blank line after header and has trailing whitespace  `

      const result = lintCommitMessage(badMessage)
      expect(result.valid).toBe(false)
      // Should have at least one error
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  // Add simplified configuration tests that don't modify internal state
  describe('Configuration', () => {
    it('should have proper default rule configuration', () => {
      // Check that conventional-commits rule is properly configured as error by default
      const invalidMessage = 'This is not a conventional commit'
      const result = lintCommitMessage(invalidMessage)

      // Should be invalid with errors (not just warnings)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should evaluate all enabled rules', () => {
      // Create a message that breaks multiple rules
      const badMessage = `feat: this is a very very very very very very very very very very very very very very long header
body with no blank line and trailing whitespace  `

      const result = lintCommitMessage(badMessage)

      // Should have multiple errors
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  // Test performance on longer commit messages
  describe('Performance', () => {
    it('should handle long commit messages efficiently', () => {
      // Create a very long commit message with multiple sections
      let longBody = ''
      for (let i = 0; i < 50; i++) {
        longBody += `Line ${i}: This is a line of text in a very long commit message body to test performance.\n`
      }

      const longMessage = `feat(performance): add performance test

${longBody}

Fixes #123
Closes #456
Resolves #789`

      // Perform the lint operation and measure time
      const startTime = performance.now()
      const result = lintCommitMessage(longMessage)
      const endTime = performance.now()

      // Linting operation should complete in a reasonable time (e.g., < 50ms)
      // This is a loose expectation as performance can vary by environment
      const duration = endTime - startTime
      expect(duration).toBeLessThan(50)

      // Verify the long message is correctly validated
      expect(result.valid).toBe(true)
    })
  })

  // Test error handling
  describe('Error Handling', () => {
    it('should handle missing features gracefully', () => {
      // Test with a message that triggers complex features
      const complexMessage = `feat(api): add new endpoint

This closes multiple issues in different repos:
fix user/repo#123, close org/proj#456

Co-authored-by: @teammate`

      const result = lintCommitMessage(complexMessage)

      // Should still return a valid result
      expect(result.valid).toBe(true)
    })
  })

  // Test custom rule concept
  describe('Rule Concepts', () => {
    it('should validate against each individual rule', () => {
      // Test each rule individually with appropriate messages
      const validConventional = rules.find(r => r.name === 'conventional-commits')!
        .validate('feat: valid message')
      expect(validConventional.valid).toBe(true)

      const validHeaderLength = rules.find(r => r.name === 'header-max-length')!
        .validate('feat: short header')
      expect(validHeaderLength.valid).toBe(true)

      const validBodyLength = rules.find(r => r.name === 'body-max-line-length')!
        .validate('feat: short header\n\nShort body.')
      expect(validBodyLength.valid).toBe(true)
    })

    it('should have appropriate error messages for each rule', () => {
      // Check that rules provide helpful error messages
      const conventionalRule = rules.find(r => r.name === 'conventional-commits')!
      const conventionalResult = conventionalRule.validate('invalid message')
      expect(conventionalResult.valid).toBe(false)
      expect(conventionalResult.message).toBeDefined()
      expect(typeof conventionalResult.message).toBe('string')
      expect(conventionalResult.message!.length).toBeGreaterThan(0)
    })
  })
})
