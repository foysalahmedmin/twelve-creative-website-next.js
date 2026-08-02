/**
 * Reads a `?page=` search param into a usable page number.
 *
 * The value arrives straight from the URL, so it can be anything — absent,
 * "0", "-3", "abc", or a number too large to be an integer. Every one of those
 * resolves to the first page rather than being passed to the API, which would
 * answer an out-of-range page with an empty list and look like data loss.
 */
export function positivePage(value?: string): number {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}
