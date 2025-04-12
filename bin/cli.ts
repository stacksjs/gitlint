import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { CAC } from 'cac'
import { version } from '../package.json'
import { defaultConfig } from '../src/config'

const cli = new CAC('gitlint')

// Helper function to read commit message from file
function readCommitMessageFromFile(filePath: string): string {
  try {
    return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8')
  }
  catch (error: unknown) {
    console.error(`Error reading commit message file: ${filePath}`)
    console.error(error)
    process.exit(1)
    return '' // Unreachable but needed for TypeScript
  }
}

// Main lint command
cli
  .command('[...files]', 'Lint commit message')
  .option('--edit <file>', 'Path to .git/COMMIT_EDITMSG file')
  .option('--verbose', 'Enable verbose output', { default: defaultConfig.verbose })
  .option('--config <file>', 'Path to config file')
  .action(async (files: string[], options) => {
    let commitMessage = ''

    // Get commit message from file if --edit flag is used
    if (options.edit) {
      commitMessage = readCommitMessageFromFile(options.edit)
    }
    // Or from files passed as arguments
    else if (files.length > 0) {
      commitMessage = readCommitMessageFromFile(files[0])
    }
    // Or from stdin if piped
    else if (!process.stdin.isTTY) {
      const chunks: Buffer[] = []
      for await (const chunk of process.stdin)
        chunks.push(Buffer.from(chunk))
      commitMessage = Buffer.concat(chunks).toString('utf8')
    }
    else {
      cli.outputHelp()
      process.exit(1)
    }

    try {
      // Import rules dynamically
      const { lintCommitMessage } = await import('../src')
      const result = lintCommitMessage(commitMessage, options.verbose)

      if (!result.valid) {
        console.error('Commit message validation failed:')
        result.errors.forEach((error: string) => {
          console.error(`- ${error}`)
        })
        process.exit(1)
      }

      if (options.verbose) {
        console.log('Commit message validation passed! ✅')
      }
    }
    catch (error: unknown) {
      console.error('Error during commit message linting:')
      console.error(error)
      process.exit(1)
    }

    process.exit(0)
  })

// Install git hooks command
cli
  .command('hooks', 'Manage git hooks')
  .option('--install', 'Install git hooks')
  .option('--uninstall', 'Uninstall git hooks')
  .option('--force', 'Force overwrite existing hooks')
  .action(async (options) => {
    try {
      const { installGitHooks, uninstallGitHooks } = await import('../src')

      if (options.install) {
        const success = installGitHooks(options.force)
        process.exit(success ? 0 : 1)
      }
      else if (options.uninstall) {
        const success = uninstallGitHooks()
        process.exit(success ? 0 : 1)
      }
      else {
        console.error('Please specify --install or --uninstall')
        process.exit(1)
      }
    }
    catch (error: unknown) {
      console.error('Error managing git hooks:')
      console.error(error)
      process.exit(1)
    }
  })

// Version command
cli.command('version', 'Show the version of gitlint').action(() => {
  console.log(version)
})

// Set up help and version
cli.help()
cli.version(version)

// Parse CLI args
cli.parse()
