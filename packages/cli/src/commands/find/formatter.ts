import { styleText } from 'node:util'
import { CliFlags } from '../../parser.js'
import { IssueWithRepo } from '@good-first-issue/core'
import { COL_WIDTH } from './constants.js'
import { padEnd, padStart, truncate } from '../utils.js'
import { ageColor, formatAge, formatStars, sliceWidth } from './utils.js'

export function stdout(cliFlags: CliFlags, issues: IssueWithRepo[]) {
  if (cliFlags.json) {
    return console.log(JSON.stringify(issues, null, 2))
  } else {
    console.log(formatTable(issues))
  }
}

export function formatTable(issues: IssueWithRepo[]) {
  const rows = issues.map((issue, i) => formatIssueRow(issue, i + 1))

  const disclosure = styleText(
    'dim',
    `Showing ${issues.length} issues. Run good-first-issue open <n> to open in browser.`,
  )

  return [topBorder(), headerRow(), separator(), ...rows, bottomBorder(), '', disclosure].join('\n')
}

function formatIssueRow(issue: IssueWithRepo, index: number) {
  const repoName = issue.repository_url.split('/').slice(-2).join('/')
  return row([
    styleText('cyan', padEnd(truncate(repoName, COL_WIDTH.repo), COL_WIDTH.repo)),
    styleText(
      'dim',
      padEnd(sliceWidth(issue?.language ?? '-', COL_WIDTH.language), COL_WIDTH.language),
    ),
    padStart(formatStars(issue?.stargazers_count ?? 0), COL_WIDTH.stars),
    styleText('dim', padStart(`#${index}`, COL_WIDTH.issue)),
    padEnd(truncate(issue.title, COL_WIDTH.title), COL_WIDTH.title),
    ageColor(issue.created_at, padStart(formatAge(issue.created_at), COL_WIDTH.age)),
    padStart(String(issue.comments), COL_WIDTH.comments),
  ])
}

function headerRow(): string {
  return row([
    styleText('bold', padEnd('Repo', COL_WIDTH.repo)),
    styleText('bold', padEnd('Language', COL_WIDTH.language)),
    styleText('bold', padStart('Stars', COL_WIDTH.stars)),
    styleText('bold', padStart('#', COL_WIDTH.issue)),
    styleText('bold', padEnd('Title', COL_WIDTH.title)),
    styleText('bold', padStart('Age', COL_WIDTH.age)),
    styleText('bold', padStart('Comments', COL_WIDTH.comments)),
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
  return [
    COL_WIDTH.repo,
    COL_WIDTH.language,
    COL_WIDTH.stars,
    COL_WIDTH.issue,
    COL_WIDTH.title,
    COL_WIDTH.age,
    COL_WIDTH.comments,
  ]
}
