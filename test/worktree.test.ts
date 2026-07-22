import { afterEach, describe, expect, it } from 'bun:test'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { installGitHooks, resolveHooksDirectory, uninstallGitHooks } from '../src/hooks'
import { readCommitMessageFromFile, resolveCommitMessagePath } from '../src/utils'

const temporaryRoots: string[] = []

function git(cwd: string, ...args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

function linkedWorktree(): { repository: string, worktree: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gitlint-worktree-'))
  temporaryRoots.push(root)
  const repository = path.join(root, 'repository')
  const worktree = path.join(root, 'linked')
  fs.mkdirSync(repository)
  git(repository, 'init', '--initial-branch=main')
  git(repository, 'config', 'user.name', 'Gitlint Test')
  git(repository, 'config', 'user.email', 'gitlint@example.com')
  fs.writeFileSync(path.join(repository, 'README.md'), '# fixture\n')
  git(repository, 'add', 'README.md')
  git(repository, 'commit', '-m', 'chore: initialize fixture')
  git(repository, 'worktree', 'add', '-b', 'test-worktree', worktree)
  return { repository, worktree }
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true })
})

describe('linked worktree support', () => {
  it('resolves .git commit message paths through Git', () => {
    const { worktree } = linkedWorktree()
    expect(fs.statSync(path.join(worktree, '.git')).isFile()).toBeTrue()
    const actualPath = path.resolve(worktree, git(worktree, 'rev-parse', '--git-path', 'COMMIT_EDITMSG'))
    fs.writeFileSync(actualPath, 'feat: support linked worktrees\n')

    expect(resolveCommitMessagePath('.git/COMMIT_EDITMSG', worktree)).toBe(actualPath)
    expect(readCommitMessageFromFile('.git/COMMIT_EDITMSG', worktree)).toBe('feat: support linked worktrees\n')
  })

  it('installs and removes hooks in the effective Git hooks directory', () => {
    const { worktree } = linkedWorktree()
    const hooksDirectory = path.resolve(worktree, git(worktree, 'rev-parse', '--git-path', 'hooks'))
    const hookPath = path.join(hooksDirectory, 'commit-msg')

    expect(resolveHooksDirectory(worktree)).toBe(hooksDirectory)
    expect(installGitHooks(true, worktree)).toBeTrue()
    expect(fs.readFileSync(hookPath, 'utf8')).toContain('gitlint --edit "$1"')
    expect(uninstallGitHooks(worktree)).toBeTrue()
    expect(fs.existsSync(hookPath)).toBeFalse()
  })

  it('preserves ordinary absolute and relative paths', () => {
    const { worktree } = linkedWorktree()
    const relativePath = 'message.txt'
    const absolutePath = path.join(worktree, relativePath)
    fs.writeFileSync(absolutePath, 'fix: ordinary path\n')

    expect(resolveCommitMessagePath(relativePath, worktree)).toBe(absolutePath)
    expect(resolveCommitMessagePath(absolutePath, worktree)).toBe(absolutePath)
  })
})
