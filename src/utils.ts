import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Read the commit message from a file
 */
export function readCommitMessageFromFile(filePath: string): string {
  try {
    return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8')
  }
  catch (error: unknown) {
    console.error(`Error reading commit message file: ${filePath}`)
    console.error(error)
    process.exit(1)
  }
}
