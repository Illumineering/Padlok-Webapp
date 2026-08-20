import { describe, expect, it, vi } from 'vitest'
import { decrypt, parseLocation, resolve, shared } from './share'
import type { EncryptedPayload, Fetcher } from './share'

// MARK: - The golden vectors
//
// Built to the app's scheme, which `Core/Sources/Core/Address+Share.swift` defines:
//
//   key    = PBKDF2<SHA-256>(passphrase, salt, iterations) -> 32 bytes
//   padded = JSON + PKCS7 to a 16-byte boundary (a full block when already aligned)
//   sealed = nonce(16) + AES-256-GCM(padded, iv: nonce) + tag(16)
//
// Pinned rather than generated so that a change to any step of that chain fails here. The
// Swift side only round-trips its own encryption, so nothing over there would notice.
const passphrase = 'Xk7pQm2wRt9v'
const salt = 'WtPxyeK0hwY='
const iterations = 1000

// Two vectors, differing only in the length of `moreInfos` and so in how much PKCS7 padding
// trails the JSON. That length alone decides whether the padding is legal JSON whitespace,
// which is the difference between parsing on the first attempt and going round the loop.
//
// 395 bytes of JSON -> 5 bytes of 0x05, a control character. The loop truncates 5 times.
const padded5 = 'nx4tPEtaaXiHlqW0w9Lh8PUggFwQ3QxM0rr/v9GuCx6VVutI4QaStYvXDyBdl4dDOTfpRLhfsw6rYryz7JnI/ggBWGTmX/faXa0Ve86dMXLCdMpVXlDe9M8gUCQGtaGR3p82mmEP6p13Vxlg/ZjSoh9+gNTTXJYYKTsYfr9raa5lbkllfFGDq4ig1HV+4LGPv/wCjrHoIfsPyIgsHEjpsqv3q5OT+qQM2hKJzkh7wE1mnbe53cbIKrnO8MHMjbcaunRcNhC2XEIPQX6y3hBa7TRn2VS1nGLcNrKq4rHU3CqMA28U6wwCCKho9gd4ScgvInOpZ7CBdJ4QgVpdt9IrNkAWlVt7k8FvDzUvehP8rS5MkffbgXQ4dvUpze/xNQz8ogFarCpAUP5RIUCbtDzMek6jkbdGl+pmghriDX5Ewuz09xcZq404hb9rKiJ2Y04TLcWDxdN6WwueyjWwrHQEZQpVkZWLvOScwtmudQCcXFJzc+yw3erjoqjeYfhvdz+UwcinCBAHIhrXH2ubKlXTscekyNk++r2TuwXuZ/AajvILdPF/ZKf+ENA1RLRWtR2c'

// 387 bytes of JSON -> 13 bytes of 0x0d, which is '\r'. JSON.parse accepts it as trailing
// whitespace, so this one never enters the loop at all.
const padded13 = 'nx4tPEtaaXiHlqW0w9Lh8PUggFwQ3QxM0rr/v9GuCx6VVutI4QaStYvXDyBdl4dDOTfpRLhfsw6rYryz7JnI/ggBWGTmX/faXa0Ve86dMXLCdMpVXlDe9M8gUCQGtaGR3p82mmEP6p13Vxlg/ZjSoh9+gNTTXJYYKTsYfr9raa5lbkllfFGDq4ig1HV+4LGPv/wCjrHoIfsPyIgsHEjpsqv3q5OT+qQM2hKJzkh7wE1mnbe53cbIKrnO8MHMjbcaunRcNhC2XEIPQX6y3hBa7TRn2VS1nGLcNrKq4rHU3CqMA28U6wwCCKho9gd4ScgvInOpZ7CBdJ4QgVpdt9IrNkAWlVt7k8FvDzUvehP8rS5MkffbgXQ4dvUpze/xNQz8ogFarCpAUP5RIUCbtDzMek6jkbdGl+pmghriDX5Ewuz09xcZq404hb9rKiJ2Y04TLcWDxdN6WwueyjWwrHQEZQpVkZWLvOScwtmudQCcXFJzc+yw3erjoqjeYfhvdz+UwcinCBAHIhrXH2ubKlXTscenlPUS1pG/lyqeb/gShvqnUTHRKuqYQ42PmnBlCAZk'

