import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/** Resolve a path below `.git` through Git so linked worktrees are supported. */
export function resolveCommitMessagePath(filePath: string, cwd: string = process.cwd()): string {
  const absolutePath = path.resolve(cwd, filePath)
  const relativePath = path.relative(cwd, absolutePath).split(path.sep).join('/')
  if (relativePath !== '.git' && !relativePath.startsWith('.git/')) return absolutePath

  const gitPath = relativePath === '.git' ? '' : relativePath.slice('.git/'.length)
  if (!gitPath) return absolutePath

  try {
    const resolved = execFileSync('git', ['rev-parse', '--git-path', gitPath], {
      cwd,
      encoding: 'utf8',
    }).trim()
    return path.resolve(cwd, resolved)
  }
  catch {
    return absolutePath
  }
}

/**
 * Read the commit message from a file
 */
export function readCommitMessageFromFile(filePath: string, cwd: string = process.cwd()): string {
  try {
    return fs.readFileSync(resolveCommitMessagePath(filePath, cwd), 'utf8')
  }
  catch (error: unknown) {
    console.error(`Error reading commit message file: ${filePath}`)
    console.error(error)
    process.exit(1)
  }
}
