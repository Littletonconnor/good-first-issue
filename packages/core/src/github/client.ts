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

  constructor(config: Config = {}) {
    this.config = config
  }

  getIssues(params: IssueSearchParams): Promise<Result<SearchResponse<GitHubIssue>, GitHubError>> {
    const query = buildQuery(params)
    logger().verbose('query', `Search query: ${decodeURIComponent(query)}`)
    const endpoint = this.SEARCH_ISSUES_API + `?${query}`
    return this.fetch<SearchResponse<GitHubIssue>>(endpoint)
  }

  getRepository(params: RepoSearchParams): Promise<Result<GithubRepository, GitHubError>> {
    const endpoint = this.BASE_API + '/repos' + `/${params.owner}/${params.repo}`
    return this.fetch<GithubRepository>(endpoint)
  }

  private async fetch<T>(url: string): Promise<Result<T, GitHubError>> {
    logger().verbose('request', url)
    const start = performance.now()
    try {
      const response = await fetch(url, {
        headers: this.headers,
      })

      const elapsed = Math.round(performance.now() - start)
      logger().verbose('timing', `${elapsed}ms`)
      logger().verbose('response', `${response.status} ${response.statusText}`)

      const remaining = response.headers.get('x-ratelimit-remaining')
      const limit = response.headers.get('x-ratelimit-limit')
      if (remaining !== null && limit !== null) {
        logger().verbose('response', `Rate limit: ${remaining}/${limit} remaining`)
      }

      if (!response.ok) {
        const result = await this.errorKind(response)
        if (!result.ok) {
          logger().verbose('response', `Error: ${result.error.kind}`)
        }
        return result
      }

      const data = await response.json()
      return ok(data)
    } catch (e: unknown) {
      const elapsed = Math.round(performance.now() - start)
      logger().verbose('timing', `${elapsed}ms (failed)`)
      logger().verbose('response', `Network error: ${e instanceof Error ? e.message : String(e)}`)
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
