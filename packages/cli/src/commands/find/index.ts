import { GithubClient, IssueSearchParams } from '@good-first-issue/core'
import { CliFlags } from '../../parser.js'

export async function find(cliFlags: CliFlags) {
  const searchParams: IssueSearchParams = {}
  // TODO: UPDATE to make more robust later on
  searchParams.labels = ['good first issue']
  if (cliFlags.language) searchParams.language = cliFlags.language
  if (cliFlags.org) searchParams.org = cliFlags.org
  if (cliFlags.repo) searchParams.repo = cliFlags.repo
  if (cliFlags.limit) searchParams.perPage = Number(cliFlags.limit)

  const client = new GithubClient({ token: process.env.GITHUB_TOKEN })
  const result = await client.searchIssues(searchParams)

  if (result.ok) {
    console.log(result.value)
  } else {
    console.log(result.error)
  }
}
