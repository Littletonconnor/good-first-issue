import { searchIssues } from '@good-first-issue/core'

async function main() {
  const options = {
    language: 'typescript',
    labels: ['good first issue'],
    limit: 10,
  }

  const issues = await searchIssues(options)
  console.log(`Found ${issues.length} issues`)
}

main().catch(console.error)
