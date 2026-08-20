// Turning a share URL into an address.
//
// Two formats arrive here and both end in the same `SharedAddress`. A share link is a
// pointer: it has to be fetched and decrypted before the page knows anything. An offline
// code carries the address in its own fragment, so it needs neither.
//
// This lives apart from the view for one reason: it can be tested without a browser. The
// location arrives as two arguments rather than being read off `window`, and every step
// returns a promise instead of writing to a ref, so a test can hand it a URL and a stubbed
// `fetch` and assert on what comes back.

const api = 'https://api.padlok.app'

// MARK: - The wire shape
//
// These mirror `SharedBuilding` in the app's `Core/Sources/Core/Address+Share.swift`. They
// are what the app encrypts, so they are a contract with another codebase rather than a
// convenience — which is the reason to write them down at all. Nothing here is validated at
// runtime; see the cast in `decrypt`.

/** A door's label, in the shape Swift encodes an enum: the case name as the only key. */
export type DoorLabel =
  | { door: Record<string, never> }
  | { gate: Record<string, never> }
  | { portal: Record<string, never> }
  | { padlock: Record<string, never> }
  | { custom: { string: string } }

export interface SharedDoor {
  label: DoorLabel
  code: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

/** An address as it travels: the app's `SharedBuilding`, once decrypted. */
export interface SharedAddress {
  identifier: string
  address: string
  coordinates: Coordinates
  doors: SharedDoor[]
  building?: string
  intercom?: string
  staircase?: string
  floor?: number
  flat?: string
  moreInfos?: string
  /**
   * Rendered as a heading above the street when present. No version of the app sends it —
   * `SharedBuilding` has no such field — so it is only ever absent in practice.
   */
  name?: string
}

/** What the API holds for an identifier: the sealed address, and how to open it. */
export interface EncryptedPayload {
  /** PBKDF2 iteration count. */
  iterations: number
  /** PBKDF2 salt, base64. */
  salt: string
  /** base64 of nonce(16) + ciphertext + GCM tag(16). */
  sealed: string
}

/** A failure the API describes in the body of an otherwise fine response. */
interface ApiError {
  error: true
  reason: string
}

type SharedResponse = EncryptedPayload | Partial<ApiError>

/**
 * Just enough of `fetch` to ask for a payload. Narrower than `typeof fetch` so that a test
 * can stand in for it without conjuring a whole `Response`.
 */
export type Fetcher = (url: string) => Promise<{ json: () => Promise<unknown> }>

/** The two halves of a share link. */
export interface ShareLink {
  identifier: string
  passphrase: string
}

/** What a share URL turned out to be. */
export type ShareTarget =
  /** A pointer to an address. Still has to be fetched and decrypted. */
  | { kind: 'link', link: ShareLink }
  /** The address itself, in the fragment. Nothing left to fetch. */
  | { kind: 'offline', payload: string }
  /** An offline code in a format newer than this page understands. */
  | { kind: 'unsupported' }

// MARK: - Reading the URL

/**
 * The two halves of a share link, or null when the URL carries neither.
 *
 * ```
 * https://share.padlok.app/<identifier>#<passphrase>
 * https://share.padlok.app/<identifier>/<passphrase>   (legacy)
 * ```
 *
 * The passphrase belongs in the fragment, which never leaves the device — the legacy shape
 * put it in the path, where it reached the server, and those links are still in the wild.
 */
export const parseLocation = function (pathname: string, hash: string): ShareLink | null {
  const components = pathname.split('/').filter((el) => el !== '')
  const fragment = hash.startsWith('#') ? hash.substring(1) : hash

  let identifier: string | undefined
  let passphrase: string | undefined

  // Get passphrase from uri fragment
  if (components.length === 1 && fragment) {
    [identifier] = components
    passphrase = fragment
  }

  // Legacy links management
  if (components.length === 2) {
    [identifier, passphrase] = components
  }

  if (!identifier || !passphrase) {
    return null
  }
  return { identifier, passphrase }
}

/**
 * Which of the two formats a URL is, or null when it is neither.
 *
 * ```
 * https://share.padlok.app/<identifier>#<passphrase>     a link
 * https://share.padlok.app/<identifier>/<passphrase>     a link, legacy
 * https://share.padlok.app/#v1=<payload>                 an offline code
 * ```
 *
 * The fragment decides and the path is never consulted, which is how the app tells the two
 * apart as well. That is unambiguous rather than merely convenient: a passphrase can never
 * begin with `v1=`, because the app strips every '=' out of the base64 noise it generates
 * secrets from — so no passphrase contains one at all.
 */
export const parseURL = function (pathname: string, hash: string): ShareTarget | null {
  const fragment = hash.startsWith('#') ? hash.substring(1) : hash

  if (fragment.startsWith(offlinePrefix)) {
    return { kind: 'offline', payload: fragment.substring(offlinePrefix.length) }
  }
  // A format from a newer app. Reported rather than swallowed as a bad route, which is the
  // only reason the prefix carries a number at all.
  if (/^v\d+=/.test(fragment)) {
    return { kind: 'unsupported' }
  }

  const link = parseLocation(pathname, hash)
  return link ? { kind: 'link', link } : null
}

// MARK: - Offline codes
//
// The address itself, carried in the code rather than pointed at by it:
//
//   https://share.padlok.app/#v1=<base64url(deflate(JSON))>
//
// Nothing was uploaded, so there is nothing to fetch and nothing to decrypt. The payload
// rides in the fragment for the same reason a passphrase does — a fragment never leaves the
// device, so door codes stay out of the server's logs.
//
// `v1` names the format rather than a versioning scheme. The same wire format is written by
// the app's `SharedBuilding.qrCodeURL` and read by the App Clip's `Address(qrCodeURL:)`,
// each pinned to a golden vector; this is the third implementation of it.

const offlinePrefix = 'v1='

/**
 * base64url to bytes, with the padding the sender strips put back.
 *
 * '=' comes off on the way out because it reads as a query separator to anything that
 * mishandles a fragment. Putting it back is belt-and-braces here and known to be so: `atob`
 * implements WHATWG forgiving-base64, which accepts an unpadded string outright and rejects
 * only a length of 4n+1, which no amount of padding would rescue. It is restored anyway
 * because the two Swift implementations of this format genuinely need it — Foundation's
 * `Data(base64Encoded:)` is strict — and a decoder swapped in here later may be strict too.
 */
const bytesFromBase64URL = function (payload: string): Uint8Array<ArrayBuffer> {
  const base64 = payload.replaceAll('-', '+').replaceAll('_', '/')
  const padding = '='.repeat((4 - base64.length % 4) % 4)
  return Uint8Array.from(atob(base64 + padding), c => c.charCodeAt(0))
}

/**
 * Raw DEFLATE, inflated.
 *
 * Apple's `NSData.compressed(using: .zlib)` writes RFC 1951 with no zlib wrapper, whatever
 * its name suggests, so 'deflate-raw' is the format that matches it — plain 'deflate'
 * rejects the very same bytes for a bad header.
 *
 * The stream is drained by hand rather than through `new Response(stream).text()`. Both work
 * wherever `DecompressionStream` exists, and this one asks less of the browser on a page
 * whose whole job is to show someone a door code.
 */
const inflate = async function (bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const stream: ReadableStream<Uint8Array> = new Blob([bytes]).stream()
    .pipeThrough(new DecompressionStream('deflate-raw'))
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
    length += value.length
  }
  const inflated = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    inflated.set(chunk, offset)
    offset += chunk.length
  }
  return new TextDecoder().decode(inflated)
}

