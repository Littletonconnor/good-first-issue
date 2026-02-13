import { IssueSearchParams } from './types.js'

export function buildIssueQuery(params: IssueSearchParams) {
  const parts: string[] = []

  if (params.rawQuery) return params.rawQuery
  if (params.labels) parts.push(`label:${params.labels.map((p) => `"${p}"`).join(',')}`)
  if (params.language) parts.push(`language:${params.language}`)
  if (params.is) parts.push(`is:${params.is}`)
  if (params.noAssignee) parts.push(`no:assignee`)
  if (params.org) parts.push(`org:${params.org}`)
  if (params.repo) parts.push(`repo:${params.repo}`)
  if (params.state) parts.push(`state:${params.state}`)

  return parts.join(' ')
}

export function buildQuery(params: IssueSearchParams) {
  const urlSearchParams = new URLSearchParams()

  const q = buildIssueQuery(params)
  if (q.length) urlSearchParams.set('q', q)
  if (params.sort) urlSearchParams.set('sort', params.sort)
  if (params.order) urlSearchParams.set('order', params.order)
  if (params.perPage) urlSearchParams.set('per_page', params.perPage.toString())
  if (params.page) urlSearchParams.set('page', params.page.toString())

  return urlSearchParams.toString()
}
