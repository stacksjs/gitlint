import type { CommitParsedResult, CommitReference } from './types'

/**
 * Parse a commit message according to conventional commit specification
 */
export function parseCommitMessage(message: string): CommitParsedResult {
  const lines = message.split('\n')
  const header = lines[0] || ''

  // Parse header to extract type, scope, and subject
  const headerMatch = header.replace(/['"]/g, '').match(/^(?<type>\w+)(?:\((?<scope>[^)]+)\))?: ?(?<subject>.+)$/)

  let type = null
  let scope = null
  let subject = null

  if (headerMatch?.groups) {
    type = headerMatch.groups.type || null
    scope = headerMatch.groups.scope || null
    subject = headerMatch.groups.subject ? headerMatch.groups.subject.trim() : null
  }

  // Extract body and footer
  const bodyLines: string[] = []
  const footerLines: string[] = []

  let parsingBody = true
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    // Empty line separates body and footer
    if (line.trim() === '' && parsingBody) {
      parsingBody = false
      continue
    }

    if (parsingBody) {
      bodyLines.push(line)
    }
    else {
      footerLines.push(line)
    }
  }

  const body = bodyLines.length > 0 ? bodyLines.join('\n') : null
  const footer = footerLines.length > 0 ? footerLines.join('\n') : null

  // Extract references and mentions
  const mentions: string[] = []
  const references: CommitReference[] = []

  // Find GitHub-style references like "fixes #123"
  const refRegex = /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:(?<owner>[\w-]+)\/(?<repo>[\w-]+))?#(?<issue>\d+)/gi

  // Find all references in header, body, and footer
  const fullText = message
  let refMatch = null

  // eslint-disable-next-line no-cond-assign
  while ((refMatch = refRegex.exec(fullText)) !== null) {
    const action = refMatch[0].split(/\s+/)[0].toLowerCase()
    const owner = refMatch.groups?.owner || null
    const repository = refMatch.groups?.repo || null
    const issue = refMatch.groups?.issue || ''

    references.push({
      action,
      owner,
      repository,
      issue,
      raw: refMatch[0],
      prefix: '#',
    })
  }

  // Find mentions like @username
  const mentionRegex = /@([\w-]+)/g
  let mentionMatch = null

  // eslint-disable-next-line no-cond-assign
  while ((mentionMatch = mentionRegex.exec(fullText)) !== null) {
    mentions.push(mentionMatch[1])
  }

  return {
    header,
    type,
    scope,
    subject,
    body,
    footer,
    mentions,
    references,
    raw: message,
  }
}
