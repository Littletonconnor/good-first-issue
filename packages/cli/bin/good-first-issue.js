#!/usr/bin/env node

import { main } from '../dist/index.js'
import fs from 'fs'
import process from 'process'
import { URL } from 'url'
import { fileURLToPath } from 'url'

const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))

const requiredNodeVersion = Number(packageJson.engines?.node.slice(2))
const currentNodeVersion = Number(process.versions.node.split('.')[0])

if (currentNodeVersion < requiredNodeVersion) {
  // eslint-disable-next-line no-undef
  console.error(
    `Required node version: ${requiredNodeVersion} is less than your current node version: ${currentNodeVersion} `,
  )
}

main()
