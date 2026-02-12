// ===================================================
// RESPONSE TYPES
// ===================================================

export type SearchResponse<T> = {
  total_count: number
  incomplete_results: boolean
  items: T[]
}

export type GitHubLabel = {
  id: number
  name: string
  description?: string
}

export type GitHubIssue = {
  id: number
  title: string
  html_url: string
  labels: GitHubLabel[]
  created_at: string
  updated_at: string
  comments: number
  state: GitHubIssueState
  body?: string
  assignee?: GitHubAssignee
  repository_url: string
  number: number
  pull_request?: GitHubPullRequest
}

export type GithubRepository = {
  stargazers_count: number
  fill_name: string
  language: string
  description: string
}

export type IssueWithRepo = GitHubIssue & GithubRepository

export type GitHubIssueState = 'open' | 'closed'

export type GitHubAssignee = {
  login: string
}

export type GitHubPullRequest = {
  url: string
  html_url: string
  diff_url: string
  patch_url: string
}

// ===================================================
// REQUEST TYPES
// ===================================================

export type IssueSearchParams = {
  language?: string
  labels?: string[]
  state?: GitHubIssueState
  repo?: string
  org?: string
  sort?: 'created' | 'updated' | 'comments' | 'reactions'
  order?: 'asc' | 'desc'
  page?: number
  perPage?: number
  rawQuery?: string
  noAssignee?: boolean
  is?: 'issue' | 'pr'
}

export type RepoSearchParams = {
  owner: string
  repo: string
}

// ===================================================
// ERROR TYPES
// ===================================================

export type GitHubError =
  | { kind: 'rate_limit'; resetAt: Date }
  | { kind: 'validation'; message: string }
  | { kind: 'bad_auth'; message: string }
  | { kind: 'not_found'; message: string }
  | { kind: 'server_error'; message: string }
  | { kind: 'network_error'; message: string }
