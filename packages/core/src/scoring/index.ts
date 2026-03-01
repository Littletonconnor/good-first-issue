import { IssueWithRepoMetadata } from '../github/types.js'

export function scoreIssue(issue: IssueWithRepoMetadata) {
  return scoreFreshness(issue) + scoreEngagement() + scoreQuality(issue)
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

/**
 * Scores an issue's description quality based on length and structure.
 *
 * Signals and point breakdown (max 15):
 *  - Body length (300+ chars):     5 points
 *  - Markdown structure (1 each):  4 points
 *    - Headings (##, ###, etc.)
 *    - Unordered lists (-, *)
 *    - Checkboxes (- [ ], - [x])
 *    - Numbered lists (1., 2., etc.)
 *  - Code blocks (``` fences):     3 points
 *  - References (#123, URLs):      3 points
 *
 * Returns 0 for missing or empty body.
 *
 * @returns A score between 0 and 15
 */
function scoreQuality(issue: IssueWithRepoMetadata) {
  const HEADING_REGEXP = /^#{1,6}\s/m
  const LIST_REGEXP = /^[-*]\s/m
  const CHECKBOX_REGEXP = /^- \[[ x]\]/m
  const CODE_BLOCK_REGEXP = /```/
  const LINK_REGEXP = /#\d+/
  const NUMBERED_LIST_REGEXP = /^\d+\.\s/m

  let score = 0
  const body = issue.body
  if (!body) return 0

  if (body.length >= 300) score += 5

  if (HEADING_REGEXP.test(body)) score += 1
  if (LIST_REGEXP.test(body)) score += 1
  if (CHECKBOX_REGEXP.test(body)) score += 1
  if (NUMBERED_LIST_REGEXP.test(body)) score += 1
  if (CODE_BLOCK_REGEXP.test(body)) score += 3
  if (LINK_REGEXP.test(body)) score += 3

  return Math.min(15, score)
}
