import { logger } from '@good-first-issue/core'
import fs from 'fs/promises'
import { execFile } from 'node:child_process'
import { getIssue, getSearchResultsFilepath } from './utils.js'

export async function open(issue: number) {
  const filepath = getSearchResultsFilepath()
  logger().verbose('config', `Opening issue #${issue} from ${filepath}`)

  try {
    const rawContent = await fs.readFile(filepath, 'utf-8')
    const content = JSON.parse(rawContent)
    logger().verbose('response', `Loaded ${Array.isArray(content) ? content.length : 0} cached results`)
    const url = getIssue(content, issue)
    logger().verbose('request', `Opening ${url}`)
    execFile('open', [url])
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      logger().error('Search results file is corrupted. Run a search first with: good-first-issue find')
    }
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      logger().error('No search results found. Run a search first with: good-first-issue find')
    }
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    logger().error(errorMessage)
  }
}
