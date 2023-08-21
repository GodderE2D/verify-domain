export class VerificationFailedError extends Error {
  constructor(domain: string, match: string, type: "dns" | "http") {
    super(
      `Could not verify domain, expected a ${
        type === "dns" ? "TXT record" : "body"
      } of '${match}' to be present at '${domain}'.`,
    );
  }
}
