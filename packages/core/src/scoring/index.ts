import { IssueWithRepoMetadata } from '../github/types.js'

export function scoreIssue(issue: IssueWithRepoMetadata) {
  return scoreFreshness(issue) + scoreEngagement() + scoreQuality()
}

/**
 * Scores an issue's freshness based on its age using exponential decay.
 *
 * Uses a half-life of 90 days, meaning the score halves every 3 months.
 *
 * Examples:
 *  - 0 days old:   60 points (full marks)
 *  - 7 days old:   ~57 points
 *  - 30 days old:  ~48 points
 *  - 90 days old:  30 points (half-life)
 *  - 180 days old: 15 points
 *  - 365 days old: ~4 points
 *
 * @returns A score between 0 and 60
 */
function scoreFreshness(issue: IssueWithRepoMetadata) {
  const maxPoints = 60
  const halfLife = 90
  const createdAt = new Date(issue.created_at).getTime()
  const now = new Date().getTime()
  const diffMs = now - createdAt
  const daysOld = diffMs / (1000 * 60 * 60 * 24)
  const result = Math.round(maxPoints * Math.pow(2, -daysOld / halfLife))
  return Math.min(maxPoints, result)
}

function scoreEngagement() {
  return 25
}

function scoreQuality() {
  return 15
}
