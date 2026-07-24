import { isIP } from "node:net";
import { headers } from "next/headers";

/**
 * Forward the client address that Nginx overwrites on requests to Next.js.
 * Never forward the inbound X-Forwarded-For chain: clients can supply it.
 * This remains trustworthy only while Next.js is loopback-bound behind Nginx.
 */
export async function getTrustedClientForwardingHeaders(): Promise<
  Record<string, string>
> {
  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-real-ip")?.trim();

  if (!clientIp || isIP(clientIp) === 0) return {};

  return { "X-Forwarded-For": clientIp };
}
