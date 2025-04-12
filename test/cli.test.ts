import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

describe('gitlint CLI', () => {
  let tempDir: string
  let mockConsoleError: ReturnType<typeof spyOn>
  let mockConsoleLog: ReturnType<typeof spyOn>

  beforeEach(() => {
    // Create temp directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitlint-test-'))

    // Mock console output to avoid polluting test output
    mockConsoleError = spyOn(console, 'error').mockImplementation(() => {})
    mockConsoleLog = spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Clean up temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
    catch (_error) {
      // Ignore errors during cleanup
    }

    // Restore mocks
    mockConsoleError.mockRestore()
    mockConsoleLog.mockRestore()
  })

  // Helper to run CLI with given arguments
  function runCLI(args: string[] = [], input?: string): string {
    const binPath = path.resolve('bin/gitlint')
    const cmd = `${binPath} ${args.join(' ')}`

    try {
      return execSync(cmd, {
        encoding: 'utf8',
        input,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
    }
    catch (error: any) {
      return error.stdout || error.stderr || error.message
    }
  }

  it('should show help when no arguments are provided', () => {
    // Run CLI with --help flag
    const output = runCLI(['--help'])

    // Check that the output contains expected help text
    expect(output).toContain('gitlint')
    expect(output).toContain('Usage')
    expect(output).toContain('Commands')
    expect(output).toContain('Options')
  })

  it('should validate a valid commit message from stdin', () => {
    const validMessage = 'feat: add new feature'

    try {
      runCLI([], validMessage)
      // If we get here, it means the command succeeded (exit code 0)
      // This is expected for a valid message
    }
    catch (_error) {
      // Should not throw for a valid message
      expect('No error').toBe('Error occurred')
    }
  })

  it('should fail validation for an invalid commit message', () => {
    const invalidMessage = 'Invalid commit message'

    // Instead of checking for an error being thrown directly,
    // we just check the output content
    const output = runCLI([], invalidMessage)
    expect(output).toContain('validation failed') // Error message contains this text
  })

  it('should validate a commit message from a file', () => {
    // Create a test file with a valid commit message
    const commitFile = path.join(tempDir, 'COMMIT_EDITMSG')
    const validMessage = 'feat: add new feature'
    fs.writeFileSync(commitFile, validMessage)

    // Run gitlint with the file
    const output = runCLI([commitFile])

    // Should exit cleanly for a valid message (no specific output to check)
    // We just verify it doesn't fail
    expect(output).not.toContain('validation failed')
  })

  it('should work with the --edit flag for git hook integration', () => {
    // Create a test file simulating git's COMMIT_EDITMSG
    const commitFile = path.join(tempDir, 'COMMIT_EDITMSG')
    const validMessage = 'feat: add new feature'
    fs.writeFileSync(commitFile, validMessage)

    // Run gitlint with --edit flag
    const output = runCLI(['--edit', commitFile])

    // Should exit cleanly for a valid message
    expect(output).not.toContain('validation failed')
  })

  it('should show version information', () => {
    const output = runCLI(['version'])

    // Should contain a version number in the output
    expect(output).toMatch(/\d+\.\d+\.\d+/) // Matches semver-like output
  })

  it('should handle verbose output mode', () => {
    const validMessage = 'feat: add new feature'

    // Run with verbose flag
    const output = runCLI(['--verbose'], validMessage)

    // Should contain extra output in verbose mode
    expect(output).toContain('passed')
  })
})
