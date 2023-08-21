import { createHash } from "node:crypto";

export function getKey(domain: string, name: string) {
  if (typeof domain !== "string") throw new TypeError(`domain must be of type string, received ${typeof domain}.`);
  if (typeof name !== "string") throw new TypeError(`name must be of type string, received ${typeof name}.`);

  if (domain.startsWith("http://")) domain = domain.slice(7);
  else if (domain.startsWith("https://")) domain = domain.slice(8);
  domain = domain.split("/")[0];
  if (domain.endsWith(".")) domain = domain.slice(0, -1);

  const key = createHash("sha256").update(`_${name}.${domain}:${name}`).digest("hex");

  return {
    key,
    domain: `_${name}.${domain}`,
    url: `http://${domain}/.well-known/${name}`,
    match: `${name}-verification=${key}`,
  };
}
