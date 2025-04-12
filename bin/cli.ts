import { Buffer } from 'node:buffer'
import process from 'node:process'
import { CAC } from 'cac'
import { version } from '../package.json'
import { defaultConfig } from '../src/config'
import { readCommitMessageFromFile } from '../src/utils'

const cli = new CAC('gitlint')

// Main lint command
cli
  .command('[...files]', 'Lint commit message')
  .example('gitlint')
  .example('gitlint .git/COMMIT_EDITMSG')
  .example('git log -1 --pretty=%B | gitlint')
  .option('--verbose', 'Enable verbose output', { default: defaultConfig.verbose })
  .option('--config <file>', 'Path to config file')
  .action(async (files: string[], options) => {
    let commitMessage = ''

    // Get commit message from files passed as arguments
    if (files.length > 0) {
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
  .example('gitlint hooks --install')
  .example('gitlint hooks --install --force')
  .example('gitlint hooks --uninstall')
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
cli.command('version', 'Show the version of gitlint')
  .example('gitlint version')
  .action(() => {
    console.log(version)
  })

// Set up help and version
cli.help()
cli.version(version)

// Parse CLI args
cli.parse()
