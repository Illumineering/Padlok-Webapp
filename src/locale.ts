// Picks the page's language from the visitor's preferred ones, in their order, the way the app
// would: a language the page does not speak is skipped rather than ending the search, so
// someone reading Catalan then Spanish gets Spanish, not English.
export const matchLocale = (preferred: readonly string[], supported: readonly string[]): string => {
  for (const tag of preferred) {
    const match = resolve(tag, supported)
    if (match) return match
  }
  return 'en'
}

const resolve = (tag: string, supported: readonly string[]): string | undefined => {
  let locale: Intl.Locale
  try {
    // Fills in the likely script and region, so zh-TW reads as Traditional and plain pt as Brazil.
    locale = new Intl.Locale(tag).maximize()
  } catch {
    return undefined
  }
  // A regional variant first, when the page has one, like British English.
  const candidates = [`${locale.language}-${locale.region}`, locale.language]
  switch (locale.language) {
    case 'zh':
      candidates.unshift(locale.script === 'Hant' ? 'zh-Hant' : 'zh-Hans')
      break
    case 'pt':
      candidates.unshift(locale.region === 'BR' ? 'pt-BR' : 'pt-PT')
      break
    case 'no':
    case 'nn':
      // Norwegian is one App Store localization, filed under Bokmål.
      candidates.unshift('nb')
      break
  }
  return candidates.find((candidate) => supported.includes(candidate))
}
