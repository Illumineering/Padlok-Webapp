// Turning a share URL into an address.
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

/** The address a share URL points at: parsed, fetched, then decrypted. */
export const resolve = async function (pathname: string, hash: string, fetcher: Fetcher = fetch): Promise<SharedAddress> {
  const link = parseLocation(pathname, hash)
  if (!link) {
    throw new Error('Wrong route')
  }
  return decrypt(await shared(link.identifier, fetcher), link.passphrase)
}
