# verify-domain

verify-domain allows you to verify whether someone owns a domain name or a subdomain. It can do this in two ways:

- **DNS (recommended):** This checks whether or not a TXT record is present on a subdomain with a generated key.
- **HTTP**: This checks whether a generated key is present in a text file on the domain.

---

## Install

> [!NOTE]  
> verify-domain requires Node.js 17 or higher to work.

You can install verify-domain via npm or your favourite package manager.

```sh
npm install verify-domain
```

## Verify using DNS

You can easily verify using a TXT DNS record on `_name.domain.invalid`, with `name` being the name you provided. This is
the recommended way of verifying a domain. verify-domain handles all queries and key generation for you.

```js
const { getKey, verifyUsingDNS } = require("verify-domain");

// name should be your application name or something similar
const { match, domain } = await getKey("domain.invalid", "name");
console.log(`You need to enter '${match}' as a TXT record into ${domain}`);

try {
  await verifyUsingDNS("domain.invalid", "name");
  console.log("Verified!");
} catch (err) {
  console.error(err);
}
```

## Verify using HTTP

You can also verify using HTTP(S) by letting users add a text file to `http://domain.invalid/.well-known/name`, with
`name` being the name you provided.

```js
const { getKey, verifyUsingHTTP } = require("verify-domain");

// name should be your application name or something similar
const { match, url } = await getKey("domain.invalid", "name");
console.log(`You need to have a file with '${match}' at ${url}`);

try {
  await verifyUsingHTTP("domain.invalid", "name");
  console.log("Verified!");
} catch (err) {
  console.error(err);
}
```

## Usage with `AbortController`

You can also pass in a `AbortSignal` to the options when verifying. This allows you to cancel the verification process
as you desire, like after a certain amount of time.

For DNS verification, a custom `DNSVerifyAbortError` will be thrown (which can be imported). For HTTP verification, a
`DOMException` (Node.js global) will be thrown. In both cases, you can check that `error.name` is `AbortError`.

```js
const { verifyUsingHTTP } = require("verify-domain");

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5_000); // Abort after 5 seconds

try {
  await verifyUsingHTTP("domain.invalid", "name", { signal: controller.signal });
  console.log("Verified!");
} catch (error) {
  if (error.name === "AbortError") {
    console.error("Verification timed out!");
  } else {
    console.error(error);
  }
}

clearTimeout(timeout);
```