/**
 * The address an offline code carries.
 *
 * What comes out is the same shape a share link yields once decrypted, so it renders through
 * exactly the same view.
 */
export const offlineAddress = async function (payload: string): Promise<SharedAddress> {
  if (!payload) {
    throw new Error('Empty offline payload')
  }
  // Cast at the wire boundary, as in `decrypt` — with the difference that nothing
  // authenticates an offline code. Whoever draws the QR code chooses what is in it, which is
  // as true of a code on a wall as it is of a link someone sends.
  return JSON.parse(await inflate(bytesFromBase64URL(payload))) as SharedAddress
}

// MARK: - Fetching

/** The encrypted payload the API holds for an identifier. */
export const shared = async function (identifier: string, fetcher: Fetcher = fetch): Promise<EncryptedPayload> {
  const response = await fetcher(api + '/shared/' + identifier)
  const json = await response.json() as SharedResponse
  if ('error' in json && json.error) {
    throw new Error(json.reason)
  }
  return json as EncryptedPayload
}

// MARK: - Decrypting

/**
 * The address sealed inside a payload, given the passphrase that opens it.
 *
 * The key is PBKDF2<SHA-256> over the passphrase, with the salt and iteration count the
 * payload carries. It opens AES-GCM, where `sealed` is nonce + ciphertext + tag — the nonce
 * being a full AES block rather than GCM's usual 12 bytes, because that is what the app
 * generates.
 */
