import { VerificationFailedError } from "../errors/VerificationFailedError.js";
import { fetch } from "undici";
import { getKey } from "./getKey.js";
import type { VerifyOptions } from "../types/VerifyOptions.js";

export async function verifyUsingHTTP(domain: string, name: string, options?: VerifyOptions) {
  if (typeof domain !== "string") throw new TypeError(`domain must be of type string, received ${typeof domain}.`);
  if (typeof name !== "string") throw new TypeError(`name must be of type string, received ${typeof name}.`);

  const { match, url } = getKey(domain, name);

  const res = await fetch(url, { signal: options?.signal });
  const text = await res.text();
  if (text.trim() !== match) throw new VerificationFailedError(url, match, "http");
}
