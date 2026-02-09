# good-first-issue

A smart CLI that helps you find high-quality open source issues to contribute to. It goes beyond simple search — it uses heuristics to surface issues that are actually worth your time: active maintainers, clear descriptions, responsive repos.

```bash
$ good-first-issue find

  TypeScript · vercel/next.js · ⭐ 124k
  Fix hydration warning for client components
  Labels: good first issue, bug
  3 comments · Created 2 days ago
  https://github.com/vercel/next.js/issues/12345

  Rust · astral-sh/ruff · ⭐ 35k
  Add lint rule for unused format arguments
  Labels: good first issue, help wanted
  1 comment · Created 5 days ago
  https://github.com/astral-sh/ruff/issues/6789

  10 issues found · Sorted by quality score
```

## Install

```bash
npm install -g good-first-issue
```

Requires Node.js 24+.

## Quick Start

```bash
# Run in any project directory — auto-detects language from package.json, Cargo.toml, go.mod, etc.
good-first-issue find

# Specify a language
good-first-issue find --language rust

# Search a specific org
good-first-issue find --org facebook

# Search a specific repo
good-first-issue find --repo vercel/next.js

# Feeling lucky — one high-quality random pick
good-first-issue lucky
```

## Commands

### `find`

The main command. Searches for beginner-friendly issues with smart defaults and quality scoring.

```bash
good-first-issue find [options]
```

Running `good-first-issue` with no subcommand defaults to `find`.

| Flag         | Short | Description                                 | Default                |
| ------------ | ----- | ------------------------------------------- | ---------------------- |
| `--language` | `-l`  | Filter by programming language              | Auto-detected from cwd |
| `--limit`    | `-n`  | Number of results                           | `10`                   |
| `--org`      | `-o`  | Search within a GitHub organization         | —                      |
| `--repo`     | `-r`  | Search a specific repo (`owner/name`)       | —                      |
| `--label`    |       | Custom label to search (overrides defaults) | See Smart Defaults     |
| `--sort`     | `-s`  | Sort order: `quality`, `newest`, `comments` | `quality`              |
| `--json`     |       | Output as JSON for scripting                | `false`                |
| `--no-score` |       | Skip quality heuristics, return raw results | `false`                |
| `--verbose`  | `-v`  | Show quality score breakdown per issue      | `false`                |

**Examples:**

```bash
# Top 5 TypeScript issues sorted by newest
good-first-issue find --language typescript --limit 5 --sort newest

# All good first issues in the React org
good-first-issue find --org facebook --language javascript

# Issues with a custom label
good-first-issue find --label "help wanted" --language go

# Raw GitHub results, no scoring
good-first-issue find --language python --no-score

# JSON output for piping
good-first-issue find --language rust --json | jq '.[0].url'
```

### `explore`

Discover contributor-friendly repositories. Unlike `find` (which returns issues), `explore` helps you find well-maintained projects that are good for new contributors.

```bash
good-first-issue explore [options]
```

| Flag         | Short | Description                    | Default       |
| ------------ | ----- | ------------------------------ | ------------- |
| `--language` | `-l`  | Filter by programming language | Auto-detected |
| `--limit`    | `-n`  | Number of results              | `10`          |
| `--topic`    | `-t`  | Filter by GitHub topic         | —             |

**Examples:**

```bash
# Find contributor-friendly Rust projects
good-first-issue explore --language rust

# Explore CLI tools looking for contributors
good-first-issue explore --topic cli

# Find well-maintained Go projects
good-first-issue explore --language go --limit 20
```

### `lucky`

Feeling lucky. Returns one high-quality issue picked by the scoring algorithm. Great for when you just want to jump in.

```bash
good-first-issue lucky [options]
```

Accepts the same filter flags as `find` (`--language`, `--org`, `--repo`).

**Examples:**

```bash
# Random quality issue in any language
good-first-issue lucky

# Random TypeScript issue
good-first-issue lucky --language typescript

# Random issue from a specific org
good-first-issue lucky --org mozilla
```

### `open`

