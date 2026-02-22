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
- [x] Show help when invalid subcommand is given

### `find` Implementation

- [x] Accept flags: `--language`, `--limit`, `--org`, `--repo`, `--label`, `--sort`
- [x] Map CLI flags to `IssueSearchParams`
- [x] Apply default label (`good first issue`) when no `--label` is provided
- [x] Call `GithubClient.searchIssues()` with mapped params
- [x] Handle `Result` — print results on success, print error message on failure
- [x] Filter out PRs from results (add `is: 'issue'` to default params)
- [x] Surface detailed GitHub API error messages (read `errors[0].message` from response)

### Output Formatting

- [x] Design and implement human-readable issue output (box-drawn table with repo, language, stars, title, age, comments)
- [x] Add relative time formatting ("2d ago", "3w ago")
- [x] Add star count formatting (e.g., "124k")
- [x] Add result count summary line at the bottom
- [x] Fetch repo details (stars, language) via `getRepository` with parallel `Promise.all`
- [x] Handle CJK/double-width characters in table column alignment
- [x] Add ANSI color output using `node:util` styleText (no chalk)
- [x] Add `--json` flag for machine-readable output

### Help Text

- [x] Rewrite help message for `good-first-issue`
- [x] Add per-subcommand help (`good-first-issue find --help`, `explore --help`, etc.)

### Verbose Logging

- [x] Add verbose logging throughout CLI (search params, API URLs, timing, repo fetch details)
- [x] Ensure `--verbose` / `-v` surfaces useful debug info for all commands

---

## Phase 3: Smart Defaults

Make the tool intelligent with zero configuration.

### Language Auto-Detection

- [x] Detect language from current working directory
- [x] Support: `package.json` (TS/JS), `Cargo.toml` (Rust), `go.mod` (Go), `pyproject.toml`/`requirements.txt` (Python), `Gemfile` (Ruby), `pom.xml`/`build.gradle` (Java), `*.csproj` (C#), `mix.exs` (Elixir), `Package.swift` (Swift)
- [x] Fall back to all languages when no project files are found

### Default Label Expansion

- [x] Search across multiple label variations (requires multiple API calls + merge, GitHub doesn't support OR with qualifiers)
- [x] Ensure unassigned filter is applied by default (`no:assignee`)
- [x] Add `--assigned` flag to include issues that already have an assignee (overrides default `no:assignee` filter)
- [x] Add `quick-win` to default label list

### GitHub Token Support

- [x] Read `GITHUB_TOKEN` from environment
- [x] Pass token to GithubClient for higher rate limits
- [x] Show helpful message when rate limited without a token

---

## Phase 4: Quality Scoring

Rank issues by how likely they are to be a good contributor experience.

### Scoring Algorithm

`scoreIssue()` in `packages/core/src/scoring/index.ts`. Three signals, weighted to total 0–100.

#### Freshness (0–60 points) — uses `created_at` ✅

Exponential decay with a 90-day half-life. Score = 60 \* 2^(-daysOld / 90).

- [x] Exponential decay curve based on issue age
- [x] Full marks (~60) for issues under 7 days old, ~48 at 30 days, 30 at 90 days, ~4 at 1 year
- [x] Clamped to max 60 (handles future-dated edge case)
- [x] Returns rounded integer for clean display

#### Repo Engagement (0–25 points) — requires extra API calls

Measures how active the repo is, not the issue itself. A repo with recent commits means your PR will actually get reviewed.

- [ ] Fetch recent commit activity for each unique repo in results (deduplicate API calls)
- [ ] Score based on commits landed in the last 30 days
- [ ] Decide on scoring tiers (e.g., 0 commits → 0 pts, 1-5 → 10, 5-20 → 18, 20+ → 25)
- [ ] Handle API errors gracefully (default to neutral score if call fails)

#### Description Quality (0–15 points) — uses `body`

Light bonus for well-structured issues. Not a heavy signal — many great first issues have minimal descriptions.

- [ ] Base points for body length (e.g., 100+ characters)
- [ ] Bonus for markdown structure (headings, lists, checkboxes)
- [ ] Bonus for code blocks/snippets
- [ ] Bonus for links or issue references (`#123`, URLs)

#### Availability — prerequisite filter, not scored

- Not a scoring signal — handled by existing search filters (`no:assignee`, label filters)

#### Scaffolding

- [x] Create `scoreIssue()` function in `packages/core`
- [x] Create `scoreFreshness()` with exponential decay
- [ ] Create `scoreEngagement()` with repo commit activity
- [ ] Create `scoreDescription()` with body/markdown analysis
- [x] Wire scoring into CLI output (table display, sorting)

### CLI Integration

- [x] Sort by quality score by default
- [ ] Support `--sort newest` and `--sort comments` alternatives
- [ ] Show score in `--verbose` mode with per-signal breakdown
- [ ] Add `--no-score` flag to skip quality scoring and return raw results

---

## Phase 5: Additional Commands

### `lucky`

- [ ] Implement `lucky` subcommand
- [ ] Run `find` internally, return top-scored result
- [ ] Accept same filter flags as `find` (`--language`, `--org`, `--repo`)
- [ ] Print single issue with full detail

### `open`

- [x] Implement `open` subcommand
- [x] Store last search results (in-memory or temp file)
- [x] Accept a number (1-indexed) to open from last results
- [x] Open URL in default browser using platform-appropriate command (`open` on macOS, `xdg-open` on Linux)

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
- [ ] Validate `--limit` is a positive number; show clear error otherwise
- [ ] Set explicit default `--limit` to 30 (currently implicit via GitHub API default)
- [ ] Make sure that a language is set. If we fail to fetch the language repo that's a different story.

### Output Polish

- [ ] Replace GitHub issue number with result index (1, 2, 3...) to match `open` command numbering
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

- [x] `getRepository()` on GithubClient (single repo fetch)
- [ ] `searchRepositories()` on GithubClient (search endpoint)
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

### Configuration File

- [ ] Support a config file (e.g., `~/.good-first-issue/config.json`) for persistent preferences
- [ ] Allow blocklisting repos/orgs that spam low-quality issues (e.g., `exclude: ["org/repo"]`)
- [ ] Allow setting default language, labels, and other search preferences
- [ ] CLI flag to manage config (`good-first-issue config --exclude org/repo`)

### Contributor Guide (`guide` command or docs)

- [ ] Walk users through the full contribution workflow: finding an issue, commenting to claim it, forking, branching, submitting a PR, and responding to review
- [ ] Cover etiquette and best practices (e.g., ask before working on an issue, keep PRs focused, be patient with maintainers)
- [ ] Explain how to read a CONTRIBUTING.md and what to look for in a repo before contributing

### Multi-Platform

- [ ] GitLab API integration
- [ ] Gitea/Forgejo support
- [ ] Unified cross-platform search
