# good-first-issue

A modern CLI and web app to discover beginner-friendly open source contribution opportunities.

## Why?

Finding your first open source contribution is hard. You need to:
- Find a project you care about
- Find an issue that's actually beginner-friendly
- Make sure it's not stale or already claimed
- Hope the maintainers are responsive

**good-first-issue** solves this by surfacing high-quality issues with smart filtering and quality scoring.

## Features

- **Smart Discovery**: Search across GitHub for "good first issue" labeled issues
- **Quality Scoring**: Issues ranked by freshness, clarity, and maintainer activity
- **Curated Projects**: Hand-picked list of beginner-friendly repositories
- **Flexible Filtering**: Filter by language, project type, difficulty
- **CLI + Web**: Use from terminal or browse on the web

## Quick Start

```bash
# Install globally
npm install -g good-first-issue

# Search for issues
gfi search --language typescript

# Interactive mode
gfi

# Feeling lucky?
gfi random
```

## Development

```bash
# Clone the repo
git clone https://github.com/yourusername/good-first-issue.git
cd good-first-issue

# Install dependencies
pnpm install

# Run in development
pnpm dev
```

## Project Structure

```
packages/
├── cli/     # Command-line interface
├── web/     # Next.js web application
├── core/    # Shared business logic
└── types/   # Shared TypeScript types
```

## Contributing

We welcome contributions! Check out our [TODO.md](./TODO.md) for the roadmap and open issues.

## License

MIT
