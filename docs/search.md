# GitHub Search API Reference

A comprehensive reference for the GitHub Search API, focused on searching issues and pull requests.

---

## API Endpoint

```sh
GET https://api.github.com/search/issues
```

### URL Parameters

| Parameter         | Type    | Required | Description                                   |
| ----------------- | ------- | -------- | --------------------------------------------- |
| `q`               | string  | Yes      | Search query with keywords and qualifiers     |
| `sort`            | string  | No       | Sort field (see options below)                |
| `order`           | string  | No       | `asc` or `desc` (default: `desc`)             |
| `per_page`        | integer | No       | Results per page, max 100 (default: 30)       |
| `page`            | integer | No       | Page number (default: 1)                      |
| `advanced_search` | string  | No       | Set to `true` for advanced search with AND/OR |

### Sort Options

- `created` - Sort by creation date
- `updated` - Sort by last updated date
- `comments` - Sort by number of comments
- `reactions` - Sort by total reactions
- `reactions-+1` - Sort by +1 reactions
- `reactions--1` - Sort by -1 reactions
- `reactions-smile` - Sort by smile reactions
- `reactions-heart` - Sort by heart reactions
- `reactions-tada` - Sort by tada reactions
- `reactions-thinking_face` - Sort by thinking face reactions
- `interactions` - Sort by interactions (comments + reactions)

### Example Request

```bash
curl -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.github.com/search/issues?q=language:typescript+label:\"good+first+issue\"+state:open&sort=created&order=desc&per_page=10"
```

---

## Response Structure

```json
{
  "total_count": 1234,
  "incomplete_results": false,
  "items": [
    {
      "id": 12345678,
      "number": 42,
      "title": "Issue title",
      "state": "open",
      "html_url": "https://github.com/owner/repo/issues/42",
      "body": "Issue description...",
      "labels": [{ "id": 123, "name": "good first issue", "color": "7057ff" }],
      "assignee": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:20:00Z",
      "comments": 3,
      "pull_request": null,
      "repository_url": "https://api.github.com/repos/owner/repo"
    }
  ]
}
```

**Note:** If `pull_request` is present (not null), the item is a PR, not an issue.

---

## Rate Limits

| Request Type    | Limit              |
| --------------- | ------------------ |
| Authenticated   | 30 requests/minute |
| Unauthenticated | 10 requests/minute |

**Important:** Rate limits apply across ALL search endpoints combined.

### Rate Limit Headers

```sh
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 28
X-RateLimit-Reset: 1609459200
X-RateLimit-Used: 2
```

---

## Query (`q`) Parameter Syntax

The `q` parameter is where the magic happens. It consists of keywords and qualifiers.

### Basic Structure

```sh
q=keyword+qualifier:value+qualifier:value
```

Spaces are encoded as `+` in URLs. Multiple qualifiers are combined with `+` (which acts as AND).

---

## Search Qualifiers

### Type Filters

| Qualifier    | Description        | Example      |
| ------------ | ------------------ | ------------ |
| `is:issue`   | Issues only        | `is:issue`   |
| `is:pr`      | Pull requests only | `is:pr`      |
| `type:issue` | Same as is:issue   | `type:issue` |
| `type:pr`    | Same as is:pr      | `type:pr`    |

**Important:** The `/search/issues` endpoint returns BOTH issues and PRs by default. Always use `is:issue` to get only issues.

### State Filters

| Qualifier      | Description          | Example        |
| -------------- | -------------------- | -------------- |
| `state:open`   | Open issues/PRs      | `state:open`   |
| `state:closed` | Closed issues/PRs    | `state:closed` |
| `is:open`      | Same as state:open   | `is:open`      |
| `is:closed`    | Same as state:closed | `is:closed`    |
| `is:merged`    | Merged PRs           | `is:merged`    |
| `is:unmerged`  | Unmerged PRs         | `is:unmerged`  |

### Repository Scope

| Qualifier         | Description             | Example               |
| ----------------- | ----------------------- | --------------------- |
| `repo:owner/name` | Specific repository     | `repo:facebook/react` |
| `org:name`        | All repos in org        | `org:microsoft`       |
| `user:name`       | All repos owned by user | `user:torvalds`       |
| `is:public`       | Public repos only       | `is:public`           |
| `is:private`      | Private repos only      | `is:private`          |

### Labels

| Qualifier            | Description        | Example                    |
| -------------------- | ------------------ | -------------------------- |
| `label:name`         | Has specific label | `label:bug`                |
| `label:"multi word"` | Label with spaces  | `label:"good first issue"` |
| `no:label`           | Has no labels      | `no:label`                 |

**Multiple labels (AND):** `label:bug label:urgent` - must have BOTH labels

**Multiple labels (OR):** `label:bug,urgent` - must have EITHER label

### Assignment

| Qualifier           | Description            | Example            |
| ------------------- | ---------------------- | ------------------ |
| `assignee:username` | Assigned to user       | `assignee:octocat` |
| `assignee:*`        | Has any assignee       | `assignee:*`       |
| `no:assignee`       | Not assigned to anyone | `no:assignee`      |

### Author and Involvement

| Qualifier            | Description             | Example             |
| -------------------- | ----------------------- | ------------------- |
| `author:username`    | Created by user         | `author:octocat`    |
| `mentions:username`  | Mentions user           | `mentions:octocat`  |
| `commenter:username` | User commented          | `commenter:octocat` |
| `involves:username`  | User involved (any way) | `involves:octocat`  |
| `author:@me`         | Created by you          | `author:@me`        |

