import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Find the Git repository root directory
 */
function findGitRoot(): string | null {
  try {
    const gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()
    return gitRoot
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_error) {
    return null
  }
}

/**
 * Install Git hooks for the current repository
 */
export function installGitHooks(force = false): boolean {
  const gitRoot = findGitRoot()
  if (!gitRoot) {
    console.error('Not a git repository')
    return false
  }

  const hooksDir = path.join(gitRoot, '.git', 'hooks')
  if (!fs.existsSync(hooksDir)) {
    console.error(`Git hooks directory not found: ${hooksDir}`)
    return false
  }

  const commitMsgHookPath = path.join(hooksDir, 'commit-msg')
  const hookExists = fs.existsSync(commitMsgHookPath)

  if (hookExists && !force) {
    console.error('commit-msg hook already exists. Use --force to overwrite.')
    return false
  }

  try {
    // Create commit-msg hook
    const hookContent = `#!/bin/sh
# GitLint commit-msg hook
# Installed by GitLint (https://github.com/stacksjs/gitlint)

gitlint --edit "$1"
`

    fs.writeFileSync(commitMsgHookPath, hookContent, { mode: 0o755 })
    console.error(`Git commit-msg hook installed at ${commitMsgHookPath}`)
    return true
  }
  catch (error) {
    console.error('Failed to install Git hooks:')
    console.error(error)
    return false
  }
}

/**
 * Uninstall Git hooks for the current repository
 */
export function uninstallGitHooks(): boolean {
  const gitRoot = findGitRoot()
  if (!gitRoot) {
    console.error('Not a git repository')
    return false
  }

  const commitMsgHookPath = path.join(gitRoot, '.git', 'hooks', 'commit-msg')
  if (!fs.existsSync(commitMsgHookPath)) {
    console.error('No commit-msg hook found')
    return true
  }

  try {
    // Read the hook to check if it was installed by GitLint
    const hookContent = fs.readFileSync(commitMsgHookPath, 'utf8')
    if (!hookContent.includes('GitLint commit-msg hook')) {
      console.error('The commit-msg hook was not installed by GitLint. Not removing.')
      return false
    }

    fs.unlinkSync(commitMsgHookPath)
    console.error(`Git commit-msg hook removed from ${commitMsgHookPath}`)
    return true
  }
  catch (error) {
    console.error('Failed to uninstall Git hooks:')
    console.error(error)
    return false
  }
}
