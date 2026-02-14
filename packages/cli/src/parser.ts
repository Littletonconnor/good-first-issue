import { parseArgs } from 'node:util'

export type CliFlags = ReturnType<typeof cli>['values']

export function cli() {
  return parseArgs({
    options: {
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
      verbose: {
        type: 'boolean',
        short: 'v',
        default: false,
      },
      language: {
        type: 'string',
        short: 'l',
      },
      assigned: {
        type: 'boolean',
        default: false,
      },
      labels: {
        type: 'string',
        multiple: true,
      },
      org: {
        type: 'string',
        short: 'o',
      },
      repo: {
        type: 'string',
        short: 'r',
      },
      sort: {
        type: 'string',
        short: 's',
      },
      limit: {
        type: 'string',
      },
      json: {
        type: 'boolean',
      },
    },
    allowPositionals: true,
  })
}