// Sealed under the same key, but wrapping the bytes `not json at all` — 15 of them, so one
// byte of 0x01 padding. It decrypts perfectly and no prefix of it is JSON, which is the one
// way the truncation loop can run out.
const notJson = 'nx4tPEtaaXiHlqW0w9Lh8OBtnRgfwBdLlLLu7ZL4RSmCh5Ok5dEcN8NhAWKBOHPo'

const payload = (sealed: string): EncryptedPayload => ({ iterations, salt, sealed })

// A fetch that answers with `json`, and records what it was asked for.
const stubFetch = function (json: unknown): Fetcher & ReturnType<typeof vi.fn> {
  return vi.fn(async () => ({ json: async () => json }))
}

describe('parseLocation', () => {
  it('reads the passphrase from the fragment', () => {
    expect(parseLocation('/addressidentifier', '#addresskey'))
      .toEqual({ identifier: 'addressidentifier', passphrase: 'addresskey' })
  })

  it('reads a legacy link, where the passphrase was a path component', () => {
    expect(parseLocation('/addressidentifier/addresskey', ''))
      .toEqual({ identifier: 'addressidentifier', passphrase: 'addresskey' })
  })

  it('ignores empty path components, so a trailing slash is harmless', () => {
    expect(parseLocation('/addressidentifier/addresskey/', ''))
      .toEqual({ identifier: 'addressidentifier', passphrase: 'addresskey' })
    expect(parseLocation('//addressidentifier//', '#addresskey'))
      .toEqual({ identifier: 'addressidentifier', passphrase: 'addresskey' })
  })

  it('takes the fragment whole, however little it looks like a passphrase', () => {
    // It is the sender's secret, not ours to validate: anything non-empty is passed on and
    // the crypto is what rejects it.
    expect(parseLocation('/id', '#a/b=c&d')).toEqual({ identifier: 'id', passphrase: 'a/b=c&d' })
  })

  it('accepts a fragment with no leading hash, as `location.hash` omits it when empty', () => {
    expect(parseLocation('/id', 'key')).toEqual({ identifier: 'id', passphrase: 'key' })
  })

  it.each([
    ['the site root', '/', ''],
    ['an identifier with no passphrase', '/addressidentifier', ''],
    ['an identifier with an empty fragment', '/addressidentifier', '#'],
    ['a passphrase with no identifier', '/', '#addresskey'],
    ['more components than a link has', '/one/two/three', ''],
    ['more components than a link has, plus a fragment', '/one/two/three', '#four']
  ])('is not a share link: %s', (_, pathname, hash) => {
    expect(parseLocation(pathname, hash)).toBeNull()
  })
})

