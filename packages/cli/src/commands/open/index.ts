import { logger } from '@good-first-issue/core'
import fs from 'fs/promises'
import { execFile } from 'node:child_process'
import { getIssue, getSearchResultsFilepath } from './utils.js'

export async function open(issue: number) {
  logger().verbose('config', `Calling good-first-issue open with #${issue}`)

  const filepath = getSearchResultsFilepath()

  try {
    const rawContent = await fs.readFile(filepath, 'utf-8')
    const content = JSON.parse(rawContent)
    logger().verbose('config', `Parsed content ${JSON.stringify(content)}`)
    const url = getIssue(content, issue)
    execFile('open', [url])
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error reading: ${filepath}`
    logger().error(errorMessage)
  }
}
