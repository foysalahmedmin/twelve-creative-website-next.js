/** YYYY-MM-DD in the visitor's local calendar, suitable for date input bounds. */
export function localDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Timestamp formatters that produce the same string on the server and in the
 * browser.
 *
 * date-fns `format` reads the host's timezone, so a server rendering in UTC
 * and a viewer in another zone disagree about which day a timestamp falls on.
 * Inside a client component that disagreement is a hydration mismatch: React
 * throws #418, discards the server-rendered markup and re-renders the tree.
 * Pinning the zone keeps both sides in agreement — the same approach the legal
 * pages already take.
 *
 * The trade-off is deliberate: these are audit timestamps on admin records,
 * where every operator seeing the identical value matters more than seeing it
 * in their own zone.
 */
const dateOnly = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

const dateAndTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const toDate = (value: string | number | Date): Date | null => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** e.g. "2 Aug 26". Returns an em dash for a missing or unparseable value. */
export function formatDate(value: string | number | Date | null | undefined) {
  const date = value == null ? null : toDate(value);
  return date ? dateOnly.format(date) : "—";
}

/** e.g. "2 Aug 26, 14:30". Returns an em dash for a missing value. */
export function formatDateTime(
  value: string | number | Date | null | undefined,
) {
  const date = value == null ? null : toDate(value);
  return date ? dateAndTime.format(date) : "—";
}