### Language

| Qualifier       | Description         | Example               |
| --------------- | ------------------- | --------------------- |
| `language:name` | Repository language | `language:typescript` |

See [linguist languages.yml](https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml) for valid language names.

### Date Filters

Dates use ISO8601 format: `YYYY-MM-DD`

| Qualifier                        | Description                | Example                          |
| -------------------------------- | -------------------------- | -------------------------------- |
| `created:YYYY-MM-DD`             | Created on date            | `created:2024-01-15`             |
| `created:>YYYY-MM-DD`            | Created after date         | `created:>2024-01-01`            |
| `created:>=YYYY-MM-DD`           | Created on or after        | `created:>=2024-01-01`           |
| `created:<YYYY-MM-DD`            | Created before date        | `created:<2024-06-01`            |
| `created:YYYY-MM-DD..YYYY-MM-DD` | Date range                 | `created:2024-01-01..2024-06-01` |
| `updated:...`                    | Last updated (same syntax) | `updated:>2024-01-01`            |
| `closed:...`                     | Closed date (same syntax)  | `closed:>2024-01-01`             |

### Engagement Metrics

| Qualifier         | Description           | Example            |
| ----------------- | --------------------- | ------------------ |
| `comments:n`      | Exact comment count   | `comments:0`       |
| `comments:>n`     | More than n comments  | `comments:>10`     |
| `comments:n..m`   | Comment range         | `comments:1..5`    |
| `reactions:>n`    | More than n reactions | `reactions:>100`   |
| `interactions:>n` | Comments + reactions  | `interactions:>50` |

### Linked Issues/PRs

| Qualifier      | Description            | Example        |
| -------------- | ---------------------- | -------------- |
| `linked:pr`    | Issue linked to a PR   | `linked:pr`    |
| `linked:issue` | PR linked to an issue  | `linked:issue` |
| `-linked:pr`   | Issue NOT linked to PR | `-linked:pr`   |

### Miscellaneous

| Qualifier              | Description             | Example                |
| ---------------------- | ----------------------- | ---------------------- |
| `no:milestone`         | No milestone assigned   | `no:milestone`         |
| `milestone:name`       | In specific milestone   | `milestone:"v1.0"`     |
| `is:locked`            | Conversation locked     | `is:locked`            |
| `is:unlocked`          | Conversation not locked | `is:unlocked`          |
| `archived:true`        | In archived repos       | `archived:true`        |
| `archived:false`       | In active repos         | `archived:false`       |
| `reason:completed`     | Closed as completed     | `reason:completed`     |
| `reason:"not planned"` | Closed as not planned   | `reason:"not planned"` |

### Content Search

| Qualifier     | Description        | Example                  |
| ------------- | ------------------ | ------------------------ |
| `in:title`    | Search in title    | `bug in:title`           |
| `in:body`     | Search in body     | `error in:body`          |
| `in:comments` | Search in comments | `workaround in:comments` |

---

## Syntax Rules

### Quoting

Multi-word values MUST be quoted:

```sh
label:"good first issue"    # Correct
label:good first issue      # Wrong - "first" and "issue" become separate terms
```

### Exclusion

Prefix with `-` to exclude:

```sh
-label:wontfix              # Exclude issues with "wontfix" label
-author:bot                 # Exclude issues created by "bot"
-language:javascript        # Exclude JavaScript repos
```

### Boolean Operators

```sh
# AND (implicit - space between qualifiers)
label:bug label:urgent      # Has both labels

# OR (comma for same qualifier)
label:bug,enhancement       # Has either label

# Advanced search (requires advanced_search=true)
label:bug AND label:urgent  # Explicit AND
label:bug OR label:help     # Explicit OR
```

### Case Sensitivity

Searches are **case-insensitive**:

```sh
language:TypeScript         # Same as
language:typescript         # Same as
language:TYPESCRIPT         # All match TypeScript repos
```

---

## Limitations

| Limit                    | Value                                           |
| ------------------------ | ----------------------------------------------- |
| Max results returned     | 1,000                                           |
| Max query length         | 256 characters (excluding operators/qualifiers) |
| Max AND/OR/NOT operators | 5                                               |
| Max repos per query      | 4,000                                           |

---

## Example Queries for Good First Issues

### Basic: Open good first issues in TypeScript

```sh
is:issue is:open label:"good first issue" language:typescript
```

### Unassigned, recent, with few comments

```sh
is:issue is:open label:"good first issue" no:assignee created:>2024-01-01 comments:<5
```

### In a specific org, not linked to PR

```sh
is:issue is:open org:facebook label:"good first issue" -linked:pr
```

### Multiple labels (help wanted OR good first issue)

```sh
is:issue is:open label:"good first issue","help wanted" language:python
```

### Sorted by reactions (most popular)

```sh
is:issue is:open label:"good first issue" sort:reactions order:desc
```

### Full URL example

```sh
https://api.github.com/search/issues?q=is:issue+is:open+label:"good+first+issue"+language:typescript+no:assignee&sort=created&order=desc&per_page=30
```

---

## Sources

- [REST API endpoints for search - GitHub Docs](https://docs.github.com/en/rest/search/search)
- [Searching issues and pull requests - GitHub Docs](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)
- [Understanding the search syntax - GitHub Docs](https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax)
- [Filtering and searching issues and pull requests - GitHub Docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/filtering-and-searching-issues-and-pull-requests)
