import { err, ok, Result } from '../result.js'
import { GitHubError } from './types.js'

type Config = {
  token?: string
}

export class GithubClient {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  private async fetch<T>(url: string): Promise<Result<T, GitHubError>> {
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
    const message = body?.message ?? `HTTP ${response.status}`

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
