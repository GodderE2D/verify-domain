export class DNSVerifyAbortError extends Error {
  constructor(domain: string) {
    super(`Verification for '${domain}' was aborted.`);
    this.name = "AbortError";
  }
}
