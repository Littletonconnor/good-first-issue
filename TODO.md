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

## Phase 3.5: Package Restructure

Reorganize the monorepo into a cleaner package architecture before building new features. No behavior changes — just moving existing code to the right homes.

### Create `@good-first-issue/utils` package

- [x] Scaffold `packages/utils` with `package.json`, `tsconfig.json` (composite, references `types`)
- [x] Move `Result<T, E>` and all utilities (`ok`, `err`, `unwrap`, `unwrapOr`, `map`, `flatMap`, `fromPromise`, `isOk`, `isErr`) from `core/src/result.ts` → `utils/src/result.ts`
- [x] Create `utils/src/terminal.ts` — extract ANSI/color helpers (wrap `node:util` styleText) that Logger and future `ui` package will share
- [x] Move Logger from `core/src/logger/index.ts` → `utils/src/logger.ts`, update to import from `./terminal`
- [x] Move string helpers (`padEnd`, `padStart`, `truncate`, `sliceWidth`, `isWide`, `isZeroWidth`) from `cli/src/commands/utils.ts` → `utils/src/string.ts`
- [x] Move `formatStars`, `formatAge` from `cli/src/commands/find/utils.ts` → `utils/src/string.ts` (these are generic formatters, not find-specific)
- [x] Create `utils/src/index.ts` with public exports
- [x] Verify `pnpm build` passes with the new package

### Expand `@good-first-issue/types` package

- [x] Create `types/src/github/` directory
- [x] Move GitHub API response types (`GitHubIssue`, `GithubRepository`, `GitHubLabel`, `GitHubAssignee`, `GitHubPullRequest`, `SearchResponse`) from `core/src/github/types.ts` → `types/src/github/responses.ts`
- [x] Move GitHub API request types (`IssueSearchParams`, `RepoSearchParams`) from `core/src/github/types.ts` → `types/src/github/params.ts`
- [x] Move GitHub error types (`GitHubError` discriminated union) from `core/src/github/types.ts` → `types/src/github/errors.ts`
- [x] Move composed types (`IssueWithRepoMetadata`, `IssueWithMetadata`) from `core/src/github/types.ts` → `types/src/github/composed.ts`
- [x] Create `types/src/github/index.ts` barrel export
- [x] Update `types/src/index.ts` to re-export from `./github`
- [x] Delete `core/src/github/types.ts` once all consumers are updated
- [x] Verify `pnpm build` passes

### Update `@good-first-issue/core` package

- [x] Update `tsconfig.json` references to include `utils`
- [x] Update `package.json` to depend on `@good-first-issue/utils`
- [x] Update `GithubClient` imports: types from `@good-first-issue/types`, Result from `@good-first-issue/utils`
- [x] Update `query-builder.ts` imports: types from `@good-first-issue/types`
- [x] Update `scoring/index.ts` imports: types from `@good-first-issue/types`
- [x] Remove `core/src/result.ts`, `core/src/logger/`, `core/src/github/types.ts`
- [x] Update `core/src/index.ts` — re-export Result and Logger from `@good-first-issue/utils` for backwards compat (temporary, remove once CLI is updated)
- [x] Verify `pnpm build` passes

### Create `@good-first-issue/ui` package (empty shell)

- [ ] Scaffold `packages/ui` with `package.json`, `tsconfig.json` (composite, references `types` and `utils`)
- [ ] Create `ui/src/index.ts` with placeholder export (e.g., `export {}`)
- [ ] Add to root `tsconfig.json` references
- [ ] Verify `pnpm build` passes

### Update `@good-first-issue/cli` package

- [ ] Update `tsconfig.json` references to include `utils` and `ui`
- [ ] Update `package.json` to depend on `@good-first-issue/utils` and `@good-first-issue/ui`
- [ ] Update all imports in `commands/find/` — types from `@good-first-issue/types`, string helpers and logger from `@good-first-issue/utils`
- [ ] Update all imports in `commands/open/` — Result from `@good-first-issue/utils`
- [ ] Remove `cli/src/commands/utils.ts` once helpers are migrated
- [ ] Remove re-exports from `core/src/index.ts` backwards compat shim (added earlier)
- [ ] Verify `pnpm build` passes
- [ ] Verify `pnpm test` passes
- [ ] Verify `pnpm cli -- --help` works
- [ ] Verify `pnpm cli -- find --language typescript` works end-to-end

### Wrap system boundaries with Result

- [ ] Wrap `getIssue()` in `open/utils.ts` — return `Result<string, 'no-cache' | 'out-of-range'>` instead of `string | undefined`
- [ ] Wrap `saveSearchResults()` in `open/utils.ts` — return `Result<void, Error>` for fs errors
- [ ] Wrap `determineLanguage()` in `find/utils.ts` — return `Result<string, 'no-project-files'>` instead of `string | undefined`
- [ ] Update callers to handle the new Result returns

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

