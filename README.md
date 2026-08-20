# Padlok Share WebApp

This webapp is about getting & uncrypt client-side the information shared by another user.

Identifier & passphrase will be in url, like:

```
https://share.padlok.app/<identifier>#<passphrase>
```

Legacy urls:
```
https://share.padlok.app/<identifier>/<passphrase>
```

Offline codes carry the address itself rather than a pointer to it, so there is nothing to
fetch and nothing to decrypt:

```
https://share.padlok.app/#v1=<base64url(deflate(json))>
```

## Install, Serve & Build

First, we need to install dependencies:
```
$ npm install
```

Then we can either serve for development, or build for production:
```
$ npm run dev # Development
$ npm run build # Production
```

## How does it work?

The webapp first load the identifier & the passphrase from the URL.

Then, it gets the encrypted data from the [Padlok API](https://github.com/Dean151/Padlok-API) using the share endpoint:

```
GET https://api.padlok.app/shared/<identifier>
```

The data fetched will be of the following form:

```
{
    "iterations": 1000,
    "salt": "<base64encoded>",
    "sealed": "<base64encoded>"
}
```

The key should be derived using PBKDF2<SHA256> with the above salt and iterations count, and the passphrase from the URL as the initial password data.

The resulting key will be able to decrypt the sealed data using AES-GCM algorithm, with PKCS7 padding mode.

The sealed data is composed by appending the following data: `sealed = nonce + ciphertext`.

Since the nonce is 16 bytes long, we can easily break appart the three info in order to decrypt back the underlying data.

## Offline codes

A share link is a promise: the recipient has to reach the API and decrypt before the page
knows anything, and the sender has to have uploaded the address for there to be something to
reach. Showing a QR code to the person standing next to you needs neither, so the `v1` format
puts the payload in the code:

```
https://share.padlok.app/#v1=<base64url(deflate(json))>
```

The `v1=` prefix on the fragment is what tells one of these apart from a share link, and the
path is never consulted — which is how the app decides too. That is unambiguous rather than
merely convenient: a passphrase can never begin with `v1=`, because the app strips every `=`
out of the base64 noise it generates secrets from, so no passphrase contains one at all.

The payload rides in the fragment for the same reason a passphrase does — a fragment never
leaves the device, so door codes stay out of the server's logs.

To read one, take the fragment after the `v1=` prefix and:

1. Decode it as base64url. The padding is stripped on the way out, since `=` reads as a query
   separator to anything that mishandles a fragment. In a browser this needs no undoing —
   `atob` is forgiving-base64 — but a strict decoder such as Foundation's wants it back.
2. Inflate the result. This is *raw* DEFLATE ([RFC 1951][rfc1951]) with no zlib wrapper —
   what Apple's `NSData.compressed(using: .zlib)` writes — so the matching web API is
   `new DecompressionStream('deflate-raw')`, not `'deflate'`.
3. Parse the JSON. It is the very same shape as a share link's decrypted payload, so it
   renders through exactly the same view.

`v1` is the format, not a versioning scheme. The prefix is only there so that an unknown one
is reported rather than swallowed.

The same wire format is implemented in the app (`SharedBuilding+QRCode.swift`) and the App
Clip (`Address+QRCode.swift`), each pinned to a shared golden vector.

[rfc1951]: https://www.rfc-editor.org/rfc/rfc1951
