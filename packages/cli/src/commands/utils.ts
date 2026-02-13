import { isWide, sliceWidth } from './find/utils.js'

export function padEnd(str: string, width: number): string {
  const diff = width - displayWidth(str)
  return diff > 0 ? str + ' '.repeat(diff) : str
}

export function padStart(str: string, width: number): string {
  const diff = width - displayWidth(str)
  return diff > 0 ? ' '.repeat(diff) + str : str
}

export function truncate(str: string, maxWidth: number): string {
  if (displayWidth(str) <= maxWidth) return str
  const truncated = sliceWidth(str, maxWidth - 3)
  return truncated + '...'
}

function displayWidth(str: string): number {
  let width = 0
  for (const char of str) {
    width += isWide(char.codePointAt(0)!) ? 2 : 1
  }
  return width
}
