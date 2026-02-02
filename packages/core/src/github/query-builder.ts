import { IssueSearchParams } from './types.js'

export function buildIssueQuery(params: IssueSearchParams): string {
  const parts: string[] = []

  if (params.rawQuery) return params.rawQuery
  if (params.language) parts.push(`language:${params.language}`)
  if (params.is) parts.push(`is:${params.is}`)
  if (params.noAssignee) parts.push(`no:assignee`)
  if (params.org) parts.push(`org:${params.org}`)
  if (params.repo) parts.push(`repo:${params.repo}`)
  if (params.state) parts.push(`state:${params.state}`)
  if (params.labels) {
    for (const label of params.labels) {
      parts.push(`label:"${label}"`)
    }
  }

  return parts.join(' ').trim()
}
