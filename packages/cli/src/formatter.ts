import { GitHubIssue, GithubRepository } from '@good-first-issue/core'

const COL = {
  issue: 6,
  repo: 30,
  language: 12,
  stars: 6,
  title: 40,
  age: 7,
  comments: 8,
}

export function formatTable(issues: GitHubIssue[], repoMap: Map<string, GithubRepository>): string {
  const rows = issues.map((issue) => {
    const key = issue.repository_url.split('/').slice(-2).join('/')
    return formatIssueRow(issue, repoMap.get(key))
  })

  return [
    topBorder(),
    headerRow(),
    separator(),
    ...rows,
    bottomBorder(),
    '',
    `Showing ${issues.length} issues. Run good-first-issue open <n> to open in browser.`,
  ].join('\n')
}

function formatIssueRow(issue: GitHubIssue, repo?: GithubRepository): string {
  const repoName = issue.repository_url.split('/').slice(-2).join('/')
  return row([
    padEnd(truncate(repoName, COL.repo), COL.repo),
    padEnd(sliceWidth(repo?.language ?? '-', COL.language), COL.language),
    padStart(formatStars(repo?.stargazers_count ?? 0), COL.stars),
    padStart(`#${issue.number}`, COL.issue),
    padEnd(truncate(issue.title, COL.title), COL.title),
    padStart(formatAge(issue.created_at), COL.age),
    padStart(String(issue.comments), COL.comments),
  ])
}

function headerRow(): string {
  return row([
    padEnd('Repo', COL.repo),
    padEnd('Language', COL.language),
    padStart('Stars', COL.stars),
    padStart('#', COL.issue),
    padEnd('Title', COL.title),
    padStart('Age', COL.age),
    padStart('Comments', COL.comments),
  ])
}

function row(cells: string[]): string {
  return '│ ' + cells.join(' │ ') + ' │'
}

function topBorder(): string {
  return (
    '┌' +
    colWidths()
      .map((w) => '─'.repeat(w + 2))
      .join('┬') +
    '┐'
  )
}

function separator(): string {
  return (
    '├' +
    colWidths()
      .map((w) => '─'.repeat(w + 2))
      .join('┼') +
    '┤'
  )
}

function bottomBorder(): string {
  return (
    '└' +
    colWidths()
      .map((w) => '─'.repeat(w + 2))
      .join('┴') +
    '┘'
  )
}

function colWidths(): number[] {
  return [COL.repo, COL.language, COL.stars, COL.issue, COL.title, COL.age, COL.comments]
}

function isWide(code: number): boolean {
  return (
    (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
    (code >= 0x2e80 && code <= 0x303e) || // CJK Radicals, Kangxi, Ideographic
    (code >= 0x3040 && code <= 0x33bf) || // Hiragana, Katakana, CJK Compatibility
    (code >= 0x3400 && code <= 0x4dbf) || // CJK Unified Extension A
    (code >= 0x4e00 && code <= 0xa4cf) || // CJK Unified, Yi
    (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xfe30 && code <= 0xfe6f) || // CJK Compatibility Forms
    (code >= 0xff01 && code <= 0xff60) || // Fullwidth Forms
    (code >= 0xffe0 && code <= 0xffe6) || // Fullwidth Signs
    (code >= 0x20000 && code <= 0x2fffd) || // CJK Extension B+
    (code >= 0x30000 && code <= 0x3fffd) || // CJK Extension G+
    (code >= 0x1f300 && code <= 0x1f9ff) || // Misc Symbols, Emoticons, Dingbats, Supplemental Symbols
    (code >= 0x1fa00 && code <= 0x1fa6f) || // Chess Symbols, Extended-A
    (code >= 0x1fa70 && code <= 0x1faff) || // Symbols and Pictographs Extended-A
    (code >= 0x2600 && code <= 0x27bf) || // Misc Symbols, Dingbats
    (code >= 0x231a && code <= 0x23f3) // Misc Technical (hourglass, watch, etc.)
  )
}

function displayWidth(str: string): number {
  let width = 0
  for (const char of str) {
    width += isWide(char.codePointAt(0)!) ? 2 : 1
  }
  return width
}

function padEnd(str: string, width: number): string {
  const diff = width - displayWidth(str)
  return diff > 0 ? str + ' '.repeat(diff) : str
}

function padStart(str: string, width: number): string {
  const diff = width - displayWidth(str)
  return diff > 0 ? ' '.repeat(diff) + str : str
}

function sliceWidth(str: string, maxWidth: number): string {
  let width = 0
  let i = 0
  for (const char of str) {
    const w = isWide(char.codePointAt(0)!) ? 2 : 1
    if (width + w > maxWidth) break
    width += w
    i += char.length
  }
  return str.slice(0, i)
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(count >= 10000 ? 0 : 1) + 'k'
  }
  return count.toString()
}

function formatAge(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago'
  if (seconds < 2592000) return Math.floor(seconds / 604800) + 'w ago'
  if (seconds < 31536000) return Math.floor(seconds / 2592000) + 'mo ago'
  return Math.floor(seconds / 31536000) + 'y ago'
}

function truncate(str: string, maxWidth: number): string {
  if (displayWidth(str) <= maxWidth) return str
  const truncated = sliceWidth(str, maxWidth - 3)
  return truncated + '...'
}
