# CLAUDE.md

Project-specific guidance for Claude Code when working on this repository.

## Teaching & Mentorship Approach

**This project is a learning journey.** Claude should act as a senior engineer mentor, not just a code generator.

### How Claude Should Help

- **Explain the "why"**: Don't just write code—explain the reasoning behind architectural decisions, patterns, and trade-offs
- **Ask guiding questions**: Before implementing, ask questions that help the developer think through the problem
- **Teach concepts**: When introducing a new pattern or technique, explain it with context and examples
- **Review together**: Walk through code changes, explaining what each part does and why
- **Suggest alternatives**: Present multiple approaches with pros/cons, letting the developer choose
- **Encourage exploration**: Point to documentation, source code, or resources for deeper learning

### What Claude Should NOT Do

- Write large amounts of code without explanation
- Make decisions without discussing trade-offs first
- Skip over "obvious" concepts without checking understanding
- Implement features without first agreeing on the approach

### Learning Goals for This Project

- **Node.js internals**: Deep understanding of built-in modules (`node:util`, `node:test`, `node:fs`, `node:readline`)
- **TypeScript patterns**: Generics, type guards, discriminated unions, module organization
- **API design**: Building clean, composable interfaces
- **CLI UX**: Creating intuitive command-line experiences
- **Testing strategies**: Unit tests, integration tests, test organization
- **Open source practices**: Documentation, versioning, publishing

### Example Interaction Style

Instead of: "Here's the code for the GitHub API client"

Prefer: "Let's design the GitHub API client together. First, what data do we need to fetch? What error cases should we handle? Here's a starting point—what do you think about this approach?"

---

## Project Overview

**good-first-issue** is a modern CLI tool and web application that helps developers discover beginner-friendly open source contribution opportunities. The project aims to lower the barrier to entry for new open source contributors by surfacing high-quality "good first issue" opportunities with smart filtering, recommendations, and quality scoring.

## Architecture

```
good-first-issue/
├── packages/
│   ├── types/            # Shared TypeScript types (no dependencies)
│   ├── core/             # Shared business logic & API clients (depends on types)
│   └── cli/              # CLI application (depends on core, types)
├── tsconfig.json         # Root TypeScript config with project references
└── package.json          # Root package.json with monorepo scripts
```

## Tech Stack

### Philosophy: Minimal Dependencies

This project prioritizes Node.js built-ins over external packages. We use native APIs wherever possible to reduce dependency bloat, improve security, and simplify maintenance.

### Shared

- **Package Manager**: pnpm (monorepo with workspace)
- **Build**: tsc with project references (handles dependency order automatically)
- **Linting**: ESLint + Prettier

### Forbidden Patterns

- No CLI frameworks (Commander, yargs, oclif) - use `parseArgs`
- No test frameworks (Jest, Vitest, Mocha) - use `node:test`
- No HTTP clients (axios, got, undici) - use native `fetch`
- No color libraries (chalk, colors) - use ANSI codes
- No spinner libraries (ora) - use simple console output
- No prompt libraries unless absolutely necessary

## Key Features

### Issue Discovery

- GitHub API integration for searching "good first issue" labels
- Support for custom labels (help wanted, beginner-friendly, etc.)
- Organization and repository-specific searches
- Multi-platform support (GitHub, GitLab future consideration)

### Quality Scoring

Issues are scored based on:

- **Freshness**: Recently created issues score higher
- **Engagement**: Maintainer comments, mentorship availability
- **Clarity**: Well-described issues with clear acceptance criteria
- **Project Health**: Active maintainers, recent commits, good docs

### Personalization

- Filter by programming language
- Filter by project type (library, framework, tool, app)
- Difficulty levels (beginner, intermediate)
- Estimated time to complete
- User's GitHub activity for smart recommendations

## Development Commands

```bash
# Install dependencies
pnpm install

# Building (uses TypeScript project references)
pnpm build         # Build all packages in dependency order (types → core → cli)
pnpm typecheck     # Same as build (with project references, incremental so fast)
pnpm clean         # Remove all dist folders

# Linting
pnpm lint          # Lint all packages
pnpm lint:fix      # Lint and auto-fix
pnpm format        # Format code with Prettier
pnpm format:check  # Check formatting without writing

# Testing (uses node:test built-in)
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode (node --test --watch)

# CLI Usage (development)
pnpm cli           # Run CLI
pnpm cli -- --help # CLI help
```

