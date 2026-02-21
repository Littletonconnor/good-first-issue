# Contributing to Open Source

A practical guide for developers who know how to code but haven't contributed to open source before. This covers the full workflow — from finding an issue to getting your pull request merged.

## Before You Start

### Set Up Your Tools

You'll need:

- A [GitHub account](https://github.com)
- [Git](https://git-scm.com/) installed locally
- A GitHub personal access token (optional, but recommended for API rate limits)

Configure git with your name and email if you haven't already:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Understand the Landscape

Open source projects vary wildly. Some are maintained by large companies with dedicated teams. Others are side projects maintained by one person in their spare time. Your experience will differ depending on the project, so calibrate your expectations.

Things that signal a healthy project:

- **Recent commits** — the last commit was within the past few weeks, not years
- **Responsive maintainers** — issues and PRs get replies within days, not months
- **Clear contribution docs** — a CONTRIBUTING.md that explains the workflow
- **Active community** — discussions, multiple contributors, recent releases
- **Good first issue labels** — the maintainers actively onboard new contributors

Things that signal you should look elsewhere:

- Last commit was over a year ago
- Open PRs sitting with no response for months
- No CONTRIBUTING.md or development setup instructions
- Hostile or dismissive tone in issue comments

## Finding an Issue

### Use good-first-issue

That's what this tool is for. Run it in your project directory and it'll find issues matched to your language:

```bash
good-first-issue find
```

Or specify a language directly:

```bash
good-first-issue find --language typescript
```

The quality scoring helps surface issues where you're likely to have a good experience — active maintainers, clear descriptions, responsive repos.

### What Makes a Good First Issue

Not all "good first issue" labels are created equal. Look for:

- **Clear description** — you can understand what needs to change and where
- **Defined scope** — it's a single, contained task, not a vague feature request
- **Maintainer context** — someone has explained the expected approach or pointed to relevant code
- **Recent activity** — the issue was created or commented on recently
- **No assignee** — nobody is already working on it

Avoid issues that:

- Have been open for over 6 months with no activity
- Are vaguely described ("improve performance", "refactor this module")
- Already have multiple people saying "I'll work on this"
- Require deep domain knowledge the issue doesn't explain

## Claiming an Issue

Before you start writing code, leave a comment on the issue. This is important — it prevents duplicate work and lets the maintainer know someone is on it.

**Good comment:**

> Hi, I'd like to work on this. I've read the CONTRIBUTING.md and I think the approach would be to [brief description of your plan]. Does that sound right?

**Bad comment:**

> Can I work on this?

The difference matters. The first shows you've done your homework and gives the maintainer something to respond to. The second puts the burden on them to explain everything.

**Important etiquette:**

- Don't claim an issue you're not going to start within a few days
- If you get stuck or lose interest, comment to let others know the issue is available again
- If someone else is already working on it, move on to another issue — don't race them

## Setting Up the Project

### Fork and Clone

1. Click the **Fork** button on the repository's GitHub page
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/project-name.git
cd project-name
```

3. Add the original repo as an upstream remote:

```bash
git remote add upstream https://github.com/original-owner/project-name.git
```

### Read the Contributing Guide

Before writing any code, read these files if they exist:

- **CONTRIBUTING.md** — development setup, coding standards, PR process
- **README.md** — project overview, how to build and run
- **CODE_OF_CONDUCT.md** — behavioral expectations

Follow the setup instructions exactly. If the project uses a specific package manager, Node version, or build tool, use those — not your personal preference.

### Create a Branch

Create a branch from the latest `main` (or whatever the default branch is):

```bash
git fetch upstream
git checkout -b fix/issue-description upstream/main
```

Use a descriptive branch name. Common conventions:

- `fix/short-description` for bug fixes
- `feat/short-description` for new features
- `docs/short-description` for documentation changes

## Making Your Changes

### Keep It Focused

Your PR should address one thing — the issue you claimed. Resist the temptation to:

- Fix unrelated code style issues you noticed
- Refactor nearby code that "could be better"
- Add features beyond what the issue asks for

These make the PR harder to review and more likely to get pushback. If you find other things worth fixing, open separate issues for them.

### Follow the Project's Style

Match the existing code style. If the project uses tabs, use tabs. If they use semicolons, use semicolons. If they have an `.editorconfig` or linter config, make sure your editor respects it.

Run the project's linter and tests locally before pushing:

```bash
# These commands vary by project — check CONTRIBUTING.md
npm test
npm run lint
```

### Write Tests

If the project has tests, write tests for your changes. If you're fixing a bug, write a test that reproduces the bug first, then fix it. This is the gold standard for bug fix PRs.

### Commit Messages

Write clear commit messages. Many projects have a preferred format — check CONTRIBUTING.md. If they don't specify, a good default is:

```
Short summary of what changed (under 72 chars)

Longer explanation of why this change was made, what problem it solves,
and any context a reviewer might need. Reference the issue number.

Fixes #123
```

## Submitting a Pull Request

### Push Your Branch

```bash
git push origin fix/issue-description
```

### Open the PR

Go to the original repository on GitHub. You'll see a prompt to create a PR from your recently pushed branch.

Write a good PR description:

- **Reference the issue** — "Fixes #123" or "Closes #123" (GitHub will auto-link and auto-close)
- **Explain what you changed** — a brief summary of the approach
- **Note anything you're unsure about** — reviewers appreciate honesty about trade-offs or areas you'd like feedback on

**Example PR description:**

```markdown
## Summary

Fixes #123. Adds input validation for the `--limit` flag to prevent
negative numbers from being passed to the GitHub API.

## Changes

- Added a `validatePositiveInteger()` function in `packages/cli/src/validators.ts`
- Updated `find` command to validate `--limit` before making the API call
- Added tests for the validation function

## Notes

I wasn't sure whether to throw an error or silently clamp to 1.
I went with a clear error message — let me know if you'd prefer the other approach.
```

### Check CI

Most projects run automated checks on PRs (tests, linting, type checking). If these fail, fix them before asking for review. Reviewers won't look at a PR with failing CI.

## Responding to Review

Code review is normal and expected. Even experienced contributors get feedback on their PRs. Here's how to handle it well:

### Be Patient

Maintainers are often volunteers. A review might take a few days or even a week. Don't ping them after 24 hours. If it's been over two weeks, a polite follow-up is fine:

> Just checking in — is there anything I should change, or is this waiting for something else?

### Take Feedback Gracefully

Review comments are about the code, not about you. If a reviewer asks you to change something:

- **Do it**, even if you disagree slightly. The maintainer knows the codebase better than you
- **Ask questions** if you don't understand the reasoning — "Could you help me understand why X is preferred here?" is a great response
- **Don't argue** about style decisions. The project's conventions win, always

### Push Updates

When you make changes based on review, push to the same branch. The PR will update automatically:

```bash
git add .
git commit -m "Address review: use early return instead of nested if"
git push origin fix/issue-description
```

Some projects prefer you squash your commits. Others prefer you keep them separate so the review history is clear. Check CONTRIBUTING.md or ask.

## After Your PR is Merged

Congratulations. A few things to clean up:

```bash
# Switch back to main
git checkout main

# Pull the latest changes (which now include yours)
git pull upstream main

# Delete your local branch
git branch -d fix/issue-description

# Delete your remote branch
git push origin --delete fix/issue-description
```

### What's Next

- **Contribute again** — you now have context on the project. The second contribution is easier than the first
- **Help others** — answer questions in issues, review other people's PRs
- **Explore more projects** — use `good-first-issue explore` to find other repositories

## Common Mistakes to Avoid

1. **Starting work without commenting on the issue** — leads to duplicate work and wasted effort
2. **Making a massive PR** — keep it small and focused. A 50-line PR gets reviewed in an hour. A 500-line PR sits for weeks
3. **Ignoring CI failures** — fix them before requesting review
4. **Getting defensive about feedback** — review is collaborative, not adversarial
5. **Disappearing after submitting** — respond to review comments promptly. Abandoned PRs get closed
6. **Not reading CONTRIBUTING.md** — every project has its own conventions. Read them
7. **Force-pushing without warning** — if you need to rebase, let the reviewer know so they don't lose their place

## Quick Reference

| Step | Action |
| --- | --- |
| Find an issue | `good-first-issue find --language <lang>` |
| Claim it | Comment on the issue with your plan |
| Fork & clone | Fork on GitHub, clone locally, add upstream remote |
| Branch | `git checkout -b fix/description upstream/main` |
| Code | Make focused changes, follow project style |
| Test | Run the project's test suite locally |
| Push | `git push origin fix/description` |
| PR | Open PR referencing the issue, explain your changes |
| Review | Respond to feedback, push updates |
| Clean up | Delete branch after merge |
