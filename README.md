# Padlok Share WebApp

This webapp is about getting & uncrypt client-side the informations shared by another user.

Identifier & passphrase will be in url, like:

```
https://share.padlok.app/<identifier>/<passphrase>
```

And locale may be forced:

```
https://share.padlok.app/<locale>/<identifier>/<passphrase>
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
    "key": "<base64encoded>",
    "sealed": "<base64encoded>"
}
```

The key should be derived using HKDF<SHA256> expansion algorithm, with the above key as "info", and the passphrase from the URL as the pseudoRandomKey.

The resulting key will be able to decrypt the sealed data using ChaCha20 Poly1305 algorithm.

The sealed data is composed by appending the following data: `sealed = nonce + ciphertext + tag`.

Since tag is 16 bytes long, and the nonce is 12 bytes long, so we can easily break appart the three infos in order to decrypt back the underlying data.