- [x] Base points for body length (e.g., 100+ characters)
- [x] Bonus for markdown structure (headings, lists, checkboxes)
- [x] Bonus for code blocks/snippets
- [x] Bonus for links or issue references (`#123`, URLs)
- [ ] Tier body length scoring (e.g., 100+ chars → 3 pts, 300+ chars → 5 pts) so shorter but present descriptions get partial credit

#### Availability — prerequisite filter, not scored

- Not a scoring signal — handled by existing search filters (`no:assignee`, label filters)

#### Scaffolding

- [x] Create `scoreIssue()` function in `packages/core`
- [x] Create `scoreFreshness()` with exponential decay
- [ ] Create `scoreEngagement()` with repo commit activity
- [x] Create `scoreDescription()` with body/markdown analysis
- [x] Wire scoring into CLI output (table display, sorting)

### CLI Integration

- [x] Sort by quality score by default
- [ ] Support `--sort newest` and `--sort comments` alternatives
- [ ] Show score in `--verbose` mode with per-signal breakdown
- [ ] Add `--no-score` flag to skip quality scoring and return raw results

---

## Phase 5: CLI Infrastructure

Improve the CLI's internal architecture using patterns from CAC and Clack. These changes improve the existing commands before building new ones.

### Spinner (ui package — first primitive)

- [ ] Implement `Spinner` class in `ui/src/spinner.ts` using `setInterval` + ANSI cursor control (no dependencies)
- [ ] Support `start(msg)`, `stop(msg)`, `error(msg)` methods
- [ ] Use `@good-first-issue/utils/terminal` for ANSI helpers (cursor hide/show, carriage return, line clear)
- [ ] Register signal handlers (SIGINT, SIGTERM) for clean exit — restore cursor on interrupt
- [ ] Support `.message(msg)` to update text without stopping the spinner
- [ ] Wire spinner into `find` command — show during GitHub API calls and repo detail fetches
- [ ] Wire spinner into `open` command — show while opening browser
- [ ] Export from `ui/src/index.ts`

### Command Definition Layer

- [ ] Define `CommandDef` interface in `cli/src/command.ts` — name, description, options (with types, short aliases, descriptions, defaults), action handler
- [ ] Create command registry — array of `CommandDef` objects, matched by name from first positional arg
- [ ] Refactor `find` command to export a `CommandDef` instead of a bare handler function
- [ ] Refactor `open` command to export a `CommandDef`
- [ ] Update `main()` routing — replace switch statement with registry lookup
- [ ] Default command: when no subcommand matches and no positional given, route to `find`
- [ ] Unknown command: when no subcommand matches but a positional was given, show error + suggestion

### Auto-Generated Help

- [ ] Build `generateHelp(command: CommandDef)` in `cli/src/help.ts` — assembles help text from command's option definitions
- [ ] Format options into aligned columns with name, short alias, description, and default value
- [ ] Build `generateGlobalHelp(commands: CommandDef[])` — lists all registered commands with descriptions
- [ ] Replace hand-written help strings with generated output
- [ ] Support `--help` on any command (e.g., `good-first-issue find --help` generates from `findCommand.options`)
- [ ] Delete old hand-written help content once all commands are migrated

### `CliError` Class

- [ ] Create `CliError` class in `cli/src/errors.ts` — distinguishes "bad user input" from "bug/crash"
- [ ] Use for: unknown flags, invalid `--limit` value, missing required args, unknown subcommand
- [ ] Update top-level error handler in `main()` — `CliError` gets clean message, other errors get stack trace
- [ ] Replace existing inline `console.error` + `process.exit` patterns with `throw new CliError(...)`

---

## Phase 5.5: Multi-Repo Search

Search across a specific set of repos — useful for watching projects you care about.

### `--repo` Multi-Value Support

- [ ] Extend `--repo` flag to accept multiple values (e.g., `--repo facebook/react --repo vercel/next.js`)
- [ ] Run parallel searches across all specified repos
- [ ] Merge and deduplicate results, sort by quality score
- [ ] Ensure `--repo` still works with a single value (backwards compatible)

---

## Phase 6: Additional Commands

### `lucky`

- [ ] Implement `lucky` subcommand as a `CommandDef`
- [ ] Run `find` internally, return top-scored result
- [ ] Accept same filter flags as `find` (`--language`, `--org`, `--repo`)
- [ ] Print single issue with full detail (box-drawn detailed view)
- [ ] Use spinner during search

### `open`

- [x] Implement `open` subcommand
- [x] Store last search results (in-memory or temp file)
- [x] Accept a number (1-indexed) to open from last results
- [x] Open URL in default browser using platform-appropriate command (`open` on macOS, `xdg-open` on Linux)

### `explore` (non-interactive)

- [ ] Implement `explore` subcommand as a `CommandDef`
- [ ] Implement `searchRepositories()` on GithubClient
- [ ] Filter for repos with good-first-issue labels, recent activity, CONTRIBUTING.md
- [ ] Accept `--language`, `--topic`, `--limit` flags
- [ ] Display repo-level info (name, description, stars, language, issue count)
- [ ] Use spinner during API calls

