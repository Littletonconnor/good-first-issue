import { GithubClient, IssueSearchParams, logger } from '@good-first-issue/core'
import { CliFlags } from '../../parser.js'
import { stdout } from './formatter.js'
import { buildIssueItem, determineLabels, determineLanguage, fetchRepoDetails } from './utils.js'

export async function find(cliFlags: CliFlags) {
  const searchParams: IssueSearchParams = {}

  searchParams.language = determineLanguage(cliFlags)
  searchParams.labels = determineLabels(cliFlags)
  if (cliFlags.org) searchParams.org = cliFlags.org
  if (cliFlags.repo) searchParams.repo = cliFlags.repo
  if (cliFlags.limit) searchParams.perPage = Number(cliFlags.limit)

  logger().verbose('config', `Search params: ${JSON.stringify(searchParams)}`)

  const client = new GithubClient({ token: process.env.GITHUB_TOKEN })
  const response = await client.getIssues(searchParams)

  if (response.ok) {
    const { items, total_count, incomplete_results } = response.value
    logger().verbose('response', `Found ${total_count} total issues (fetched ${items.length})`)
    if (incomplete_results) {
      logger().verbose('response', 'Results may be incomplete (GitHub timed out)')
    }

    const repoMap = await fetchRepoDetails(client, items)
    const issues = items.map((item) => buildIssueItem(item, repoMap))

    logger().verbose(
      'output',
      `Outputting ${issues.length} issues as ${cliFlags.json ? 'json' : 'table'}`,
    )
    stdout(cliFlags, issues)
  } else {
    logger().error(response.error.kind)
  }
}
