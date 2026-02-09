import { logger, setVerbose } from '@good-first-issue/core'
import { cli } from './parser.js'
import { printHelpMessage } from './help.js'
import { find } from './commands/find/index.js'

export async function main(): Promise<void> {
  try {
    const { values: cliFlags, positionals } = cli()
    if (cliFlags.verbose) {
      setVerbose(true)
    }

    if (cliFlags.help) {
      printHelpMessage()
      process.exit(0)
    }

    const command = positionals[0] ?? 'find'
    if (command === 'find') {
      await find(cliFlags)
      // Do something
    } else if (command === 'lucky') {
      // Do something
    } else if (command === 'open') {
      // Do something
    } else {
      logger().error('Subcommand not found. ')
    }
  } catch (error) {
    logger().error(
      error instanceof Error ? error.message : 'An unknown error occurred while executing the CLI.',
    )
  }
}
