import { logger, setVerbose } from '@good-first-issue/core'
import { find } from './commands/find/index.js'
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

    if (command === 'find') {
      await find(cliFlags)
    } else if (command === 'lucky') {
      // TODO: implement lucky command
    } else if (command === 'open') {
      // TODO: implement open command
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
