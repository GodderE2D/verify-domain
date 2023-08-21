import { resolveTxt } from "node:dns/promises";
import { VerificationFailedError } from "../errors/VerificationFailedError.js";
import { getKey } from "./getKey.js";
import type { VerifyOptions } from "../types/VerifyOptions.js";
import { DNSVerifyAbortError } from "../errors/DNSVerifyAbortError.js";

export function verifyUsingDNS(domain: string, name: string, options?: VerifyOptions) {
  if (typeof domain !== "string") throw new TypeError(`domain must be of type string, received ${typeof domain}.`);
  if (typeof name !== "string") throw new TypeError(`name must be of type string, received ${typeof name}.`);

  const { domain: parsedDomain, match } = getKey(domain, name);

  return new Promise<void>((resolve, reject) => {
    resolveTxt(parsedDomain).then((results) => {
      if (!results.flat().includes(match)) return reject(new VerificationFailedError(parsedDomain, match, "dns"));
      return resolve();
    });

    options?.signal?.addEventListener("abort", () => reject(new DNSVerifyAbortError(parsedDomain)));
  });
}
