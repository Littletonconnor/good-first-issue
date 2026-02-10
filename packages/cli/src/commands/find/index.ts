import { GithubClient, IssueSearchParams } from '@good-first-issue/core'
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
  console.log('searchParams', searchParams)
  const result = await client.searchIssues(searchParams)

  if (result.ok) {
    console.log(result.value)
  } else {
    console.log(result.error)
  }
}
