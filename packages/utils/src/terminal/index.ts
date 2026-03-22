import { InspectColor, styleText } from 'node:util'

export type TerminalColor = Extract<
  InspectColor,
  | 'bold'
  | 'dim'
  | 'cyan'
  | 'red'
  | 'green'
  | 'gray'
  | 'yellow'
  | 'white'
  | 'greenBright'
  | 'yellowBright'
  | 'redBright'
  | 'cyanBright'
  | 'magentaBright'
  | 'blueBright'
  | 'whiteBright'
>

export function color(style: TerminalColor, text: string) {
  return styleText(style, text)
}
