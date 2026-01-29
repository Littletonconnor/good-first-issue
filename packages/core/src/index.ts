import type { Issue, SearchOptions } from '@good-first-issue/types'

export async function searchIssues(options: SearchOptions): Promise<Issue[]> {
  console.log('Searching with options:', options)
  return []
}

export { type Issue, type SearchOptions } from '@good-first-issue/types'
