export function printHelpMessage() {
  const message = `Usage: good-first-issue [command] [options]

Find beginner-friendly open source issues to contribute to.

Commands:
  find                Search for beginner-friendly issues (default)
  explore             Discover contributor-friendly repositories
  lucky               Get one high-quality random issue
  open <n>            Open the nth result from your last search in the browser

Global Options:
  -h, --help          Show this help message
  -v, --verbose       Show detailed output and score breakdowns

Run good-first-issue <command> --help for command-specific options.

Examples:
  good-first-issue                              Search with smart defaults
  good-first-issue find --language rust         Find Rust issues
  good-first-issue find --org facebook          Search within an org
  good-first-issue lucky --language go          Random Go issue
  good-first-issue open 3                       Open 3rd result in browser
`
  console.log(message)
}

export function printFindHelp() {
  const message = `Usage: good-first-issue find [options]

Search for beginner-friendly open source issues.

Options:
  -l, --language <lang>    Filter by programming language
  -o, --org <name>         Search within a GitHub organization
  -r, --repo <owner/name>  Search a specific repository
  -s, --sort <order>       Sort: quality, newest, comments (default: quality)
      --limit <n>          Number of results (default: 10)
  -h, --help               Show this help message
  -v, --verbose            Show quality score breakdown per issue

Examples:
  good-first-issue find --language typescript
  good-first-issue find --org facebook --language javascript
  good-first-issue find --repo vercel/next.js --limit 5
  good-first-issue find --language rust --sort newest
`
  console.log(message)
}

export function printExploreHelp() {
  const message = `Usage: good-first-issue explore [options]

Discover contributor-friendly repositories.

Options:
  -l, --language <lang>    Filter by programming language
      --limit <n>          Number of results (default: 10)
  -h, --help               Show this help message

Examples:
  good-first-issue explore --language rust
  good-first-issue explore --language go --limit 20
`
  console.log(message)
}

export function printLuckyHelp() {
  const message = `Usage: good-first-issue lucky [options]

Get one high-quality random issue. Accepts the same filters as find.

Options:
  -l, --language <lang>    Filter by programming language
  -o, --org <name>         Search within a GitHub organization
  -r, --repo <owner/name>  Search a specific repository
  -h, --help               Show this help message

Examples:
  good-first-issue lucky
  good-first-issue lucky --language typescript
  good-first-issue lucky --org mozilla
`
  console.log(message)
}

export function printOpenHelp() {
  const message = `Usage: good-first-issue open <number>

Open an issue from your last search results in the browser.

Arguments:
  <number>    The result number to open (1-indexed)

Examples:
  good-first-issue open 3
  good-first-issue find --language rust && good-first-issue open 1
`
  console.log(message)
}

export const subcommandHelp: Record<string, () => void> = {
  find: printFindHelp,
  explore: printExploreHelp,
  lucky: printLuckyHelp,
  open: printOpenHelp,
}
