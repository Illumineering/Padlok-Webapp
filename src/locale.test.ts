import { describe, expect, it } from 'vitest'
import { matchLocale } from './locale'

const supported = ['en', 'en-GB', 'fr', 'de', 'es', 'nb', 'pt-BR', 'pt-PT', 'zh-Hans', 'zh-Hant']

describe('matchLocale', () => {
  it('drops the region of a language the page speaks', () => {
    expect(matchLocale(['de-AT'], supported)).toBe('de')
  })

  it('prefers a regional variant the page has', () => {
    expect(matchLocale(['en-GB'], supported)).toBe('en-GB')
    expect(matchLocale(['en-US'], supported)).toBe('en')
    expect(matchLocale(['en'], supported)).toBe('en')
  })

  it('skips a language the page does not speak and keeps looking', () => {
    expect(matchLocale(['ca-ES', 'es-ES', 'en-US'], supported)).toBe('es')
  })

  it('falls back to English when no preferred language is spoken', () => {
    expect(matchLocale(['ca', 'eu'], supported)).toBe('en')
    expect(matchLocale([], supported)).toBe('en')
  })

  it('ignores a malformed tag', () => {
    expect(matchLocale(['not a tag!', 'fr'], supported)).toBe('fr')
  })

  it('tells Traditional from Simplified Chinese by script or region', () => {
    expect(matchLocale(['zh-TW'], supported)).toBe('zh-Hant')
    expect(matchLocale(['zh-HK'], supported)).toBe('zh-Hant')
    expect(matchLocale(['zh-Hant-CN'], supported)).toBe('zh-Hant')
    expect(matchLocale(['zh-CN'], supported)).toBe('zh-Hans')
    expect(matchLocale(['zh'], supported)).toBe('zh-Hans')
  })

  it('tells Brazilian from European Portuguese, with Brazil as the default', () => {
    expect(matchLocale(['pt-BR'], supported)).toBe('pt-BR')
    expect(matchLocale(['pt'], supported)).toBe('pt-BR')
    expect(matchLocale(['pt-PT'], supported)).toBe('pt-PT')
    expect(matchLocale(['pt-AO'], supported)).toBe('pt-PT')
  })

  it('reads every Norwegian tag as Bokmål', () => {
    expect(matchLocale(['no'], supported)).toBe('nb')
    expect(matchLocale(['nn-NO'], supported)).toBe('nb')
    expect(matchLocale(['nb-NO'], supported)).toBe('nb')
  })
})