Open an issue from your last search results in your browser.

```bash
good-first-issue open <number>
```

**Examples:**

```bash
# Open the 3rd result from your last search
good-first-issue open 3

# Find and immediately open
good-first-issue find --language rust && good-first-issue open 1
```

## Smart Defaults

The CLI is designed to do the right thing with zero configuration.

### Language Auto-Detection

When no `--language` flag is provided, the tool detects your language from the current directory:

| File                                  | Detected Language       |
| ------------------------------------- | ----------------------- |
| `package.json`                        | TypeScript / JavaScript |
| `Cargo.toml`                          | Rust                    |
| `go.mod`                              | Go                      |
| `requirements.txt` / `pyproject.toml` | Python                  |
| `Gemfile`                             | Ruby                    |
| `pom.xml` / `build.gradle`            | Java                    |
| `*.csproj` / `*.sln`                  | C#                      |
| `mix.exs`                             | Elixir                  |
| `Package.swift`                       | Swift                   |

If no project files are found, results are returned across all languages.

### Default Labels

By default, the tool searches across all common beginner-friendly labels:

- `good first issue`
- `good-first-issue`
- `help wanted`
- `beginner`
- `easy`
- `starter`
- `first-timers-only`
- `contributions welcome`
- `up-for-grabs`

Use `--label` to override this with a specific label.

### Quality Scoring

Every issue is scored based on signals that predict a good contributor experience:

| Signal                  | What it measures                                                         |
| ----------------------- | ------------------------------------------------------------------------ |
| **Freshness**           | Recently created issues score higher — stale issues are deprioritized    |
| **Unassigned**          | Issues with no assignee are preferred                                    |
| **Maintainer Activity** | Repos with recent commits and responsive maintainers score higher        |
| **Description Quality** | Issues with clear, detailed descriptions are ranked above vague titles   |
| **Engagement**          | Maintainer comments on the issue indicate active shepherding             |
| **Project Health**      | Repos with CONTRIBUTING.md, recent releases, and active PRs score higher |

Use `--verbose` to see the score breakdown for each result:

```bash
$ good-first-issue find --language typescript --verbose

  TypeScript · vercel/next.js · ⭐ 124k
  Fix hydration warning for client components
  Labels: good first issue, bug
  3 comments · Created 2 days ago
  https://github.com/vercel/next.js/issues/12345
  Score: 92 (freshness: 18 | maintainer: 20 | description: 18 | engagement: 16 | health: 20)
```

## Output Formats

### Default (human-readable)

```bash
good-first-issue find --language rust
```

Pretty-printed with colors, language badges, star counts, and relative timestamps.

### JSON

```bash
good-first-issue find --language rust --json
```

```json
[
  {
    "title": "Add lint rule for unused format arguments",
    "url": "https://github.com/astral-sh/ruff/issues/6789",
    "repository": "astral-sh/ruff",
    "language": "Rust",
    "stars": 35000,
    "labels": ["good first issue", "help wanted"],
    "comments": 1,
    "createdAt": "2025-01-10T12:00:00Z",
    "qualityScore": 88
  }
]
```

## Configuration

### GitHub Token

Set a GitHub personal access token for higher API rate limits (60 requests/hour without, 5,000 with):

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

No scopes are required — the token only needs public access.

## Development

```bash
# Clone the repo
git clone https://github.com/Littletonconnor/good-first-issue.git
cd good-first-issue

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the CLI in development
cd packages/cli
pnpm dev -- --help
pnpm dev -- find --language typescript

# Lint and format
pnpm lint
pnpm format
```

### Project Structure

```
packages/
├── types/   # Shared TypeScript types (zero dependencies)
├── core/    # GitHub client, scoring engine, business logic
└── cli/     # CLI application (depends on core + types)
```

### Philosophy

- **Zero unnecessary dependencies** — uses `node:util`, `node:test`, `node:fs`, native `fetch`
- **Type safety first** — strict TypeScript, `Result<T, E>` for error handling, discriminated unions
- **Smart by default** — the tool should make good decisions without configuration

## License

MIT
