# TODO - Good First Issue

A prioritized roadmap for building a modern "good first issue" discovery tool.

---

## Phase 1: Foundation

### Project Setup

- [x] Initialize pnpm monorepo
- [x] Set up TypeScript configuration (strict mode, ESM output)
- [x] Configure ESLint + Prettier
- [x] Create shared `packages/types` for TypeScript interfaces
- [x] Create shared `packages/core` for business logic

### Core Library (`packages/core`)

- [ ] Implement GitHub API client using native `fetch`
- [ ] Add token-based authentication support
- [ ] Create issue search function with filtering
- [ ] Implement result caching (`node:fs` file-based)
- [ ] Add exponential backoff for API failures
- [ ] Create quality scoring algorithm
- [ ] Write unit tests with `node:test` and `node:assert`

---

## Phase 2: CLI Application

### Basic CLI (`packages/cli`)

- [ ] Set up CLI entry point with `node:util` parseArgs
- [ ] Implement `gfi` base command with help
- [ ] Add `gfi search` - search for good first issues
- [ ] Add `gfi random` - show a random issue ("I'm Feeling Lucky")
- [ ] Add `gfi list` - list curated projects
- [ ] Add `gfi open <issue-url>` - open issue in browser (use `open` command)

### CLI Enhancements

- [ ] Add interactive mode with `node:readline` (no external prompts library)
- [ ] Implement language filter (`--language`, `-l`)
- [ ] Implement project filter (`--project`, `-p`)
- [ ] Add output formatting options (`--json`, `--compact`)
- [ ] Add `--limit` flag for result count
- [ ] Colorized output with ANSI escape codes (no chalk)
- [ ] Simple progress indicator with console updates
- [ ] Box formatting with Unicode box-drawing characters

### CLI Polish

- [ ] Add shell completions (bash, zsh, fish)
- [ ] Implement config file support (`~/.gfirc`) with `node:fs`
- [ ] Add `gfi config` command for settings
- [ ] Create man page / detailed help
- [ ] Package for npm publishing
- [ ] Version check using native fetch to npm registry

---

## Phase 3: Curated Data

### Project Curation

- [ ] Create `data/curated.json` schema
- [ ] Add 50+ high-quality beginner-friendly projects
- [ ] Include metadata: language, type, difficulty, mentorship
- [ ] Add project health indicators
- [ ] Create automated staleness detection
- [ ] Build script to validate curated data

### Discovery Sources

- [ ] Integrate GitHub Explore trending repos
- [ ] Add support for GitHub Topics (e.g., `good-first-issue`)
- [ ] Parse awesome-\* lists for project discovery
- [ ] Consider CodeTriage integration
- [ ] Consider Up For Grabs integration

---

## Phase 4: Quality & Scoring

### Issue Quality Algorithm

- [ ] Score based on issue age (prefer fresh)
- [ ] Score based on description quality (length, formatting)
- [ ] Score based on label specificity
- [ ] Score based on maintainer response time
- [ ] Score based on project activity
- [ ] Add difficulty estimation heuristics
- [ ] Add time-to-complete estimation

### Project Health Metrics

- [ ] Check last commit date
- [ ] Check maintainer activity
- [ ] Check documentation quality (README, CONTRIBUTING)
- [ ] Check issue response rate
- [ ] Check PR merge time
- [ ] Generate overall health score

---

## Phase 5: Web Application

### Web Setup (`packages/web`)

- [ ] Initialize Next.js 14 with App Router
- [ ] Set up Tailwind CSS
- [ ] Configure React Query for data fetching
- [ ] Create API routes for issue search
- [ ] Set up Vercel deployment

### Web Features

- [ ] Homepage with search and filters
- [ ] Issue cards with quality indicators
- [ ] Language filter sidebar
- [ ] Project type filter
- [ ] Difficulty filter
- [ ] Sort options (newest, quality score, stars)
- [ ] Pagination / infinite scroll

### Web Enhancements

- [ ] Dark mode support
- [ ] Mobile responsive design
- [ ] Share issue links
- [ ] "Copy to clipboard" for issue URLs
- [ ] Keyboard navigation
- [ ] RSS feed for new issues
- [ ] Weekly digest email signup

---

## Phase 6: Personalization

### User Features (Future)

- [ ] GitHub OAuth login
- [ ] Save favorite projects
- [ ] Track contributed issues
- [ ] Personalized recommendations based on:
  - Starred repositories
  - Primary languages
  - Contribution history
- [ ] "Issues like ones you've done" feature
- [ ] Skill-based matching

### Notifications (Future)

- [ ] Email digest (daily/weekly)
- [ ] Browser push notifications
- [ ] Slack/Discord integration
- [ ] GitHub Actions for team notifications

---

## Phase 7: Advanced Features

### Multi-Platform Support

- [ ] GitLab API integration
- [ ] Gitea/Forgejo support
- [ ] Codeberg support
- [ ] Unified search across platforms

### Analytics & Insights

- [ ] Track issue claim rates
- [ ] Track successful contributions
- [ ] Surface "most successful" projects for beginners
- [ ] Community leaderboard (opt-in)

### AI Enhancements

- [ ] LLM-powered issue summarization
- [ ] Difficulty classification with AI
- [ ] Skill requirements extraction
- [ ] "Similar issues" recommendations

---

## Ideas & Brainstorming

### Unique Features to Explore

- **Mentorship Matching**: Connect new contributors with experienced maintainers
- **Issue Walkthroughs**: Step-by-step guides for specific issues
- **Pair Programming Queue**: Match contributors for pair coding sessions
- **Learning Paths**: Curated sequences of progressively harder issues
- **"First PR" Celebrations**: Social sharing when someone completes their first contribution
- **Project Office Hours**: Show when maintainers are available for questions
- **Issue Previews**: Show relevant code snippets for each issue
- **Contribution Streaks**: Gamification to encourage regular contributions
- **Team Challenges**: Organizations can set contribution goals
- **Hacktoberfest Mode**: Special filtering during October

### Data Sources to Explore

- GitHub Sponsors (support contributors)
- Open Collective projects
- NumFOCUS affiliated projects
- Apache Foundation projects
- Linux Foundation projects
- CNCF projects
- Mozilla projects

### Potential Partnerships

- GitHub Education
- Major League Hacking (MLH)
- Open Source Initiative
- Digital Ocean (Hacktoberfest)
- Dev.to / Hashnode communities

---

## Technical Debt & Maintenance

- [ ] Set up GitHub Actions CI/CD
- [ ] Add Dependabot for dependency updates
- [ ] Create release automation
- [ ] Write comprehensive README
- [ ] Add CONTRIBUTING.md guide
- [ ] Create issue templates
- [ ] Add code coverage reporting
- [ ] Set up error monitoring (Sentry)
- [ ] Performance monitoring for web app

---

## Milestones

### v0.1.0 - MVP CLI

- Basic search functionality
- 20+ curated projects
- Language filtering
- Interactive mode

### v0.2.0 - Quality Scoring

- Issue quality algorithm
- Project health metrics
- Improved filtering

### v0.3.0 - Web Launch

- Public website
- Search and browse
- Mobile support

### v1.0.0 - Full Release

- Stable API
- 100+ curated projects
- Personalization features
- Multi-platform support