export const decrypt = async function (payload: EncryptedPayload, passphrase: string): Promise<SharedAddress> {
  // A Uint8Array is truthy even when empty, so only the iteration count is worth guarding:
  // a missing salt or sealed blob already throws out of `atob` on the way in.
  if (!payload.iterations) {
    throw new Error('Could not decode base64 for salt or sealed')
  }
  const salt = Uint8Array.from(atob(payload.salt), c => c.charCodeAt(0))
  const sealed = Uint8Array.from(atob(payload.sealed), c => c.charCodeAt(0))
  const nonce = sealed.slice(0, 16)
  const ciphertext = sealed.slice(16)

  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: payload.iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'])
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, ciphertext)

  // The one cast in the module, and an honest one: this is the wire boundary, and the bytes
  // came from a payload only the sender's key could have sealed. Authenticity is what GCM
  // establishes; shape is what the app is trusted for.
  return JSON.parse(unpadded(decrypted)) as SharedAddress
}

/**
 * The JSON inside a decrypted block, with the padding that trails it discarded.
 *
 * The app encrypts through CryptoSwift with `padding: .pkcs7`, and it applies that padding
 * whatever the block mode — so even under GCM, which needs none, the plaintext comes back as
 * the JSON followed by 1 to 16 bytes all equal to that count. There is no length prefix to
 * trust, so the only way back to the JSON is to try parsing and drop a byte at a time.
 *
 * Worth knowing when reading this: three padding lengths are ordinary JSON whitespace — 9,
 * 10 and 13, being tab, newline and carriage return — and those parse on the first attempt
 * with the padding still attached. Every other length is a control character and takes the
 * loop. Both happen in the wild, decided by nothing but the payload's length.
 */
const unpadded = function (decrypted: ArrayBuffer): string {
  const decoder = new TextDecoder()
  let bytes = decrypted
  while (bytes.byteLength) {
    const text = decoder.decode(bytes)
    try {
      JSON.parse(text)
      return text
    } catch {
      bytes = bytes.slice(0, bytes.byteLength - 1)
    }
  }
  // Decryption succeeded, so the passphrase was right, but nothing in the block is JSON.
  // Reported rather than returned empty: the caller would otherwise wait forever.
  throw new Error('Decrypted data is not JSON')
}

// MARK: - The whole journey

/** The address a share URL leads to, whichever of the two formats it is. */
export const resolve = async function (pathname: string, hash: string, fetcher: Fetcher = fetch): Promise<SharedAddress> {
  const target = parseURL(pathname, hash)
  if (!target) {
    throw new Error('Wrong route')
  }
  switch (target.kind) {
    case 'offline':
      return offlineAddress(target.payload)
    case 'unsupported':
      throw new Error('Unsupported offline code format')
    case 'link':
      return decrypt(await shared(target.link.identifier, fetcher), target.link.passphrase)
  }
}
