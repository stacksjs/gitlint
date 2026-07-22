import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Find the Git repository root directory
 */
function findGitRoot(cwd: string): string | null {
  try {
    const gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' }).trim()
    return gitRoot
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_error) {
    return null
  }
}

/** Resolve the effective hooks directory for main checkouts and linked worktrees. */
export function resolveHooksDirectory(cwd: string = process.cwd()): string | null {
  try {
    const hooksPath = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], {
      cwd,
      encoding: 'utf8',
    }).trim()
    return path.resolve(cwd, hooksPath)
  }
  catch {
    return null
  }
}

/**
 * Install Git hooks for the current repository
 */
export function installGitHooks(force = false, cwd: string = process.cwd()): boolean {
  const gitRoot = findGitRoot(cwd)
  if (!gitRoot) {
    console.error('Not a git repository')
    return false
  }

  const hooksDir = resolveHooksDirectory(cwd)
  if (!hooksDir || !fs.existsSync(hooksDir)) {
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
export function uninstallGitHooks(cwd: string = process.cwd()): boolean {
  const gitRoot = findGitRoot(cwd)
  if (!gitRoot) {
    console.error('Not a git repository')
    return false
  }

  const hooksDir = resolveHooksDirectory(cwd)
  if (!hooksDir) {
    console.error('Git hooks directory could not be resolved')
    return false
  }
  const commitMsgHookPath = path.join(hooksDir, 'commit-msg')
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