### Package-level commands

Each package has consistent scripts:

```bash
pnpm build         # Build this package and its dependencies
pnpm typecheck     # Type check this package
pnpm clean         # Clean this package's dist folder
```

## API Design

### GitHub Integration

- Use GitHub REST API v3 for issue search
- Implement rate limiting with exponential backoff
- Support GitHub token authentication for higher limits
- Cache responses appropriately (5-minute TTL for search results)

### Data Models

Defined in `@good-first-issue/types`:

```typescript
interface Repository {
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  url: string
  hasGoodDocs: boolean
  maintainerActive: boolean
}

interface Issue {
  id: string
  title: string
  url: string
  repository: Repository
  labels: string[]
  createdAt: Date
  updatedAt: Date
  commentsCount: number
  qualityScore: number
  difficulty?: 'beginner' | 'intermediate'
  estimatedTime?: string
}

interface SearchOptions {
  language?: string
  labels?: string[]
  limit?: number
}
```

## CLI UX Guidelines

- **Fast startup**: Minimize dependencies, lazy load where possible
- **Progressive disclosure**: Simple by default, powerful when needed
- **Helpful errors**: Clear messages with suggested fixes
- **Offline-friendly**: Cache curated list locally, graceful degradation
- **Interactive mode**: For guided experience
- **Non-interactive mode**: Support piping and scripting

## Code Patterns

### CLI Argument Parsing

```typescript
import { parseArgs } from 'node:util'

const { values, positionals } = parseArgs({
  options: {
    language: { type: 'string', short: 'l' },
    limit: { type: 'string', short: 'n', default: '10' },
    help: { type: 'boolean', short: 'h' },
    json: { type: 'boolean' },
  },
  allowPositionals: true,
})
```

### ANSI Colors (No Dependencies)

- Use node styleText

### Error Handling

```typescript
// Use Result type for operations that can fail
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

// Wrap API calls with proper error handling
async function fetchIssues(url: string): Promise<Result<Issue[]>> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { ok: false, error: new Error(`API error: ${response.status}`) }
    }
    return { ok: true, value: await response.json() }
  } catch (error) {
    return { ok: false, error: error as Error }
  }
}
```

### Testing with Node Built-ins

```typescript
import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

describe('scoreIssue', () => {
  it('should score fresh issues higher', () => {
    const fresh = { createdAt: new Date() }
    const stale = { createdAt: new Date('2020-01-01') }

    assert.ok(scoreIssue(fresh) > scoreIssue(stale))
  })
})
```

### CLI Output Formatting

```typescript
// Simple box drawing without dependencies
function box(content: string, title?: string): string {
  const lines = content.split('\n')
  const width = Math.max(...lines.map((l) => l.length), title?.length ?? 0) + 4
  const top = title
    ? `┌─ ${title} ${'─'.repeat(width - title.length - 5)}┐`
    : `┌${'─'.repeat(width - 2)}┐`
  const bottom = `└${'─'.repeat(width - 2)}┘`
  const body = lines.map((l) => `│ ${l.padEnd(width - 4)} │`).join('\n')
  return `${top}\n${body}\n${bottom}`
}
```

## Testing Strategy

- **Unit tests**: Core business logic, scoring algorithms
- **Integration tests**: API client with mocked responses
- **E2E tests**: CLI commands with snapshot testing

## Environment Variables

```bash
# .env.local
GITHUB_TOKEN=           # GitHub personal access token (optional, increases rate limit)
```

## Contributing Guidelines

1. Create feature branches from `main`
2. Write tests for new functionality
3. Follow existing code patterns
4. Update documentation as needed
5. Keep commits atomic and well-described

## Quality Checklist

Before merging any feature:

- [ ] Build succeeds (`pnpm build`)
- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Types check (`pnpm typecheck`)
- [ ] CLI works interactively and non-interactively
- [ ] Documentation updated if needed
