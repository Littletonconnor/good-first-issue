import { logger, setVerbose } from '@good-first-issue/core'
import { find } from './commands/find/index.js'
import { open } from './commands/open/index.js'
import { printHelpMessage, subcommandHelp } from './help.js'
import { cli } from './parser.js'

export async function main(): Promise<void> {
  try {
    const { values: cliFlags, positionals } = cli()
    if (cliFlags.verbose) {
      setVerbose(true)
    }

    const command = positionals[0] ?? 'find'
    logger().verbose('config', `Command: ${command}`)
    logger().verbose('config', `GitHub token: ${process.env.GITHUB_TOKEN ? 'present' : 'not set'}`)

    if (cliFlags.help) {
      const helpFn = subcommandHelp[command]
      if (helpFn && positionals.length > 0) {
        helpFn()
      } else {
        printHelpMessage()
      }
      process.exit(0)
    }

    // TODO: move to validate methods
    if (command === 'open' && !positionals[1]) {
      logger().error('Missing issue number. Usage: good-first-issue open <number>')
    }

    if (command === 'open' && Number.isNaN(Number(positionals[1]))) {
      logger().error(
        `"${positionals[1]}" is not a valid number. Usage: good-first-issue open <number>`,
      )
    }

    if (command === 'find') {
      await find(cliFlags)
    } else if (command === 'lucky') {
      // TODO: implement lucky command
    } else if (command === 'open') {
      const issue = Number(positionals[1])
      await open(issue)
    } else if (command === 'explore') {
      // TODO: implement explore command
    } else {
      printHelpMessage()
      process.exit(1)
    }
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'An unknown error occurred while executing the CLI.'
    logger().error(msg)
  }
}
