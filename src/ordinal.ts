// The app shows floors with Foundation's ordinal NumberFormatter, which is ICU's digits-ordinal
// rule set. Browsers expose no such formatter (Intl.PluralRules only tells the category), so
// this spells out, for every language the page speaks, what that formatter prints there.

type Rule = (n: number) => string

const suffix = (text: string): Rule => (n) => `${n}${text}`
const prefix = (text: string): Rule => (n) => `${text}${n}`

const rules: Record<string, Rule> = {
  en: (n) => {
    const tens = n % 100
    if (tens >= 11 && tens <= 13) return `${n}th`
    return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
  },
  fr: (n) => `${n}${n === 1 ? 'er' : 'e'}`,
  cs: suffix('.'),
  da: suffix('.'),
  de: suffix('.'),
  el: suffix(''),
  es: suffix('.º'),
  fi: suffix('.'),
  hu: suffix('.'),
  id: prefix('ke-'),
  it: suffix('º'),
  ja: prefix('第'),
  ko: suffix('번째'),
  nb: suffix('.'),
  nl: suffix('e'),
  pl: suffix('.'),
  'pt-BR': suffix('º'),
  'pt-PT': suffix('º'),
  ro: suffix('a'),
  ru: suffix(''),
  sv: (n) => {
    const tens = n % 100
    return `${n}${[1, 2].includes(n % 10) && tens !== 11 && tens !== 12 ? ':a' : ':e'}`
  },
  th: prefix('ที่ '),
  tr: suffix('.'),
  uk: (n) => `${n}${n % 10 === 3 && n % 100 !== 13 ? '-ій' : '-ий'}`,
  vi: prefix('thứ '),
  'zh-Hans': prefix('第'),
  'zh-Hant': prefix('第')
}

export const ordinal = (n: number, locale: string): string => (rules[locale] ?? rules.en!)(n)
