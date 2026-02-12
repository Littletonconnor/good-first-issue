import {
  GithubClient,
  GitHubIssue,
  GithubRepository,
  IssueSearchParams,
  logger,
} from '@good-first-issue/core'
import { IssueWithRepo } from '../../../../core/src/github/types.js'
import { DEFAULT_LABELS } from '../../constants.js'
import { stdout } from '../../formatter.js'
import { CliFlags } from '../../parser.js'

export async function find(cliFlags: CliFlags) {
  const searchParams: IssueSearchParams = {}
  searchParams.labels = DEFAULT_LABELS
  if (cliFlags.labels) searchParams.labels = [...searchParams.labels, ...cliFlags.labels]
  if (cliFlags.language) searchParams.language = cliFlags.language
  if (cliFlags.org) searchParams.org = cliFlags.org
  if (cliFlags.repo) searchParams.repo = cliFlags.repo
  if (cliFlags.limit) searchParams.perPage = Number(cliFlags.limit)

  const client = new GithubClient({ token: process.env.GITHUB_TOKEN })
  const response = await client.getIssues(searchParams)

  if (response.ok) {
    const { items } = response.value
    const repoMap = await fetchRepoDetails(client, items)
    const issues = items.map((item) => buildIssueItem(item, repoMap))
    stdout(cliFlags, issues)
  } else {
    logger().error(response.error.kind)
  }
}

async function fetchRepoDetails(client: GithubClient, items: GitHubIssue[]) {
  const repoKeys = [...new Set(items.map(getRepoName))]

  const entries = await Promise.all(
    repoKeys.map(async (key): Promise<[string, GithubRepository] | null> => {
      const [owner, repo] = key.split('/')
      const result = await client.getRepository({ owner, repo })
      return result.ok ? [key, result.value] : null
    }),
  )

  return new Map(entries.filter((e): e is [string, GithubRepository] => e !== null))
}

function getRepoName(issue: GitHubIssue) {
  return issue.repository_url.split('/').slice(-2).join('/')
}

function buildIssueItem(issue: GitHubIssue, repoMap: Map<string, GithubRepository>): IssueWithRepo {
  const key = issue.repository_url.split('/').slice(-2).join('/')
  const repo = repoMap.get(key)

  return {
    ...issue,
    language: repo?.language ?? '-',
    stargazers_count: repo?.stargazers_count ?? 0,
    fill_name: repo?.fill_name ?? '-',
    description: repo?.description ?? '-',
  }
}
