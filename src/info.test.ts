import { describe, expect, it } from 'vitest'
import { hasFloor, segments, telURL } from './info'

describe('hasFloor', () => {
  it('shows the ground floor, which is 0 and so falsy', () => {
    expect(hasFloor(0)).toBe(true)
  })

  it('shows any floor above it', () => {
    expect(hasFloor(3)).toBe(true)
  })

  it('hides -1, which is how the app stores and shares no floor at all', () => {
    expect(hasFloor(-1)).toBe(false)
  })

  it('hides a floor the payload left out', () => {
    expect(hasFloor(undefined)).toBe(false)
  })
})

describe('telURL', () => {
  it('dials the digits of a number typed with spaces', () => {
    expect(telURL('01 23 45 67 89')).toBe('tel:0123456789')
  })

  it('keeps the international prefix', () => {
    expect(telURL(' +33 (0)6.12-34-56-78')).toBe('tel:+330612345678')
  })

  it('gives nothing to dial when there are no digits', () => {
    expect(telURL('ask the concierge')).toBeNull()
  })
})

describe('segments', () => {
  it('leaves text without links whole, line breaks included', () => {
    expect(segments('Ring twice.\nThe buzzer is faint.')).toEqual([
      { text: 'Ring twice.\nThe buzzer is faint.' }
    ])
  })

  it('turns a markdown link into its label, pointing at its target', () => {
    expect(segments('See [the map](https://example.com/map) first')).toEqual([
      { text: 'See ' },
      { text: 'the map', href: 'https://example.com/map' },
      { text: ' first' }
    ])
  })

  it('links a bare web address, leaving the full stop that ends the sentence', () => {
    expect(segments('Parking: https://example.com/p?a=1.')).toEqual([
      { text: 'Parking: ' },
      { text: 'https://example.com/p?a=1', href: 'https://example.com/p?a=1' },
      { text: '.' }
    ])
  })

  it('links mailto and tel targets', () => {
    expect(segments('[mail](mailto:a@b.c) [call](tel:+331)')).toEqual([
      { text: 'mail', href: 'mailto:a@b.c' },
      { text: ' ' },
      { text: 'call', href: 'tel:+331' }
    ])
  })

  it('leaves a link that could run script as the text it was typed as', () => {
    // An offline code is not authenticated, so this is text anyone can put in front of a
    // recipient.
    expect(segments('[open](javascript:alert(1))')).toEqual([
      { text: '[open](javascript:alert(1))' }
    ])
  })
})
