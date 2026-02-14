import { IssueWithRepo, logger } from '@good-first-issue/core'
import fs from 'fs/promises'
import os from 'node:os'

export function getSearchResultsFilepath() {
  const tmpDir = os.tmpdir()
  const file = 'good-first-issues-results.json'
  return `${tmpDir}/${file}`
}

export function getIssue(content: unknown, issue: number) {
  if (!Array.isArray(content)) {
    throw new Error(
      'Search results file is corrupted. Run a search first with: good-first-issue find',
    )
  } else if (issue <= 0) {
    throw new Error(
      `Invalid issue number: ${issue}. Must be a positive number (e.g., good-first-issue open 1)`,
    )
  } else if (issue > content.length) {
    throw new Error(
      `Issue #${issue} is out of range. Your last search returned ${content.length} result${content.length === 1 ? '' : 's'} (1-${content.length})`,
    )
  }

  return content[issue - 1]
}

export async function saveSearchResults(issues: IssueWithRepo[]) {
  const urls = issues.map((i) => i.html_url)
  const filepath = getSearchResultsFilepath()

  try {
    logger().verbose('config', `writing to ${filepath}`)
    await fs.writeFile(filepath, JSON.stringify(urls))
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    logger().error(`Error writing search results: ${errorMessage}`)
  }
}
