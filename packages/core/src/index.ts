export { GithubClient } from './github/client.js'

export { ok, err, unwrap, unwrapOr, map, flatMap, fromPromise, isOk, isErr } from './result.js'
export { setVerbose, isVerbose, logger } from './logger/index.js'

export { type Result } from './result.js'
export { type IssueSearchParams } from './github/types.js'
export { type Issue, type SearchOptions } from '@good-first-issue/types'
