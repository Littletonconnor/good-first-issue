# TODO - Good First Issue

Incremental roadmap. Each phase is roughly one session of work.

---

## Phase 1: Foundation (Complete)

- [x] Initialize pnpm monorepo with TypeScript project references
- [x] Configure ESLint + Prettier
- [x] Create `packages/types` with domain types (Repository, Issue, SearchOptions)
- [x] Create `packages/core` with `Result<T, E>` type and utilities
- [x] Define GitHub API types (GitHubIssue, GitHubError discriminated union, IssueSearchParams)
- [x] Build type-safe query builder (`buildIssueQuery`, `buildQuery` with URLSearchParams)
- [x] Implement `GithubClient` class with fetch, auth headers, error mapping
- [x] Implement `searchIssues()` method on GithubClient
- [x] Set up CLI entry point with bin script and Node version check
- [x] Set up arg parsing with `node:util` parseArgs
- [x] Add `--help`, `--verbose`, `--language`, `--limit` flags
- [x] Add logger with verbose mode support

---

## Phase 2: Core CLI - `find` Command

Wire up the `find` subcommand end-to-end: parse args, call GitHub, print results.

### Subcommand Routing

- [x] Parse first positional as subcommand (`find`, `explore`, `lucky`, `open`)
- [x] Default to `find` when no subcommand is provided
- [x] Route to appropriate handler function per subcommand
- [ ] Show help when invalid subcommand is given

### `find` Implementation

- [x] Accept flags: `--language`, `--limit`, `--org`, `--repo`, `--label`, `--sort`
- [x] Map CLI flags to `IssueSearchParams`
- [x] Apply default labels when no `--label` is provided (`good first issue`, `help wanted`, `beginner`, `easy`, `starter`, `first-timers-only`, `contributions welcome`, `up-for-grabs`)
- [x] Call `GithubClient.searchIssues()` with mapped params
- [x] Handle `Result` — print results on success, print error message on failure
- [ ] Filter out PRs from results (add `is: 'issue'` to default params)
- [ ] Add `--no-score` flag to skip quality scoring and return raw results

### Output Formatting

- [ ] Design and implement human-readable issue output (repo, title, labels, comments, age, URL)
- [ ] Add ANSI color output using `node:util` styleText (no chalk)
- [ ] Add relative time formatting ("2 days ago", "3 weeks ago")
- [ ] Add star count formatting (e.g., "124k")
- [ ] Add `--json` flag for machine-readable output
- [ ] Add result count summary line at the bottom

### Help Text

- [ ] Rewrite help message for `good-first-issue` (replace placeholder curly content)
- [ ] Add per-subcommand help (`good-first-issue find --help`)

---

## Phase 3: Smart Defaults

Make the tool intelligent with zero configuration.

### Language Auto-Detection

- [ ] Detect language from current working directory
- [ ] Support: `package.json` (TS/JS), `Cargo.toml` (Rust), `go.mod` (Go), `pyproject.toml`/`requirements.txt` (Python), `Gemfile` (Ruby), `pom.xml`/`build.gradle` (Java), `*.csproj` (C#), `mix.exs` (Elixir), `Package.swift` (Swift)
- [ ] Fall back to all languages when no project files are found

### Default Label Expansion

- [ ] Search across multiple label variations in a single query
- [ ] Ensure unassigned filter is applied by default (`no:assignee`)

### GitHub Token Support

- [ ] Read `GITHUB_TOKEN` from environment
- [ ] Pass token to GithubClient for higher rate limits
- [ ] Show helpful message when rate limited without a token

---

## Phase 4: Quality Scoring

Rank issues by how likely they are to be a good contributor experience.

### Scoring Algorithm

- [ ] Create `scoreIssue()` function in `packages/core`
- [ ] Score freshness — recently created issues score higher
- [ ] Score description quality — longer, well-formatted descriptions score higher
- [ ] Score engagement — maintainer comments indicate active shepherding
- [ ] Score unassigned status — unassigned issues preferred
- [ ] Penalize staleness — issues open for 6+ months with no activity score lower
- [ ] Normalize scores to 0-100 scale

### Repo Health Signals

- [ ] Check last commit date via GitHub API
- [ ] Check for CONTRIBUTING.md presence
- [ ] Check recent release activity
- [ ] Factor repo health into issue score

### CLI Integration

- [ ] Sort by quality score by default (`--sort quality`)
- [ ] Support `--sort newest` and `--sort comments` alternatives
- [ ] Show score in `--verbose` mode with per-signal breakdown

---

## Phase 5: Additional Commands

### `lucky`

- [ ] Implement `lucky` subcommand
- [ ] Run `find` internally, return top-scored result
- [ ] Accept same filter flags as `find` (`--language`, `--org`, `--repo`)
- [ ] Print single issue with full detail

### `open`

- [ ] Implement `open` subcommand
- [ ] Store last search results (in-memory or temp file)
- [ ] Accept a number (1-indexed) to open from last results
- [ ] Open URL in default browser using platform-appropriate command (`open` on macOS, `xdg-open` on Linux)

### `explore`

- [ ] Implement `explore` subcommand
- [ ] Use `searchRepositories` on GithubClient (implement the method)
- [ ] Filter for repos with good-first-issue labels, recent activity, CONTRIBUTING.md
- [ ] Accept `--language`, `--topic`, `--limit` flags
- [ ] Display repo-level info (name, description, stars, language, issue count)

---

## Phase 6: Polish

### Error Handling & Edge Cases

- [ ] Graceful handling when no results found
- [ ] Helpful message when rate limited (suggest adding GITHUB_TOKEN)
- [ ] Handle network errors with clear messages
- [ ] Validate flag values (e.g., `--limit` must be a number)

### Output Polish

- [ ] Box drawing for detailed single-issue view (`lucky`, `open`)
- [ ] Compact vs detailed output modes
- [ ] Pagination hint ("Showing 10 of 342 results. Use --limit to see more.")

### Developer Experience

- [ ] Add `--version` flag
- [ ] Add shell completions (bash, zsh)
- [ ] Prepare for npm publishing (package.json metadata, bin config)

---

## Future Ideas

These are not prioritized. Pick them up when the core is solid.

### Caching & Performance
- [ ] File-based result caching with 5-minute TTL
- [ ] Rate limiting with exponential backoff in GithubClient

### Additional GitHub Search Methods
- [ ] `searchRepositories()` on GithubClient
- [ ] `searchCode()` on GithubClient
- [ ] `searchUsers()` on GithubClient

### Web Application
- [ ] `packages/web` with Next.js
- [ ] Search UI with filters
- [ ] Issue cards with quality indicators

### Personalization
- [ ] GitHub OAuth for personalized recommendations
- [ ] Recommendations based on starred repos and contribution history
- [ ] Save favorite projects

### Multi-Platform
- [ ] GitLab API integration
- [ ] Gitea/Forgejo support
- [ ] Unified cross-platform search