### `explore` (interactive layer)

Build interactive UI primitives just-in-time, then layer them onto `explore`.

#### State Machine (ui package)

- [ ] Implement base `Prompt` class in `ui/src/prompt.ts` with 5 states: `initial`, `active`, `cancel`, `submit`, `error`
- [ ] Rendering driven by state — `render(state)` returns a string, framework handles cursor/clearing
- [ ] Use `node:readline` for keypress events, `setRawMode(true)` for character-by-character input
- [ ] Use `@good-first-issue/utils/terminal` for ANSI cursor movement and line clearing

#### Cancel Symbol (ui package)

- [ ] Implement cancel symbol pattern in `ui/src/cancel.ts` — `CANCEL_SYMBOL` + `isCancel()` type guard
- [ ] Prompts resolve with value on submit, resolve with `CANCEL_SYMBOL` on ctrl+c/escape
- [ ] TypeScript narrows type after `isCancel()` check

#### Select Prompt (ui package)

- [ ] Implement `SelectPrompt` in `ui/src/select.ts` extending base `Prompt`
- [ ] Accept options list with `value` and `label` fields
- [ ] Keyboard navigation: arrow keys + j/k (vim bindings) for up/down
- [ ] Wrap-around cursor (top ↔ bottom)
- [ ] Skip disabled options in navigation
- [ ] Enter to submit, ctrl+c/escape to cancel
- [ ] Export `select()` styled wrapper function

#### Wire into `explore`

- [ ] After displaying repo results, prompt user to select a repo with `select()`
- [ ] On selection, fetch and display that repo's good first issues
- [ ] On cancel, exit cleanly using cancel symbol pattern
- [ ] Optional: allow drilling into a specific issue, then `open` it

### Interactive `find` (guided mode)

When `find` is run with no flags, launch an interactive guided flow. When flags are provided, run non-interactively as today.

#### Text Prompt (ui package)

- [ ] Implement `TextPrompt` in `ui/src/text.ts` extending base `Prompt`
- [ ] Support placeholder text, initial value, cursor rendering
- [ ] Validation on submit — return error string or undefined (valid)
- [ ] On error: show error message, stay active; on next keypress, clear error

#### Multi-Select Prompt (ui package)

- [ ] Implement `MultiSelectPrompt` in `ui/src/multiselect.ts` extending base `Prompt`
- [ ] Space to toggle selection, enter to submit
- [ ] Show checked/unchecked state per option
- [ ] Keyboard navigation same as select (arrows + j/k, wrap-around)

#### Group Prompts (ui package)

- [ ] Implement `group()` in `ui/src/group.ts` — runs prompts sequentially, each receives previous results
- [ ] Cancel at any step triggers `onCancel` handler
- [ ] Type inference: result type accumulates as prompts complete

#### Wire into `find`

- [ ] Detect interactive mode: no flags provided and stdout is a TTY → launch guided flow
- [ ] Step 1: Select language (auto-detect as default, or pick from list)
- [ ] Step 2: Choose search scope — text input for org, or skip for open search
- [ ] Step 3: Multi-select labels to filter (default labels pre-selected)
- [ ] Step 4: Set result limit (text input with validation: must be positive number)
- [ ] Step 5: Run search with spinner → display results table
- [ ] Step 6: Select an issue from results to open (or exit)
- [ ] Cancel at any step exits cleanly

---

## Phase 7: Polish

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

### Fluent/Chainable API

- [ ] If `@good-first-issue/core` is exposed as a library, add chainable builder API (e.g., `goodFirstIssue().language('typescript').org('vercel').search()`)
- [ ] Methods return `this` for same-object chaining, `.search()` terminates and returns `Result`

### Event-Driven Extensibility

- [ ] Add lifecycle hooks for pre/post command execution (e.g., "check for updates before running")
- [ ] Support listening for unknown commands, specific command matches
- [ ] Plugin system for extending CLI behavior without modifying core

### Frame Diffing for Complex UIs

- [ ] Implement render frame diffing in `ui` package — diff previous vs current frame, only redraw changed lines
- [ ] Needed for complex interactive UIs with multiple updating regions (e.g., split-pane issue browser)

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

### Watchlist (`watch` command)

- [ ] `good-first-issue watch` subcommand that checks a saved list of repos for new good first issues
- [ ] Store watchlist in config file (e.g., `~/.good-first-issue/watchlist.json`)
- [ ] `watch --add facebook/react` / `watch --remove facebook/react` to manage the list
- [ ] `watch --list` to show current watchlist
- [ ] Optional: track previously seen issues so it can surface only _new_ ones since last check
- [ ] Optional: daily digest mode or integration with system notifications

### Multi-Platform

- [ ] GitLab API integration
- [ ] Gitea/Forgejo support
- [ ] Unified cross-platform search
