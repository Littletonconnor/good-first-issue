import { logger } from '../logger/index.js'
import { err, ok, Result } from '../result.js'
import { buildQuery } from './query-builder.js'
import {
  GitHubError,
  GitHubIssue,
  GithubRepository,
  IssueSearchParams,
  RepoSearchParams,
  SearchResponse,
} from './types.js'

type Config = {
  token?: string
}

export class GithubClient {
  private config: Config

  private BASE_API = 'https://api.github.com'
  private SEARCH_ISSUES_API = this.BASE_API + '/search/issues'
  private SEARCH_REPOSITORIES_API = this.BASE_API + '/search/repositories'
  private SEARCH_CODE_API = this.BASE_API + '/search/code'

  constructor(config: Config = {}) {
    this.config = config
  }

  searchIssues(
    params: IssueSearchParams,
  ): Promise<Result<SearchResponse<GitHubIssue>, GitHubError>> {
    const query = buildQuery(params)
    const endpoint = this.SEARCH_ISSUES_API + `?${query}`
    return this.fetch<SearchResponse<GitHubIssue>>(endpoint)
  }

  searchRepositories(
    params: RepoSearchParams,
  ): Promise<Result<SearchResponse<GithubRepository>, GitHubError>> {
    const endpoint = this.BASE_API + '/repos' + `/${params.owner}/${params.repo}`
    return this.fetch<SearchResponse<GithubRepository>>(endpoint)
  }

  private async fetch<T>(url: string): Promise<Result<T, GitHubError>> {
    logger().verbose('request', url)
    try {
      const response = await fetch(url, {
        headers: this.headers,
      })

      if (!response.ok) {
        return await this.errorKind(response)
      }

      const data = await response.json()
      return ok(data)
    } catch (e: unknown) {
      return err({ kind: 'network_error', message: e instanceof Error ? e.message : String(e) })
    }
  }

  private get headers() {
    return {
      Accept: 'application/vnd.github.v3+json',
      ...(this.config.token && { Authorization: `Bearer ${this.config.token}` }),
    }
  }

  private async errorKind(response: Response): Promise<Result<never, GitHubError>> {
    const body = await response.json().catch(() => null)
    const detail = body?.errors?.[0]?.message
    const message = detail ?? body?.message ?? `HTTP ${response.status}`

    if (response.status === 401) {
      return err({ kind: 'bad_auth', message })
    } else if (response.status === 403) {
      const remaining = response.headers.get('x-ratelimit-remaining')
      if (remaining === '0') {
        const reset = response.headers.get('x-ratelimit-reset')
        return err({ kind: 'rate_limit', resetAt: new Date(Number(reset) * 1000) })
      }
      return err({ kind: 'bad_auth', message })
    } else if (response.status === 404) {
      return err({ kind: 'not_found', message })
    } else if (response.status === 422) {
      return err({ kind: 'validation', message })
    } else if (response.status >= 500) {
      return err({ kind: 'server_error', message })
    } else {
      return err({ kind: 'network_error', message })
    }
  }
}