describe('decrypt', () => {
  it('opens a payload whose padding takes the truncation loop', async () => {
    const address = await decrypt(payload(padded5), passphrase)

    expect(address.identifier).toBe('6C3F5A2E-1B4D-4E7A-9F80-2A5C7D9E1B3F')
    expect(address.address).toBe('12 rue de la Paix, 75002 Paris, France')
    expect(address.coordinates).toEqual({ latitude: 48.868886, longitude: 2.331497 })
    expect(address.building).toBe('A')
    expect(address.intercom).toBe('DURAND')
    expect(address.staircase).toBe('B')
    expect(address.floor).toBe(3)
    expect(address.flat).toBe('Left')
    expect(address.moreInfos).toBe('Ring twice, the buzzer is faint.!!!!!!!!')
  })

  it('opens a payload whose padding is JSON whitespace and never enters the loop', async () => {
    const address = await decrypt(payload(padded13), passphrase)

    expect(address.address).toBe('12 rue de la Paix, 75002 Paris, France')
    expect(address.moreInfos).toBe('Ring twice, the buzzer is faint.')
  })

  it('keeps the doors in order, with the labels the view switches on', async () => {
    const address = await decrypt(payload(padded5), passphrase)

    // `label` is Swift's enum encoding: the case name as the key. The view tests each name
    // in turn, so an empty object here is the point — it only has to be truthy.
    expect(address.doors).toEqual([
      { label: { door: {} }, code: '1234A' },
      { label: { custom: { string: 'Garage' } }, code: 'B5678' }
    ])
  })

  it('refuses a wrong passphrase', async () => {
    await expect(decrypt(payload(padded5), 'wrongpassphrase')).rejects.toThrow()
  })

  it('refuses a payload whose iteration count does not match', async () => {
    await expect(decrypt({ iterations: 999, salt, sealed: padded5 }, passphrase)).rejects.toThrow()
  })

  it('refuses a payload sealed under a different salt', async () => {
    await expect(decrypt({ iterations, salt: 'AAAAAAAAAAA=', sealed: padded5 }, passphrase)).rejects.toThrow()
  })

  it('refuses a tampered payload, because GCM authenticates it', async () => {
    // Flip the last base64 character of the sealed blob, which lands in the tag.
    const tampered = padded5.slice(0, -1) + (padded5.endsWith('c') ? 'd' : 'c')
    await expect(decrypt(payload(tampered), passphrase)).rejects.toThrow()
  })

  it('refuses a truncated payload', async () => {
    await expect(decrypt(payload(padded5.slice(0, -40)), passphrase)).rejects.toThrow()
  })

  // Cast, because the type says a payload always has an iteration count and these do not.
  // That is the point: the guard exists for what the API might actually send, and the type
  // describes the contract rather than enforcing it over the wire.
  it.each<[string, Partial<EncryptedPayload>]>([
    ['no iteration count', { salt, sealed: padded5 }],
    ['a zero iteration count', { iterations: 0, salt, sealed: padded5 }]
  ])('refuses a payload with %s', async (_label, broken) => {
    await expect(decrypt(broken as EncryptedPayload, passphrase))
      .rejects.toThrow('Could not decode base64 for salt or sealed')
  })

  it('refuses a payload whose base64 is not base64', async () => {
    await expect(decrypt({ iterations, salt, sealed: '!!!!' }, passphrase)).rejects.toThrow()
  })

  it('reports a block that decrypts but holds no JSON, rather than resolving to nothing', async () => {
    // The passphrase was right, so this is not a wrong-link failure — but there is no JSON to
    // find and the loop runs out. It has to throw: returning nothing leaves the page loading
    // for ever, which is what it used to do.
    await expect(decrypt(payload(notJson), passphrase)).rejects.toThrow('Decrypted data is not JSON')
  })
})

describe('shared', () => {
  it('asks the API for the identifier it was given', async () => {
    const fetcher = stubFetch(payload(padded5))
    await shared('addressidentifier', fetcher)

    expect(fetcher).toHaveBeenCalledWith('https://api.padlok.app/shared/addressidentifier')
  })

  it('reports an error the API describes in its body', async () => {
    // The API answers 200 with `{error, reason}` rather than a status code, so the body is
    // the only place a failure shows up.
    const fetcher = stubFetch({ error: true, reason: 'Address not found' })
    await expect(shared('addressidentifier', fetcher)).rejects.toThrow('Address not found')
  })

  it('propagates a network failure', async () => {
    const fetcher = vi.fn(async () => { throw new Error('offline') })
    await expect(shared('addressidentifier', fetcher)).rejects.toThrow('offline')
  })
})

describe('resolve', () => {
  it('parses, fetches and decrypts a current link', async () => {
    const fetcher = stubFetch(payload(padded5))
    const address = await resolve('/addressidentifier', '#' + passphrase, fetcher)

    expect(fetcher).toHaveBeenCalledWith('https://api.padlok.app/shared/addressidentifier')
    expect(address.address).toBe('12 rue de la Paix, 75002 Paris, France')
  })

  it('parses, fetches and decrypts a legacy link', async () => {
    const fetcher = stubFetch(payload(padded5))
    const address = await resolve('/addressidentifier/' + passphrase, '', fetcher)

    expect(address.address).toBe('12 rue de la Paix, 75002 Paris, France')
  })

  it('rejects a URL that is not a share link without troubling the API', async () => {
    const fetcher = stubFetch(payload(padded5))
    await expect(resolve('/', '', fetcher)).rejects.toThrow('Wrong route')

    expect(fetcher).not.toHaveBeenCalled()
  })
})
