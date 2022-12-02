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