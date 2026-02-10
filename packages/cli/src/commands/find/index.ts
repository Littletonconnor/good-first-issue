import { GithubClient, GitHubIssue, IssueSearchParams, logger } from '@good-first-issue/core'
import { formatTable } from '../../formatter.js'
import { CliFlags } from '../../parser.js'

const defaultLabels = [
  'good first issue',
  'help wanted',
  'beginner',
  'easy',
  'starter',
  'first-timers-only',
  'contributions welcome',
  'up-for-grabs',
]

export async function find(cliFlags: CliFlags) {
  const searchParams: IssueSearchParams = {}
  searchParams.labels = defaultLabels
  if (cliFlags.labels) {
    searchParams.labels = [...searchParams.labels, ...cliFlags.labels]
  }
  if (cliFlags.language) searchParams.language = cliFlags.language
  if (cliFlags.org) searchParams.org = cliFlags.org
  if (cliFlags.repo) searchParams.repo = cliFlags.repo
  if (cliFlags.limit) searchParams.perPage = Number(cliFlags.limit)

  const client = new GithubClient({ token: process.env.GITHUB_TOKEN })
  const response = await client.getIssues(searchParams)

  if (response.ok) {
    const repoMap = await fetchRepoDetails(client, response.value.items)
    console.log(formatTable(response.value.items, repoMap))
  } else {
    logger().error(response.error.kind)
  }
}

async function fetchRepoDetails(client: GithubClient, items: GitHubIssue[]) {
  const repoKeys = new Set(items.map(getRepoName))
  const repoResults = await Promise.all(
    [...repoKeys].map((key) => {
      const [owner, repo] = key.split('/')
      return client.getRepository({ owner, repo })
    }),
  )

  const repoMap = new Map()
  const keys = [...repoKeys]
  for (let i = 0; i < keys.length; i++) {
    const res = repoResults[i]
    if (res.ok) {
      repoMap.set(keys[i], res.value)
    }
  }

  return repoMap
}

function getRepoName(issue: GitHubIssue) {
  return issue.repository_url.split('/').slice(-2).join('/')
}
