import { describe, expect, it } from 'vitest'
import { ordinal } from './ordinal'

// Printed by NumberFormatter(numberStyle: .ordinal) on macOS, for each of these numbers, so the
// page writes a floor exactly as the app beside it does.
const numbers = [1, 2, 3, 4, 5, 10, 11, 12, 13, 21, 22, 23, 101, 102, 111, 112, 121]
const foundation: Record<string, string> = {
  en: '1st 2nd 3rd 4th 5th 10th 11th 12th 13th 21st 22nd 23rd 101st 102nd 111th 112th 121st',
  fr: '1er 2e 3e 4e 5e 10e 11e 12e 13e 21e 22e 23e 101e 102e 111e 112e 121e',
  cs: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  da: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  de: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  el: '1 2 3 4 5 10 11 12 13 21 22 23 101 102 111 112 121',
  es: '1.º 2.º 3.º 4.º 5.º 10.º 11.º 12.º 13.º 21.º 22.º 23.º 101.º 102.º 111.º 112.º 121.º',
  fi: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  hu: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  id: 'ke-1 ke-2 ke-3 ke-4 ke-5 ke-10 ke-11 ke-12 ke-13 ke-21 ke-22 ke-23 ke-101 ke-102 ke-111 ke-112 ke-121',
  it: '1º 2º 3º 4º 5º 10º 11º 12º 13º 21º 22º 23º 101º 102º 111º 112º 121º',
  ja: '第1 第2 第3 第4 第5 第10 第11 第12 第13 第21 第22 第23 第101 第102 第111 第112 第121',
  ko: '1번째 2번째 3번째 4번째 5번째 10번째 11번째 12번째 13번째 21번째 22번째 23번째 101번째 102번째 111번째 112번째 121번째',
  nb: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  nl: '1e 2e 3e 4e 5e 10e 11e 12e 13e 21e 22e 23e 101e 102e 111e 112e 121e',
  pl: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  'pt-BR': '1º 2º 3º 4º 5º 10º 11º 12º 13º 21º 22º 23º 101º 102º 111º 112º 121º',
  'pt-PT': '1º 2º 3º 4º 5º 10º 11º 12º 13º 21º 22º 23º 101º 102º 111º 112º 121º',
  ro: '1a 2a 3a 4a 5a 10a 11a 12a 13a 21a 22a 23a 101a 102a 111a 112a 121a',
  ru: '1 2 3 4 5 10 11 12 13 21 22 23 101 102 111 112 121',
  sv: '1:a 2:a 3:e 4:e 5:e 10:e 11:e 12:e 13:e 21:a 22:a 23:e 101:a 102:a 111:e 112:e 121:a',
  tr: '1. 2. 3. 4. 5. 10. 11. 12. 13. 21. 22. 23. 101. 102. 111. 112. 121.',
  uk: '1-ий 2-ий 3-ій 4-ий 5-ий 10-ий 11-ий 12-ий 13-ий 21-ий 22-ий 23-ій 101-ий 102-ий 111-ий 112-ий 121-ий',
  'zh-Hans': '第1 第2 第3 第4 第5 第10 第11 第12 第13 第21 第22 第23 第101 第102 第111 第112 第121',
  'zh-Hant': '第1 第2 第3 第4 第5 第10 第11 第12 第13 第21 第22 第23 第101 第102 第111 第112 第121'
}

describe('ordinal', () => {
  for (const [locale, expected] of Object.entries(foundation)) {
    it(`matches Foundation in ${locale}`, () => {
      expect(numbers.map((n) => ordinal(n, locale)).join(' ')).toBe(expected)
    })
  }

  // These two put a space inside the ordinal, so they do not fit the space-separated table.
  it('matches Foundation in th', () => {
    expect(numbers.map((n) => ordinal(n, 'th'))).toEqual(numbers.map((n) => `ที่ ${n}`))
  })

  it('matches Foundation in vi', () => {
    expect(numbers.map((n) => ordinal(n, 'vi'))).toEqual(numbers.map((n) => `thứ ${n}`))
  })

  it('falls back to English for a language it does not know', () => {
    expect(ordinal(3, 'xx')).toBe('3rd')
  })
})
