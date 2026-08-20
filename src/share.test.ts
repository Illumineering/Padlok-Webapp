import { describe, expect, it, vi } from 'vitest'
import { decrypt, offlineAddress, parseLocation, parseURL, resolve, shared } from './share'
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

// MARK: - The offline golden vector
//
// Byte for byte the string pinned in the app's `ModelsTests/QRCodeTests.swift` and the App
// Clip's `AddressPullingTests/Pull+Offline+Tests.swift`. The format is written once per
// module stack over there and once more here, so this vector is what holds all three
// together: if any of them drifts, one of the three suites fails before a real code stops
// opening.
const offlineGolden = [
  'TZBNa4QwEIb_SphzFL_N7k1XLYVSykJPpYdoRhtwFZJIyy7-9062Pewpk5d53ifkBlrh4vSo',
  '0cARilPa5VXSBnGdNUHWllVw6EQUJFV-KptDG9dpBxykUgatJSBOmNmQKWSzZG9S_3BW5lGU0Gy05awzchmQkGFdjdKLdEjYDWbptNsU',
  'wjEToSiEEAWHeV2m_zQJ0zTODuXOod_0TOREtoqKFBVRxYfv6HH2ZT6ic9-9xtP0rDSrYOcPS8Nm3Xrxk3Xmr-5JGjkhPHB1XpQC9k8O',
  'enFoBg9A836uXhtSWye1GaS9b9J9nO_i1E_SUfiCo6P8shp8XsbVf9CZVMx96wE5c1_I-u16RcO0ZaMkRwj7Lw'
].join('')

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

describe('parseURL', () => {
  it('reads an offline code from the fragment', () => {
    expect(parseURL('/', '#v1=' + offlineGolden))
      .toEqual({ kind: 'offline', payload: offlineGolden })
  })

  it('still sees a link as a link', () => {
    expect(parseURL('/addressidentifier', '#addresskey'))
      .toEqual({ kind: 'link', link: { identifier: 'addressidentifier', passphrase: 'addresskey' } })
    expect(parseURL('/addressidentifier/addresskey', ''))
      .toEqual({ kind: 'link', link: { identifier: 'addressidentifier', passphrase: 'addresskey' } })
  })

  it.each(['v2=', 'v3=', 'v10='])('reports %s as a format it does not know', (prefix) => {
    expect(parseURL('/', '#' + prefix + offlineGolden)).toEqual({ kind: 'unsupported' })
  })

  it('takes the prefix as decisive, whatever the path says', () => {
    // The app does the same, and a passphrase cannot collide with the prefix: no generated
    // secret contains '=' at all, so none can begin with `v1=`.
    expect(parseURL('/addressidentifier', '#v1=' + offlineGolden))
      .toEqual({ kind: 'offline', payload: offlineGolden })
  })

  it('is not fooled by a passphrase that merely starts with a v', () => {
    expect(parseURL('/addressidentifier', '#v1andthensome'))
      .toEqual({ kind: 'link', link: { identifier: 'addressidentifier', passphrase: 'v1andthensome' } })
  })

  it.each([
    ['the site root', '/', ''],
    ['an identifier with no passphrase', '/addressidentifier', ''],
    ['a passphrase with no identifier', '/', '#addresskey']
  ])('is neither format: %s', (_label, pathname, hash) => {
    expect(parseURL(pathname, hash)).toBeNull()
  })
})

describe('offlineAddress', () => {
  it('reads the whole address out of the golden vector', async () => {
    const address = await offlineAddress(offlineGolden)

    expect(address.identifier).toBe('6C3F5A2E-1B4D-4E7A-9F80-2A5C7D9E1B3F')
    expect(address.address).toBe('12 rue de la Paix, 75002 Paris, France')
    expect(address.coordinates).toEqual({ latitude: 48.868886, longitude: 2.331497 })
    expect(address.building).toBe('A')
    expect(address.intercom).toBe('DURAND')
    expect(address.staircase).toBe('B')
    expect(address.floor).toBe(3)
    expect(address.flat).toBe('Left')
    expect(address.moreInfos).toBe('Ring twice, the buzzer is faint.')
    expect(address.doors).toEqual([
      { label: { door: {} }, code: '1234A' },
      { label: { custom: { string: 'Garage' } }, code: 'B5678' }
    ])
  })

  it('yields the same shape a share link does, so one view renders both', async () => {
    const fromCode = await offlineAddress(offlineGolden)
    const fromLink = await decrypt(payload(padded13), passphrase)

    // The two vectors describe the same address by different routes, which is the property
    // that lets `AddressView` stay unaware of where its data came from.
    expect(Object.keys(fromCode).sort()).toEqual(Object.keys(fromLink).sort())
    expect(fromCode).toEqual(fromLink)
  })

  it('reads a payload that arrives without its base64 padding', async () => {
    // Which every real one does — the sender strips '='. This asserts the outcome and not
    // the mechanism: `atob` is forgiving-base64 and would accept the vector even if the
    // module stopped restoring the padding, so nothing here can pin that step. See
    // `bytesFromBase64URL`.
    expect(offlineGolden).toHaveLength(366)
    expect(offlineGolden.length % 4).toBe(2)
    await expect(offlineAddress(offlineGolden)).resolves.toBeTruthy()
  })

  it('refuses a payload of a length no padding could make valid', async () => {
    // 4n+1 characters: the one case forgiving-base64 rejects outright.
    await expect(offlineAddress(offlineGolden.slice(0, 361))).rejects.toThrow()
  })

  it('refuses an empty payload', async () => {
    await expect(offlineAddress('')).rejects.toThrow('Empty offline payload')
  })

  it('refuses a payload that is not base64url', async () => {
    await expect(offlineAddress('!!!!')).rejects.toThrow()
  })

  it('refuses base64 of something that was never deflated', async () => {
    // 'hello world', which decodes cleanly and then has no deflate stream in it.
    await expect(offlineAddress('aGVsbG8gd29ybGQ')).rejects.toThrow()
  })

  it('refuses a truncated payload', async () => {
    // A partial scan, or a code someone cut short. The inflate has to fail rather than hand
    // back whatever it managed to read.
    await expect(offlineAddress(offlineGolden.slice(0, -40))).rejects.toThrow()
  })

  it('refuses a payload that inflates to something that is not JSON', async () => {
    // deflate-raw of the bytes 'not json at all' — it decodes and inflates perfectly, and
    // only then turns out to be nothing we can use.
    await expect(offlineAddress('y8svUcgqzs9TSCxRSMzJAQA')).rejects.toThrow()
  })
})

describe('resolve, for an offline code', () => {
  it('returns the address without touching the network', async () => {
    const fetcher = stubFetch(payload(padded5))
    const address = await resolve('/', '#v1=' + offlineGolden, fetcher)

    expect(address.address).toBe('12 rue de la Paix, 75002 Paris, France')
    // The whole point of the format: nothing was uploaded, so there is nothing to ask for.
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('reports a format from a newer app rather than calling it a bad route', async () => {
    const fetcher = stubFetch(payload(padded5))
    await expect(resolve('/', '#v2=' + offlineGolden, fetcher))
      .rejects.toThrow('Unsupported offline code format')

    expect(fetcher).not.toHaveBeenCalled()
  })

  it('still resolves a share link through the network', async () => {
    const fetcher = stubFetch(payload(padded5))
    const address = await resolve('/addressidentifier', '#' + passphrase, fetcher)

    expect(fetcher).toHaveBeenCalledWith('https://api.padlok.app/shared/addressidentifier')
    expect(address.moreInfos).toBe('Ring twice, the buzzer is faint.!!!!!!!!')
  })
})
