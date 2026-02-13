import { styleText } from 'util'
import { EIGHT_WEEKS, ONE_WEEK } from './constants.js'

export function sliceWidth(str: string, maxWidth: number): string {
  let width = 0
  let i = 0
  for (const char of str) {
    const w = isWide(char.codePointAt(0)!) ? 2 : 1
    if (width + w > maxWidth) break
    width += w
    i += char.length
  }
  return str.slice(0, i)
}

export function isWide(code: number): boolean {
  return (
    (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
    (code >= 0x2e80 && code <= 0x303e) || // CJK Radicals, Kangxi, Ideographic
    (code >= 0x3040 && code <= 0x33bf) || // Hiragana, Katakana, CJK Compatibility
    (code >= 0x3400 && code <= 0x4dbf) || // CJK Unified Extension A
    (code >= 0x4e00 && code <= 0xa4cf) || // CJK Unified, Yi
    (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xfe30 && code <= 0xfe6f) || // CJK Compatibility Forms
    (code >= 0xff01 && code <= 0xff60) || // Fullwidth Forms
    (code >= 0xffe0 && code <= 0xffe6) || // Fullwidth Signs
    (code >= 0x20000 && code <= 0x2fffd) || // CJK Extension B+
    (code >= 0x30000 && code <= 0x3fffd) || // CJK Extension G+
    (code >= 0x1f300 && code <= 0x1f9ff) || // Misc Symbols, Emoticons, Dingbats, Supplemental Symbols
    (code >= 0x1fa00 && code <= 0x1fa6f) || // Chess Symbols, Extended-A
    (code >= 0x1fa70 && code <= 0x1faff) || // Symbols and Pictographs Extended-A
    (code >= 0x2600 && code <= 0x27bf) || // Misc Symbols, Dingbats
    (code >= 0x231a && code <= 0x23f3) // Misc Technical (hourglass, watch, etc.)
  )
}

export function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(count >= 10000 ? 0 : 1) + 'k'
  }
  return count.toString()
}

export function formatAge(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago'
  if (seconds < 2592000) return Math.floor(seconds / 604800) + 'w ago'
  if (seconds < 31536000) return Math.floor(seconds / 2592000) + 'mo ago'
  return Math.floor(seconds / 31536000) + 'y ago'
}

export function ageColor(dateString: string, text: string): string {
  const elapsed = Date.now() - new Date(dateString).getTime()

  if (elapsed < ONE_WEEK) {
    return styleText('green', text)
  } else if (elapsed < EIGHT_WEEKS) {
    return styleText('yellow', text)
  } else {
    return styleText('red', text)
  }
}
